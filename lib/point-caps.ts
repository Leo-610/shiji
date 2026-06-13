import { and, eq } from "drizzle-orm";
import { getTodayInShanghai } from "@/lib/date";
import { db } from "@/lib/db";
import { userDailyPoints } from "@/lib/db/schema";
import { awardPoints } from "@/lib/award";

export type PointCapCategory =
  | "create_thread"
  | "create_comment"
  | "receive_thread_like"
  | "receive_comment_like"
  | "thread_view_received";

/** Daily caps on repeatable point sources (Asia/Shanghai calendar day). */
export const DAILY_POINT_CAPS: Record<PointCapCategory, number> = {
  create_thread: 90,
  create_comment: 150,
  receive_thread_like: 48,
  receive_comment_like: 30,
  thread_view_received: 45,
};

export async function awardPointsWithDailyCap(
  userId: string,
  amount: number,
  category: PointCapCategory
): Promise<{ awarded: number; capped: boolean } | null> {
  if (amount <= 0) return { awarded: 0, capped: false };

  const date = getTodayInShanghai();
  const cap = DAILY_POINT_CAPS[category];

  try {
    const existing = await db.query.userDailyPoints.findFirst({
      where: and(
        eq(userDailyPoints.userId, userId),
        eq(userDailyPoints.date, date),
        eq(userDailyPoints.category, category)
      ),
      columns: { points: true },
    });

    const used = existing?.points ?? 0;
    const remaining = Math.max(0, cap - used);
    const awarded = Math.min(amount, remaining);

    if (awarded <= 0) {
      return { awarded: 0, capped: true };
    }

    if (existing) {
      await db
        .update(userDailyPoints)
        .set({ points: used + awarded })
        .where(
          and(
            eq(userDailyPoints.userId, userId),
            eq(userDailyPoints.date, date),
            eq(userDailyPoints.category, category)
          )
        );
    } else {
      await db.insert(userDailyPoints).values({
        userId,
        date,
        category,
        points: awarded,
      });
    }

    await awardPoints(userId, awarded);
    return { awarded, capped: awarded < amount };
  } catch {
    return null;
  }
}

export function getDailyCapRuleDescriptions() {
  return [
    {
      category: "发帖积分",
      cap: DAILY_POINT_CAPS.create_thread,
      note: "含行为奖励，达上限后当日发帖不再加积分",
    },
    {
      category: "评论积分",
      cap: DAILY_POINT_CAPS.create_comment,
      note: "含行为奖励，达上限后当日评论不再加积分",
    },
    {
      category: "帖子被赞",
      cap: DAILY_POINT_CAPS.receive_thread_like,
      note: "当日因帖子获赞所得积分上限",
    },
    {
      category: "评论被赞",
      cap: DAILY_POINT_CAPS.receive_comment_like,
      note: "当日因评论获赞所得积分上限",
    },
    {
      category: "帖子被浏览",
      cap: DAILY_POINT_CAPS.thread_view_received,
      note: "当日因帖子被登录用户浏览所得积分上限",
    },
  ];
}
