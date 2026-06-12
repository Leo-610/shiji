"use client";

import { useState } from "react";
import Link from "next/link";
import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleThreadFavorite } from "@/app/actions/engagement";
import { cn } from "@/lib/utils";

interface FavoriteButtonProps {
  threadId: string;
  threadSlug: string;
  favorited: boolean;
  isLoggedIn: boolean;
}

export function FavoriteButton({
  threadId,
  threadSlug,
  favorited,
  isLoggedIn,
}: FavoriteButtonProps) {
  const [optimisticFavorited, setOptimisticFavorited] = useState(favorited);
  const [pending, setPending] = useState(false);

  async function handleToggle() {
    if (!isLoggedIn || pending) return;

    const next = !optimisticFavorited;
    setOptimisticFavorited(next);
    setPending(true);

    const result = await toggleThreadFavorite(threadId, threadSlug);
    setPending(false);

    if (result && "error" in result) {
      setOptimisticFavorited(favorited);
    }
  }

  if (!isLoggedIn) {
    return (
      <Button
        variant="ghost"
        size="sm"
        className="text-theme-muted hover:text-theme-heading"
        asChild
      >
        <Link href="/auth/signin">
          <Bookmark className="size-4" />
          收藏
        </Link>
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      disabled={pending}
      onClick={handleToggle}
      className={cn(
        optimisticFavorited
          ? "text-theme-accent-secondary hover:opacity-80"
          : "text-theme-muted hover:text-theme-heading"
      )}
    >
      <Bookmark
        className={cn(
          "size-4",
          optimisticFavorited &&
            "fill-[var(--app-accent-secondary)] text-[var(--app-accent-secondary)]"
        )}
      />
      {optimisticFavorited ? "已收藏" : "收藏"}
    </Button>
  );
}
