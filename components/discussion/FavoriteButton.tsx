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
        className="text-gray-500 hover:text-gray-300"
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
          ? "text-[var(--color-cyber-accent-bright)] hover:text-[var(--color-cyber-accent-bright)]"
          : "text-gray-400 hover:text-gray-300"
      )}
    >
      <Bookmark
        className={cn(
          "size-4",
          optimisticFavorited &&
            "fill-[var(--color-cyber-accent-bright)] text-[var(--color-cyber-accent-bright)]"
        )}
      />
      {optimisticFavorited ? "已收藏" : "收藏"}
    </Button>
  );
}
