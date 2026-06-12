"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { threads, comments } from "@/lib/db/schema";
import { rateLimitForUserOrIp } from "@/lib/rate-limit";
import { createThreadSlug } from "@/lib/utils";

const createThreadSchema = z.object({
  title: z.string().min(2, "标题至少 2 个字符").max(200),
  content: z.string().min(10, "内容至少 10 个字符"),
  categoryId: z.string().uuid("请选择分类"),
  guestName: z.string().max(50).optional(),
});

const createCommentSchema = z.object({
  content: z.string().min(2, "评论至少 2 个字符"),
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

  await db.insert(comments).values({
    content: parsed.data.content,
    threadId: parsed.data.threadId,
    parentId: parsed.data.parentId ?? null,
    authorId: session?.user?.id ?? null,
    guestName: session?.user ? null : parsed.data.guestName?.trim(),
  });

  const thread = await db.query.threads.findFirst({
    where: eq(threads.id, parsed.data.threadId),
  });

  if (thread) {
    revalidatePath(`/discussions/${thread.slug}`);
  }

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

  if (thread.authorId !== session.user.id) {
    return { error: "无权删除此帖子" };
  }

  await db.delete(threads).where(eq(threads.id, threadId));

  revalidatePath("/");
  revalidatePath("/discussions");
  redirect("/discussions");
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

  if (comment.authorId !== session.user.id) {
    return { error: "无权删除此评论" };
  }

  await db.delete(comments).where(eq(comments.id, commentId));
  revalidatePath(`/discussions/${threadSlug}`);

  return { success: true };
}
