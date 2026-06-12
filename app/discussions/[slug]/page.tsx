import { notFound } from "next/navigation";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { auth } from "@/lib/auth";
import { getThreadBySlug } from "@/lib/queries";
import { deleteThread } from "@/app/actions/threads";
import { NeonCard } from "@/components/cyber/NeonCard";
import { Button } from "@/components/ui/button";
import { CommentSection } from "@/components/discussion/CommentSection";
import { MarkdownContent } from "@/components/discussion/MarkdownContent";
import { formatDate, getAuthorName, decodeSlugParam } from "@/lib/utils";
import { getThreadEngagement } from "@/lib/queries/engagement";
import { threadUrl } from "@/lib/site";
import { ThreadEngagementBar } from "@/components/discussion/ThreadEngagementBar";

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

  const authorName = getAuthorName(thread.author, thread.guestName);
  const isAuthor = session?.user?.id === thread.authorId;
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
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs px-2 py-0.5 rounded badge-theme">
            {thread.category.name}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-theme-heading mb-4">
          {thread.title}
        </h1>

        <div className="flex items-center justify-between gap-4 mb-6 text-sm text-theme-muted">
          <div className="flex items-center gap-3">
            <span className="text-theme-heading">{authorName}</span>
            <span>{formatDate(thread.createdAt)}</span>
          </div>
          {isAuthor && (
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
        comments={thread.comments}
        currentUserId={session?.user?.id}
        isLoggedIn={isLoggedIn}
        commentLikeCounts={engagement.commentLikeCounts}
        commentLikedIds={engagement.commentLikedIds}
      />
    </div>
  );
}
