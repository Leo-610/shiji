import { and, count, eq, inArray } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  commentLikes,
  comments,
  threadFavorites,
  threadLikes,
} from "@/lib/db/schema";

export type ThreadEngagement = {
  threadLikeCount: number;
  threadLiked: boolean;
  favorited: boolean;
  commentLikeCounts: Record<string, number>;
  commentLikedIds: string[];
};

export async function getThreadEngagement(
  threadId: string,
  commentIds: string[],
  userId?: string
): Promise<ThreadEngagement> {
  const [threadLikeRow] = await db
    .select({ count: count() })
    .from(threadLikes)
    .where(eq(threadLikes.threadId, threadId));

  let threadLiked = false;
  let favorited = false;
  let commentLikedIds: string[] = [];

  if (userId) {
    const userThreadLike = await db.query.threadLikes.findFirst({
      where: and(
        eq(threadLikes.userId, userId),
        eq(threadLikes.threadId, threadId)
      ),
    });
    threadLiked = !!userThreadLike;

    const userFavorite = await db.query.threadFavorites.findFirst({
      where: and(
        eq(threadFavorites.userId, userId),
        eq(threadFavorites.threadId, threadId)
      ),
    });
    favorited = !!userFavorite;

    if (commentIds.length > 0) {
      const rows = await db
        .select({ commentId: commentLikes.commentId })
        .from(commentLikes)
        .where(
          and(
            eq(commentLikes.userId, userId),
            inArray(commentLikes.commentId, commentIds)
          )
        );
      commentLikedIds = rows.map((r) => r.commentId);
    }
  }

  const commentLikeCounts: Record<string, number> = {};
  if (commentIds.length > 0) {
    const rows = await db
      .select({
        commentId: commentLikes.commentId,
        count: count(),
      })
      .from(commentLikes)
      .innerJoin(comments, eq(comments.id, commentLikes.commentId))
      .where(eq(comments.threadId, threadId))
      .groupBy(commentLikes.commentId);

    for (const row of rows) {
      commentLikeCounts[row.commentId] = row.count;
    }
  }

  return {
    threadLikeCount: threadLikeRow?.count ?? 0,
    threadLiked,
    favorited,
    commentLikeCounts,
    commentLikedIds,
  };
}
