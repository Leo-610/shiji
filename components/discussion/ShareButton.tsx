"use client";

import { useState } from "react";
import { Check, Link2, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ShareButtonProps {
  url: string;
  title: string;
}

export function ShareButton({ url, title }: ShareButtonProps) {
  const [status, setStatus] = useState<"idle" | "copied">("idle");

  async function handleShare() {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
      }
    }

    try {
      await navigator.clipboard.writeText(url);
      setStatus("copied");
      window.setTimeout(() => setStatus("idle"), 2000);
    } catch {
      window.prompt("复制此链接分享：", url);
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={handleShare}
      className="text-gray-400 hover:text-gray-300"
    >
      {status === "copied" ? (
        <>
          <Check className="size-4 text-green-400" />
          已复制
        </>
      ) : (
        <>
          <Share2 className="size-4" />
          分享
        </>
      )}
    </Button>
  );
}

export function CopyLinkButton({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt("复制此链接：", url);
    }
  }

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={handleCopy}
      className="text-gray-400 hover:text-gray-300"
    >
      {copied ? (
        <>
          <Check className="size-4 text-green-400" />
          已复制链接
        </>
      ) : (
        <>
          <Link2 className="size-4" />
          复制链接
        </>
      )}
    </Button>
  );
}
