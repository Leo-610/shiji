"use server";

import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  commentLikes,
  comments,
  threadFavorites,
  threadLikes,
  threads,
} from "@/lib/db/schema";
import { XP_REWARDS } from "@/lib/level";
import { awardPoints } from "@/lib/award";
import { awardXp } from "@/lib/xp";
import { POINT_REWARDS } from "@/lib/points";

async function requireUser() {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "请先登录" as const };
  }
  return { userId: session.user.id };
}

export async function toggleThreadLike(threadId: string, threadSlug: string) {
  const user = await requireUser();
  if ("error" in user) return user;

  const existing = await db.query.threadLikes.findFirst({
    where: and(
      eq(threadLikes.userId, user.userId),
      eq(threadLikes.threadId, threadId)
    ),
  });

  if (existing) {
    await db
      .delete(threadLikes)
      .where(
        and(
          eq(threadLikes.userId, user.userId),
          eq(threadLikes.threadId, threadId)
        )
      );
    revalidatePath(`/discussions/${threadSlug}`);
    return { liked: false };
  }

  await db.insert(threadLikes).values({
    userId: user.userId,
    threadId,
  });

  const thread = await db.query.threads.findFirst({
    where: eq(threads.id, threadId),
    columns: { authorId: true },
  });
  if (thread?.authorId && thread.authorId !== user.userId) {
    await awardXp(thread.authorId, XP_REWARDS.receiveThreadLike);
    await awardPoints(thread.authorId, POINT_REWARDS.receiveThreadLike);
  }

  revalidatePath(`/discussions/${threadSlug}`);
  return { liked: true };
}

export async function toggleCommentLike(
  commentId: string,
  threadSlug: string
) {
  const user = await requireUser();
  if ("error" in user) return user;

  const existing = await db.query.commentLikes.findFirst({
    where: and(
      eq(commentLikes.userId, user.userId),
      eq(commentLikes.commentId, commentId)
    ),
  });

  if (existing) {
    await db
      .delete(commentLikes)
      .where(
        and(
          eq(commentLikes.userId, user.userId),
          eq(commentLikes.commentId, commentId)
        )
      );
    revalidatePath(`/discussions/${threadSlug}`);
    return { liked: false };
  }

  await db.insert(commentLikes).values({
    userId: user.userId,
    commentId,
  });

  const comment = await db.query.comments.findFirst({
    where: eq(comments.id, commentId),
    columns: { authorId: true },
  });
  if (comment?.authorId && comment.authorId !== user.userId) {
    await awardXp(comment.authorId, XP_REWARDS.receiveCommentLike);
    await awardPoints(comment.authorId, POINT_REWARDS.receiveCommentLike);
  }

  revalidatePath(`/discussions/${threadSlug}`);
  return { liked: true };
}

export async function toggleThreadFavorite(threadId: string, threadSlug: string) {
  const user = await requireUser();
  if ("error" in user) return user;

  const existing = await db.query.threadFavorites.findFirst({
    where: and(
      eq(threadFavorites.userId, user.userId),
      eq(threadFavorites.threadId, threadId)
    ),
  });

  if (existing) {
    await db
      .delete(threadFavorites)
      .where(
        and(
          eq(threadFavorites.userId, user.userId),
          eq(threadFavorites.threadId, threadId)
        )
      );
    revalidatePath(`/discussions/${threadSlug}`);
    return { favorited: false };
  }

  await db.insert(threadFavorites).values({
    userId: user.userId,
    threadId,
  });
  revalidatePath(`/discussions/${threadSlug}`);
  return { favorited: true };
}
