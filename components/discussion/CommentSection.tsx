"use client";

import { useState, type ReactNode } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { NeonCard } from "@/components/cyber/NeonCard";
import { createComment, deleteComment } from "@/app/actions/threads";
import { CONTENT_MAX_LENGTH } from "@/lib/content";
import { AvatarWithFrame } from "@/components/user/AvatarWithFrame";
import { PrestigeAuthor } from "@/components/user/PrestigeAuthor";
import { LikeButton } from "@/components/discussion/LikeButton";
import { formatCommentDate, formatDate, getAuthorName } from "@/lib/utils";
import { cn } from "@/lib/utils";
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
    readerId?: number | null;
    image: string | null;
    role?: string | null;
    level?: number | null;
    equippedAvatarFrame?: string | null;
    equippedTitleBadge?: string | null;
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

  function CommentTimestamp({ date }: { date: Date }) {
    return (
      <>
        <span className="sm:hidden">{formatCommentDate(date)}</span>
        <span className="hidden sm:inline">{formatDate(date)}</span>
      </>
    );
  }

  function CommentBody({
    authorName,
    author,
    authorId,
    createdAt,
    content,
    size,
    actions,
  }: {
    authorName: string;
    author: CommentData["author"];
    authorId: string | null;
    createdAt: Date;
    content: string;
    size: "xs" | "sm";
    actions: ReactNode;
  }) {
    return (
      <div className="flex gap-3">
        <AvatarWithFrame
          name={authorName}
          image={author?.image}
          role={author?.role}
          frameSlug={author?.equippedAvatarFrame}
          size={size}
          className="shrink-0"
        />
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
            <PrestigeAuthor
              name={authorName}
              readerId={author?.readerId}
              role={author?.role}
              level={author?.level}
              titleBadge={author?.equippedTitleBadge}
              isThreadOp={isCommentOp(authorId)}
              size={size}
              showAvatar={false}
              className="min-w-0"
            />
            <span className="text-xs text-theme-subtle shrink-0 whitespace-nowrap">
              <CommentTimestamp date={createdAt} />
            </span>
          </div>
          <div className="flex items-center gap-1 flex-wrap">{actions}</div>
          <p
            className={cn(
              "text-sm text-theme-heading whitespace-pre-wrap",
              size === "xs" ? "mt-0" : ""
            )}
          >
            {content}
          </p>
        </div>
      </div>
    );
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
                <CommentBody
                  authorName={authorName}
                  author={comment.author}
                  authorId={comment.authorId}
                  createdAt={comment.createdAt}
                  content={comment.content}
                  size="sm"
                  actions={
                    <>
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
                    </>
                  }
                />
              </NeonCard>

              {commentReplies.map((reply) => {
                const replyAuthor = getAuthorName(
                  reply.author,
                  reply.guestName
                );
                return (
                  <NeonCard
                    key={reply.id}
                    className="p-3 ml-4 sm:ml-8 border-[color:var(--app-border-subtle)]"
                    glow="none"
                  >
                    <CommentBody
                      authorName={replyAuthor}
                      author={reply.author}
                      authorId={reply.authorId}
                      createdAt={reply.createdAt}
                      content={reply.content}
                      size="xs"
                      actions={
                        <>
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
                        </>
                      }
                    />
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
