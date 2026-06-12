export function getSiteUrl(): string {
  const url =
    process.env.AUTH_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://shiji.ink";
  return url.replace(/\/$/, "");
}

export function threadUrl(slug: string): string {
  return `${getSiteUrl()}/discussions/${encodeURIComponent(slug)}`;
}
