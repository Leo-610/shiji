"use client";

import { useState } from "react";
import ReactMarkdown from "react-markdown";
import { Trash2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { NeonCard } from "@/components/cyber/NeonCard";
import { createComment, deleteComment } from "@/app/actions/threads";
import { formatDate, getAuthorName } from "@/lib/utils";

interface CommentData {
  id: string;
  content: string;
  createdAt: Date;
  guestName: string | null;
  parentId: string | null;
  authorId: string | null;
  author: { name: string | null; image: string | null } | null;
}

interface CommentSectionProps {
  threadId: string;
  threadSlug: string;
  comments: CommentData[];
  currentUserId?: string;
  isLoggedIn: boolean;
}

export function CommentSection({
  threadId,
  threadSlug,
  comments,
  currentUserId,
  isLoggedIn,
}: CommentSectionProps) {
  const [error, setError] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);

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
      <h2 className="text-lg font-medium text-cyan-300">
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
                  <Avatar className="size-8 shrink-0">
                    <AvatarImage src={comment.author?.image ?? undefined} />
                    <AvatarFallback>
                      {authorName[0]?.toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-cyan-300">
                          {authorName}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
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
                        {currentUserId &&
                          comment.authorId === currentUserId && (
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
                    <p className="mt-2 text-sm text-gray-300 whitespace-pre-wrap">
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
                    className="p-3 ml-8 border-gray-700/50"
                    glow="none"
                  >
                    <div className="flex gap-3">
                      <Avatar className="size-6 shrink-0">
                        <AvatarImage
                          src={reply.author?.image ?? undefined}
                        />
                        <AvatarFallback className="text-xs">
                          {replyAuthor[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-sm text-cyan-300">
                              {replyAuthor}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatDate(reply.createdAt)}
                            </span>
                          </div>
                          {currentUserId &&
                            reply.authorId === currentUserId && (
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
                        <p className="mt-1 text-sm text-gray-300 whitespace-pre-wrap">
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
          <p className="text-center text-gray-500 py-8">
            暂无评论，成为第一个发言的读者吧
          </p>
        )}
      </div>
    </div>
  );
}

export function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="prose-cyber">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}
