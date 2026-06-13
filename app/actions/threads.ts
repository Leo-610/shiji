"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { threads, comments } from "@/lib/db/schema";
import { isSuperAdmin } from "@/lib/roles";
import { rateLimitForUserOrIp } from "@/lib/rate-limit";
import { CONTENT_MAX_LENGTH } from "@/lib/content";
import { XP_REWARDS } from "@/lib/level";
import { awardPoints } from "@/lib/award";
import { awardXp } from "@/lib/xp";
import { POINT_REWARDS } from "@/lib/points";
import { createThreadSlug } from "@/lib/utils";
import { checkStatAchievements } from "@/lib/achievements";
import { createReplyNotifications } from "@/lib/notifications";
import { trackWeeklyTask } from "@/lib/weekly-tasks";

const createThreadSchema = z.object({
  title: z.string().min(2, "标题至少 2 个字符").max(200),
  content: z
    .string()
    .min(10, "内容至少 10 个字符")
    .max(CONTENT_MAX_LENGTH, "内容不能超过 2 万字"),
  categoryId: z.string().uuid("请选择分类"),
  guestName: z.string().max(50).optional(),
});

const createCommentSchema = z.object({
  content: z
    .string()
    .min(2, "评论至少 2 个字符")
    .max(CONTENT_MAX_LENGTH, "评论不能超过 2 万字"),
  threadId: z.string().uuid(),
  parentId: z.string().uuid().optional(),
  guestName: z.string().max(50).optional(),
});

export async function createThread(formData: FormData) {
  const session = await auth();

  const raw = {
    title: formData.get("title") as string,
    content: formData.get("content") as string,
    categoryId: formData.get("categoryId") as string,
    guestName: (formData.get("guestName") as string) || undefined,
  };

  const parsed = createThreadSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "输入无效" };
  }

  if (!session?.user && !parsed.data.guestName?.trim()) {
    return { error: "匿名发帖请填写昵称" };
  }

  const rate = await rateLimitForUserOrIp("create_thread", session?.user?.id);
  if (!rate.allowed) {
    return { error: rate.error };
  }

  const slug = createThreadSlug();

  const [thread] = await db
    .insert(threads)
    .values({
      title: parsed.data.title,
      slug,
      content: parsed.data.content,
      categoryId: parsed.data.categoryId,
      authorId: session?.user?.id ?? null,
      guestName: session?.user ? null : parsed.data.guestName?.trim(),
    })
    .returning();

  if (session?.user?.id) {
    await awardXp(session.user.id, XP_REWARDS.createThread);
    await awardPoints(session.user.id, POINT_REWARDS.createThread);
    await checkStatAchievements(session.user.id);
    const weeklyRewards = await trackWeeklyTask(session.user.id, "post_thread");
    if (weeklyRewards.length > 0) {
      revalidatePath("/profile");
      revalidatePath("/shop");
      revalidatePath("/", "layout");
    }
  }

  revalidatePath("/");
  revalidatePath("/discussions");
  redirect(`/discussions/${thread.slug}`);
}

export async function createComment(formData: FormData) {
  const session = await auth();

  const raw = {
    content: formData.get("content") as string,
    threadId: formData.get("threadId") as string,
    parentId: (formData.get("parentId") as string) || undefined,
    guestName: (formData.get("guestName") as string) || undefined,
  };

  const parsed = createCommentSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "输入无效" };
  }

  if (!session?.user && !parsed.data.guestName?.trim()) {
    return { error: "匿名评论请填写昵称" };
  }

  const rate = await rateLimitForUserOrIp("create_comment", session?.user?.id);
  if (!rate.allowed) {
    return { error: rate.error };
  }

  const thread = await db.query.threads.findFirst({
    where: eq(threads.id, parsed.data.threadId),
    columns: { id: true, slug: true, authorId: true },
  });

  if (!thread) {
    return { error: "帖子不存在" };
  }

  const [comment] = await db
    .insert(comments)
    .values({
      content: parsed.data.content,
      threadId: parsed.data.threadId,
      parentId: parsed.data.parentId ?? null,
      authorId: session?.user?.id ?? null,
      guestName: session?.user ? null : parsed.data.guestName?.trim(),
    })
    .returning();

  if (session?.user?.id) {
    await awardXp(session.user.id, XP_REWARDS.createComment);
    await awardPoints(session.user.id, POINT_REWARDS.createComment);
    await checkStatAchievements(session.user.id);

    await createReplyNotifications({
      threadId: thread.id,
      threadSlug: thread.slug,
      threadAuthorId: thread.authorId,
      parentId: parsed.data.parentId,
      commenterId: session.user.id,
      commenterName: session.user.name ?? null,
      commentContent: comment.content,
    });

    const weeklyRewards = await trackWeeklyTask(session.user.id, "post_comments");
    if (weeklyRewards.length > 0) {
      revalidatePath("/profile");
      revalidatePath("/shop");
    }
  }

  revalidatePath(`/discussions/${thread.slug}`);
  revalidatePath("/", "layout");

  return { success: true };
}

export async function deleteThread(threadId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "请先登录" };
  }

  const thread = await db.query.threads.findFirst({
    where: eq(threads.id, threadId),
  });

  if (!thread) {
    return { error: "帖子不存在" };
  }

  if (
    thread.authorId !== session.user.id &&
    !isSuperAdmin(session.user.role)
  ) {
    return { error: "无权删除此帖子" };
  }

  await db.delete(threads).where(eq(threads.id, threadId));

  revalidatePath("/");
  revalidatePath("/discussions");
  redirect("/discussions");
}

export async function toggleThreadPin(threadId: string) {
  const session = await auth();
  if (!session?.user?.id || !isSuperAdmin(session.user.role)) {
    return { error: "仅站长可置顶帖子" };
  }

  const thread = await db.query.threads.findFirst({
    where: eq(threads.id, threadId),
  });

  if (!thread) {
    return { error: "帖子不存在" };
  }

  const pinned = !thread.pinned;

  try {
    await db
      .update(threads)
      .set({
        pinned,
        pinnedAt: pinned ? new Date() : null,
      })
      .where(eq(threads.id, threadId));
  } catch {
    return { error: "置顶功能尚未就绪，请稍后再试" };
  }

  revalidatePath("/");
  revalidatePath("/discussions");
  revalidatePath(`/discussions/${thread.slug}`);

  return { success: true, pinned };
}

export async function deleteComment(commentId: string, threadSlug: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "请先登录" };
  }

  const comment = await db.query.comments.findFirst({
    where: eq(comments.id, commentId),
  });

  if (!comment) {
    return { error: "评论不存在" };
  }

  if (
    comment.authorId !== session.user.id &&
    !isSuperAdmin(session.user.role)
  ) {
    return { error: "无权删除此评论" };
  }

  await db.delete(comments).where(eq(comments.id, commentId));
  revalidatePath(`/discussions/${threadSlug}`);

  return { success: true };
}
