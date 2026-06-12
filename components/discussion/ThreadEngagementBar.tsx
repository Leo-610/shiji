"use client";

import { ShareButton } from "@/components/discussion/ShareButton";
import { LikeButton } from "@/components/discussion/LikeButton";
import { FavoriteButton } from "@/components/discussion/FavoriteButton";

interface ThreadEngagementBarProps {
  threadId: string;
  threadSlug: string;
  threadTitle: string;
  shareUrl: string;
  likeCount: number;
  liked: boolean;
  favorited: boolean;
  isLoggedIn: boolean;
}

export function ThreadEngagementBar({
  threadId,
  threadSlug,
  threadTitle,
  shareUrl,
  likeCount,
  liked,
  favorited,
  isLoggedIn,
}: ThreadEngagementBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-1 border-t border-white/[0.06] pt-4 mt-6">
      <LikeButton
        target="thread"
        targetId={threadId}
        threadSlug={threadSlug}
        count={likeCount}
        liked={liked}
        isLoggedIn={isLoggedIn}
      />
      <FavoriteButton
        threadId={threadId}
        threadSlug={threadSlug}
        favorited={favorited}
        isLoggedIn={isLoggedIn}
      />
      <ShareButton url={shareUrl} title={threadTitle} />
    </div>
  );
}
