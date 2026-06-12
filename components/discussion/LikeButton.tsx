"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  toggleCommentLike,
  toggleThreadLike,
} from "@/app/actions/engagement";
import { cn } from "@/lib/utils";

interface LikeButtonProps {
  target: "thread" | "comment";
  targetId: string;
  threadSlug: string;
  count: number;
  liked: boolean;
  isLoggedIn: boolean;
  size?: "sm" | "icon";
}

export function LikeButton({
  target,
  targetId,
  threadSlug,
  count,
  liked,
  isLoggedIn,
  size = "sm",
}: LikeButtonProps) {
  const [optimisticLiked, setOptimisticLiked] = useState(liked);
  const [optimisticCount, setOptimisticCount] = useState(count);
  const [pending, setPending] = useState(false);

  async function handleToggle() {
    if (!isLoggedIn) return;
    if (pending) return;

    const nextLiked = !optimisticLiked;
    setOptimisticLiked(nextLiked);
    setOptimisticCount((c) => (nextLiked ? c + 1 : c - 1));
    setPending(true);

    const result =
      target === "thread"
        ? await toggleThreadLike(targetId, threadSlug)
        : await toggleCommentLike(targetId, threadSlug);

    setPending(false);

    if (result && "error" in result) {
      setOptimisticLiked(liked);
      setOptimisticCount(count);
    }
  }

  if (!isLoggedIn) {
    return (
      <Button
        variant="ghost"
        size={size}
        className="text-gray-500 hover:text-gray-300"
        asChild
      >
        <Link href="/auth/signin">
          <Heart className="size-4" />
          <span className="tabular-nums">{optimisticCount}</span>
        </Link>
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size={size}
      disabled={pending}
      onClick={handleToggle}
      className={cn(
        "tabular-nums",
        optimisticLiked
          ? "text-pink-400 hover:text-pink-300"
          : "text-gray-400 hover:text-gray-300"
      )}
    >
      <Heart
        className={cn("size-4", optimisticLiked && "fill-pink-400 text-pink-400")}
      />
      {optimisticCount > 0 ? optimisticCount : "赞"}
    </Button>
  );
}
