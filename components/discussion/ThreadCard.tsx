import Link from "next/link";
import { Eye, MessageSquare, Pin } from "lucide-react";
import { NeonCard } from "@/components/cyber/NeonCard";
import { PrestigeAuthor } from "@/components/user/PrestigeAuthor";
import { formatDate, getAuthorName, cn } from "@/lib/utils";

interface ThreadPreview {
  id: string;
  title: string;
  slug: string;
  createdAt: Date;
  guestName: string | null;
  category: { name: string; slug: string };
  author: {
    name: string | null;
    image: string | null;
    role?: string | null;
    level?: number | null;
    equippedAvatarFrame?: string | null;
    equippedTitleBadge?: string | null;
  } | null;
  viewCount?: number;
  pinned?: boolean;
  comments?: { id: string }[];
}

export function ThreadCard({ thread }: { thread: ThreadPreview }) {
  const authorName = getAuthorName(thread.author, thread.guestName);
  const commentCount = thread.comments?.length ?? 0;
  const isPinned = thread.pinned ?? false;

  return (
    <Link href={`/discussions/${thread.slug}`}>
      <NeonCard
        className={cn(
          "p-4 hover:border-[color:var(--app-accent)]/40 cursor-pointer group",
          isPinned && "thread-card-pinned border-[color:var(--app-accent)]/35"
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              {isPinned && (
                <span className="thread-pinned-badge text-xs px-2 py-0.5 rounded font-orbitron tracking-wide flex items-center gap-1">
                  <Pin className="size-3" />
                  置顶
                </span>
              )}
              <span className="text-xs px-2 py-0.5 rounded badge-theme">
                {thread.category.name}
              </span>
            </div>
            <h3 className="text-base font-medium text-theme-heading group-hover:text-theme-accent transition-colors truncate">
              {thread.title}
            </h3>
            <div className="flex items-center gap-3 mt-2 text-xs text-theme-subtle flex-wrap">
              <PrestigeAuthor
                name={authorName}
                image={thread.author?.image}
                role={thread.author?.role}
                level={thread.author?.level}
                avatarFrame={thread.author?.equippedAvatarFrame}
                titleBadge={thread.author?.equippedTitleBadge}
                isThreadOp
                size="sm"
                showAvatar={false}
                className="gap-1"
              />
              <span>{formatDate(thread.createdAt)}</span>
              <span className="flex items-center gap-1">
                <Eye className="size-3" />
                {thread.viewCount ?? 0}
              </span>
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
