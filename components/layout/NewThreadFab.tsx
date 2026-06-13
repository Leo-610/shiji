"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { PenLine } from "lucide-react";

export function NewThreadFab() {
  const pathname = usePathname();

  if (pathname !== "/discussions") return null;

  return (
    <Link
      href="/discussions/new"
      className="new-thread-fab sm:hidden"
      aria-label="发帖"
    >
      <PenLine className="size-5" aria-hidden />
      <span className="text-sm font-medium">发帖</span>
    </Link>
  );
}
