import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { comments, notifications } from "@/lib/db/schema";

export type NotificationType = "thread_reply" | "comment_reply";

function previewText(content: string, max = 72): string {
  const trimmed = content.replace(/\s+/g, " ").trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max)}…`;
}

export async function createReplyNotifications({
  threadId,
  threadSlug,
  threadAuthorId,
  parentId,
  commenterId,
  commenterName,
  commentContent,
}: {
  threadId: string;
  threadSlug: string;
  threadAuthorId: string | null;
  parentId?: string | null;
  commenterId: string;
  commenterName: string | null;
  commentContent: string;
}) {
  const preview = previewText(commentContent);
  const actorName = commenterName?.trim() || "读者";
  const rows: (typeof notifications.$inferInsert)[] = [];

  if (threadAuthorId && threadAuthorId !== commenterId) {
    rows.push({
      userId: threadAuthorId,
      type: "thread_reply",
      threadId,
      threadSlug,
      actorId: commenterId,
      actorName,
      body: `${actorName} 在你的帖子下留言：${preview}`,
    });
  }

  if (parentId) {
    const parent = await db.query.comments.findFirst({
      where: eq(comments.id, parentId),
      columns: { authorId: true },
    });
    const parentAuthorId = parent?.authorId;
    if (
      parentAuthorId &&
      parentAuthorId !== commenterId &&
      parentAuthorId !== threadAuthorId
    ) {
      rows.push({
        userId: parentAuthorId,
        type: "comment_reply",
        threadId,
        threadSlug,
        commentId: parentId,
        actorId: commenterId,
        actorName,
        body: `${actorName} 回复了你的评论：${preview}`,
      });
    }
  }

  if (rows.length === 0) return;

  await db.insert(notifications).values(rows);
}
