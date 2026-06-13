import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\u4e00-\u9fff\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** Decode dynamic route slug; production may pass percent-encoded Unicode. */
export function decodeSlugParam(slug: string): string {
  if (!slug.includes("%")) {
    return slug;
  }
  try {
    return decodeURIComponent(slug);
  } catch {
    return slug;
  }
}

/** ASCII-only URL slug — avoids encoding issues with Chinese titles. */
export function createThreadSlug(): string {
  return `t-${crypto.randomUUID().replace(/-/g, "").slice(0, 12)}`;
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

/** Compact timestamp for comment headers on narrow screens. */
export function formatCommentDate(date: Date): string {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export function getAuthorName(
  user: { name: string | null } | null | undefined,
  guestName: string | null | undefined
): string {
  return user?.name ?? guestName ?? "匿名读者";
}
