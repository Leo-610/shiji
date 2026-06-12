import Link from "next/link";
import { MessageSquare, User } from "lucide-react";
import { NeonCard } from "@/components/cyber/NeonCard";
import { formatDate, getAuthorName } from "@/lib/utils";

interface ThreadPreview {
  id: string;
  title: string;
  slug: string;
  createdAt: Date;
  guestName: string | null;
  category: { name: string; slug: string };
  author: { name: string | null; image: string | null } | null;
  comments?: { id: string }[];
}

export function ThreadCard({ thread }: { thread: ThreadPreview }) {
  const authorName = getAuthorName(thread.author, thread.guestName);
  const commentCount = thread.comments?.length ?? 0;

  return (
    <Link href={`/discussions/${thread.slug}`}>
      <NeonCard className="p-4 cursor-pointer group">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs px-2 py-0.5 rounded-md border border-white/10 text-gray-400 bg-white/[0.04]">
                {thread.category.name}
              </span>
            </div>
            <h3 className="text-base font-medium text-gray-100 group-hover:text-[var(--color-cyber-accent-bright)] transition-colors truncate">
              {thread.title}
            </h3>
            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <User className="size-3" />
                {authorName}
              </span>
              <span>{formatDate(thread.createdAt)}</span>
              <span className="flex items-center gap-1">
                <MessageSquare className="size-3" />
                {commentCount}
              </span>
            </div>
          </div>
        </div>
      </NeonCard>
    </Link>
  );
}
