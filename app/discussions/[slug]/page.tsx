import { notFound } from "next/navigation";
import Link from "next/link";
import { Eye, Pin, PinOff, Trash2 } from "lucide-react";
import { auth } from "@/lib/auth";
import { getThreadBySlug } from "@/lib/queries";
import { deleteThread, toggleThreadPin } from "@/app/actions/threads";
import { recordThreadView } from "@/lib/xp";
import { NeonCard } from "@/components/cyber/NeonCard";
import { Button } from "@/components/ui/button";
import { CommentSection } from "@/components/discussion/CommentSection";
import { MarkdownContent } from "@/components/discussion/MarkdownContent";
import { formatDate, getAuthorName, decodeSlugParam } from "@/lib/utils";
import { getThreadEngagement } from "@/lib/queries/engagement";
import { threadUrl } from "@/lib/site";
import { PrestigeAuthor } from "@/components/user/PrestigeAuthor";
import { ThreadEngagementBar } from "@/components/discussion/ThreadEngagementBar";
import { isSuperAdmin } from "@/lib/roles";

export default async function ThreadDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug: rawSlug } = await params;
  const slug = decodeSlugParam(rawSlug);
  const session = await auth();
  const thread = await getThreadBySlug(slug);

  if (!thread) {
    notFound();
  }

  await recordThreadView(thread.id, thread.authorId);

  const authorName = getAuthorName(thread.author, thread.guestName);
  const isAuthor = session?.user?.id === thread.authorId;
  const isSuperAdminUser = isSuperAdmin(session?.user?.role);
  const canDeleteThread = isAuthor || isSuperAdminUser;
  const isLoggedIn = !!session?.user;
  const commentIds = thread.comments.map((c) => c.id);
  const engagement = await getThreadEngagement(
    thread.id,
    commentIds,
    session?.user?.id
  );

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <Link
          href="/discussions"
          className="text-sm text-theme-muted hover:text-theme-accent transition-colors"
        >
          ← 返回讨论区
        </Link>
      </div>

      <NeonCard className="p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className="text-xs px-2 py-0.5 rounded badge-theme">
            {thread.category.name}
          </span>
          {thread.pinned && (
            <span className="thread-pinned-badge text-xs px-2 py-0.5 rounded font-orbitron tracking-wide">
              置顶
            </span>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-theme-heading mb-4">
          {thread.title}
        </h1>

        <div className="flex items-center justify-between gap-4 mb-6 text-sm text-theme-muted">
          <div className="flex items-center gap-3 flex-wrap">
            <PrestigeAuthor
              name={authorName}
              image={thread.author?.image}
              role={thread.author?.role}
              level={thread.author?.level}
              avatarFrame={thread.author?.equippedAvatarFrame}
              titleBadge={thread.author?.equippedTitleBadge}
              isThreadOp
              size="md"
            />
            <span>{formatDate(thread.createdAt)}</span>
            <span className="flex items-center gap-1">
              <Eye className="size-3.5" />
              {thread.viewCount ?? 0}
            </span>
          </div>
          {canDeleteThread && (
            <div className="flex items-center gap-1">
              {isSuperAdminUser && (
                <form
                  action={async () => {
                    "use server";
                    await toggleThreadPin(thread.id);
                  }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    type="submit"
                    className="text-theme-accent hover:text-theme-accent"
                  >
                    {thread.pinned ? (
                      <>
                        <PinOff className="size-4" />
                        取消置顶
                      </>
                    ) : (
                      <>
                        <Pin className="size-4" />
                        置顶
                      </>
                    )}
                  </Button>
                </form>
              )}
              <form
                action={async () => {
                  "use server";
                  await deleteThread(thread.id);
                }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  type="submit"
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="size-4" />
                  删除
                </Button>
              </form>
            </div>
          )}
        </div>

        <MarkdownContent content={thread.content} />

        <ThreadEngagementBar
          threadId={thread.id}
          threadSlug={thread.slug}
          threadTitle={thread.title}
          shareUrl={threadUrl(thread.slug)}
          likeCount={engagement.threadLikeCount}
          liked={engagement.threadLiked}
          favorited={engagement.favorited}
          isLoggedIn={isLoggedIn}
        />
      </NeonCard>

      <CommentSection
        threadId={thread.id}
        threadSlug={thread.slug}
        threadAuthorId={thread.authorId}
        comments={thread.comments}
        currentUserId={session?.user?.id}
        currentUserRole={session?.user?.role}
        isLoggedIn={isLoggedIn}
        commentLikeCounts={engagement.commentLikeCounts}
        commentLikedIds={engagement.commentLikedIds}
      />
    </div>
  );
}
