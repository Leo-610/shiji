"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { NeonCard } from "@/components/cyber/NeonCard";
import { createComment, deleteComment } from "@/app/actions/threads";
import { CONTENT_MAX_LENGTH } from "@/lib/content";
import { PrestigeAuthor } from "@/components/user/PrestigeAuthor";
import { LikeButton } from "@/components/discussion/LikeButton";
import { formatDate, getAuthorName } from "@/lib/utils";
import { isSuperAdmin, type UserRole } from "@/lib/roles";

interface CommentData {
  id: string;
  content: string;
  createdAt: Date;
  guestName: string | null;
  parentId: string | null;
  authorId: string | null;
  author: {
    name: string | null;
    image: string | null;
    role?: string | null;
  } | null;
}

interface CommentSectionProps {
  threadId: string;
  threadSlug: string;
  threadAuthorId: string | null;
  comments: CommentData[];
  currentUserId?: string;
  currentUserRole?: UserRole;
  isLoggedIn: boolean;
  commentLikeCounts?: Record<string, number>;
  commentLikedIds?: string[];
}

export function CommentSection({
  threadId,
  threadSlug,
  threadAuthorId,
  comments,
  currentUserId,
  currentUserRole,
  isLoggedIn,
  commentLikeCounts = {},
  commentLikedIds = [],
}: CommentSectionProps) {
  const likedSet = new Set(commentLikedIds);
  const [error, setError] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

  function canDeleteComment(authorId: string | null) {
    if (!currentUserId) return false;
    if (authorId === currentUserId) return true;
    return isSuperAdmin(currentUserRole);
  }

  function isCommentOp(authorId: string | null) {
    return authorId !== null && authorId === threadAuthorId;
  }

  const topLevel = comments.filter((c) => !c.parentId);
  const replies = comments.filter((c) => c.parentId);

  async function handleSubmit(formData: FormData) {
    setError(null);
    const result = await createComment(formData);
    if (result?.error) {
      setError(result.error);
    } else {
      setReplyingTo(null);
    }
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-medium text-theme-accent">
        评论 ({comments.length})
      </h2>

      <NeonCard className="p-4">
        <form action={handleSubmit} className="space-y-3">
          <input type="hidden" name="threadId" value={threadId} />
          {replyingTo && (
            <input type="hidden" name="parentId" value={replyingTo} />
          )}
          {!isLoggedIn && (
            <Input name="guestName" placeholder="你的昵称" maxLength={50} />
          )}
          <Textarea
            name="content"
            placeholder={
              replyingTo ? "写下你的回复..." : "分享你的想法和建议..."
            }
            required
            minLength={2}
            maxLength={CONTENT_MAX_LENGTH}
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="flex items-center gap-2">
            <Button type="submit">
              {replyingTo ? "发表回复" : "发表评论"}
            </Button>
            {replyingTo && (
              <Button
                type="button"
                variant="ghost"
                onClick={() => setReplyingTo(null)}
              >
                取消回复
              </Button>
            )}
          </div>
        </form>
      </NeonCard>

      <div className="space-y-4">
        {topLevel.map((comment) => {
          const authorName = getAuthorName(comment.author, comment.guestName);
          const commentReplies = replies.filter(
            (r) => r.parentId === comment.id
          );

          return (
            <div key={comment.id} className="space-y-3">
              <NeonCard className="p-4" glow="none">
                <div className="flex gap-3">
                  <PrestigeAuthor
                    name={authorName}
                    image={comment.author?.image}
                    role={comment.author?.role}
                    isThreadOp={isCommentOp(comment.authorId)}
                    size="sm"
                    className="shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs text-theme-subtle">
                        {formatDate(comment.createdAt)}
                      </span>
                      <div className="flex items-center gap-1">
                        <LikeButton
                          target="comment"
                          targetId={comment.id}
                          threadSlug={threadSlug}
                          count={commentLikeCounts[comment.id] ?? 0}
                          liked={likedSet.has(comment.id)}
                          isLoggedIn={isLoggedIn}
                          size="icon"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            setReplyingTo(
                              replyingTo === comment.id ? null : comment.id
                            )
                          }
                        >
                          回复
                        </Button>
                        {canDeleteComment(comment.authorId) && (
                            <form
                              action={async () => {
                                await deleteComment(comment.id, threadSlug);
                              }}
                            >
                              <Button
                                variant="ghost"
                                size="icon"
                                type="submit"
                                className="text-red-400 hover:text-red-300"
                              >
                                <Trash2 className="size-4" />
                              </Button>
                            </form>
                          )}
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-theme-heading whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  </div>
                </div>
              </NeonCard>

              {commentReplies.map((reply) => {
                const replyAuthor = getAuthorName(
                  reply.author,
                  reply.guestName
                );
                return (
                  <NeonCard
                    key={reply.id}
                    className="p-3 ml-8 border-[color:var(--app-border-subtle)]"
                    glow="none"
                  >
                    <div className="flex gap-3">
                      <PrestigeAuthor
                        name={replyAuthor}
                        image={reply.author?.image}
                        role={reply.author?.role}
                        isThreadOp={isCommentOp(reply.authorId)}
                        size="xs"
                        className="shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs text-theme-subtle">
                            {formatDate(reply.createdAt)}
                          </span>
                          <div className="flex items-center gap-1">
                            <LikeButton
                              target="comment"
                              targetId={reply.id}
                              threadSlug={threadSlug}
                              count={commentLikeCounts[reply.id] ?? 0}
                              liked={likedSet.has(reply.id)}
                              isLoggedIn={isLoggedIn}
                              size="icon"
                            />
                            {canDeleteComment(reply.authorId) && (
                                <form
                                  action={async () => {
                                    await deleteComment(reply.id, threadSlug);
                                  }}
                                >
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    type="submit"
                                    className="text-red-400 hover:text-red-300 size-7"
                                  >
                                    <Trash2 className="size-3" />
                                  </Button>
                                </form>
                              )}
                          </div>
                        </div>
                        <p className="mt-1 text-sm text-theme-heading whitespace-pre-wrap">
                          {reply.content}
                        </p>
                      </div>
                    </div>
                  </NeonCard>
                );
              })}
            </div>
          );
        })}

        {comments.length === 0 && (
          <p className="text-center text-theme-muted py-8">
            暂无评论，成为第一个发言的读者吧
          </p>
        )}
      </div>
    </div>
  );
}
