import { and, count, eq, gte, isNotNull, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import {
  comments,
  threads,
  userShopItems,
  users,
} from "@/lib/db/schema";
import {
  formatWeekRangeLabel,
  getTodayInShanghai,
  getWeekStartInShanghai,
} from "@/lib/date";

export type AdminDashboardStats = {
  weekStart: string;
  weekLabel: string;
  users: number;
  newUsersThisWeek: number;
  activeThisWeek: number;
  checkedInToday: number;
  checkedInThisWeek: number;
  threads: number;
  comments: number;
  shopPurchases: number;
};

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  const weekStart = getWeekStartInShanghai();
  const today = getTodayInShanghai();
  const weekStartTs = new Date(`${weekStart}T00:00:00+08:00`);

  const [
    userRow,
    newUserRow,
    checkInTodayRow,
    checkInWeekRow,
    threadRow,
    commentRow,
    shopRow,
    activeRow,
  ] = await Promise.all([
    db.select({ count: count() }).from(users),
    db
      .select({ count: count() })
      .from(users)
      .where(gte(users.createdAt, weekStartTs)),
    db
      .select({ count: count() })
      .from(users)
      .where(eq(users.lastCheckIn, today)),
    db
      .select({ count: count() })
      .from(users)
      .where(
        and(isNotNull(users.lastCheckIn), sql`${users.lastCheckIn} >= ${weekStart}`)
      ),
    db.select({ count: count() }).from(threads),
    db.select({ count: count() }).from(comments),
    db.select({ count: count() }).from(userShopItems),
    db.execute<{ count: number }>(sql`
      SELECT COUNT(DISTINCT uid)::int AS count FROM (
        SELECT author_id AS uid FROM threads
          WHERE author_id IS NOT NULL AND created_at >= ${weekStartTs}
        UNION
        SELECT author_id AS uid FROM comments
          WHERE author_id IS NOT NULL AND created_at >= ${weekStartTs}
        UNION
        SELECT id AS uid FROM users
          WHERE last_check_in IS NOT NULL AND last_check_in >= ${weekStart}
      ) active_users
    `),
  ]);

  const activeCount = activeRow.rows[0]?.count ?? 0;

  return {
    weekStart,
    weekLabel: formatWeekRangeLabel(weekStart),
    users: userRow[0]?.count ?? 0,
    newUsersThisWeek: newUserRow[0]?.count ?? 0,
    activeThisWeek: Number(activeCount) || 0,
    checkedInToday: checkInTodayRow[0]?.count ?? 0,
    checkedInThisWeek: checkInWeekRow[0]?.count ?? 0,
    threads: threadRow[0]?.count ?? 0,
    comments: commentRow[0]?.count ?? 0,
    shopPurchases: shopRow[0]?.count ?? 0,
  };
}
