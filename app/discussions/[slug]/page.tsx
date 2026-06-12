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
import { formatDate, getAuthorName } from "@/lib/utils";

export default async function ThreadDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const session = await auth();
  const thread = await getThreadBySlug(slug);

  if (!thread) {
    notFound();
  }

  const authorName = getAuthorName(thread.author, thread.guestName);
  const isAuthor = session?.user?.id === thread.authorId;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div>
        <Link
          href="/discussions"
          className="text-sm text-gray-500 hover:text-cyan-400 transition-colors"
        >
          ← 返回讨论区
        </Link>
      </div>

      <NeonCard className="p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xs px-2 py-0.5 rounded border border-purple-500/40 text-purple-300 bg-purple-500/10">
            {thread.category.name}
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-100 mb-4">
          {thread.title}
        </h1>

        <div className="flex items-center justify-between gap-4 mb-6 text-sm text-gray-500">
          <div className="flex items-center gap-3">
            <span className="text-cyan-300">{authorName}</span>
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
      </NeonCard>

      <CommentSection
        threadId={thread.id}
        threadSlug={thread.slug}
        comments={thread.comments}
        currentUserId={session?.user?.id}
        isLoggedIn={!!session?.user}
      />
    </div>
  );
}
