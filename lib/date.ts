/** Calendar date in Asia/Shanghai (YYYY-MM-DD) for daily check-in. */
export function getTodayInShanghai(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
  }).format(new Date());
}

export function getYesterdayInShanghai(): string {
  const now = new Date();
  now.setDate(now.getDate() - 1);
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Shanghai",
  }).format(now);
}

/** Monday of the current week in Asia/Shanghai (YYYY-MM-DD). */
export function getWeekStartInShanghai(): string {
  const today = getTodayInShanghai();
  const weekday = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Shanghai",
    weekday: "short",
  }).format(new Date());

  const daysFromMonday: Record<string, number> = {
    Mon: 0,
    Tue: 1,
    Wed: 2,
    Thu: 3,
    Fri: 4,
    Sat: 5,
    Sun: 6,
  };

  const offset = daysFromMonday[weekday] ?? 0;
  const [y, m, d] = today.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  date.setUTCDate(date.getUTCDate() - offset);
  return date.toISOString().slice(0, 10);
}

export function formatWeekRangeLabel(weekStart: string): string {
  const [y, m, d] = weekStart.split("-").map(Number);
  const start = new Date(Date.UTC(y, m - 1, d));
  const end = new Date(start);
  end.setUTCDate(end.getUTCDate() + 6);
  const fmt = new Intl.DateTimeFormat("zh-CN", {
    month: "numeric",
    day: "numeric",
  });
  return `${fmt.format(start)} – ${fmt.format(end)}`;
}
