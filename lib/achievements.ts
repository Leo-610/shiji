import { and, eq, sql } from "drizzle-orm";
import { awardPoints } from "@/lib/award";
import { db } from "@/lib/db";
import {
  comments,
  threads,
  userAchievements,
  userShopItems,
  users,
} from "@/lib/db/schema";

export type AchievementTier = "common" | "rare" | "epic" | "legendary";

export interface AchievementDef {
  id: string;
  name: string;
  description: string;
  points: number;
  tier: AchievementTier;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  {
    id: "first_thread",
    name: "初次发声",
    description: "发布第一条帖子",
    points: 30,
    tier: "common",
  },
  {
    id: "first_comment",
    name: "初次留言",
    description: "发表第一条评论",
    points: 20,
    tier: "common",
  },
  {
    id: "equipped_style",
    name: "装扮出场",
    description: "装备头像框或称号",
    points: 30,
    tier: "common",
  },
  {
    id: "liked_once",
    name: "共鸣初现",
    description: "帖子或评论首次被点赞",
    points: 40,
    tier: "rare",
  },
  {
    id: "streak_7",
    name: "七日守约",
    description: "连续签到 7 天",
    points: 80,
    tier: "rare",
  },
  {
    id: "first_shop",
    name: "初识陈列",
    description: "首次在积分商店兑换物品",
    points: 50,
    tier: "rare",
  },
  {
    id: "comments_10",
    name: "讨论常客",
    description: "累计发表 10 条评论",
    points: 60,
    tier: "rare",
  },
  {
    id: "threads_5",
    name: "连载手记",
    description: "累计发布 5 篇帖子",
    points: 80,
    tier: "epic",
  },
  {
    id: "collector_frame",
    name: "框收藏家",
    description: "拥有 3 个头像框",
    points: 120,
    tier: "epic",
  },
  {
    id: "level_10",
    name: "十级旅人",
    description: "达到 Lv.10",
    points: 100,
    tier: "epic",
  },
  {
    id: "points_500",
    name: "积分达人",
    description: "积分余额达到 500",
    points: 0,
    tier: "epic",
  },
  {
    id: "fortune_supreme",
    name: "神谕眷顾",
    description: "签到抽到至尊大吉签",
    points: 150,
    tier: "legendary",
  },
];

const ACHIEVEMENT_MAP = new Map(ACHIEVEMENTS.map((a) => [a.id, a]));

const MANUAL_ONLY = new Set(["liked_once", "fortune_supreme"]);

interface AchievementContext {
  threadCount: number;
  commentCount: number;
  shopItemCount: number;
  frameCount: number;
  level: number;
  checkInStreak: number;
  points: number;
  hasEquipped: boolean;
}

async function buildAchievementContext(userId: string): Promise<AchievementContext | null> {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: {
      level: true,
      checkInStreak: true,
      points: true,
      equippedAvatarFrame: true,
      equippedTitleBadge: true,
    },
  });
  if (!user) return null;

  const [threadRow, commentRow, shopRow, frameRow] = await Promise.all([
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(threads)
      .where(eq(threads.authorId, userId)),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(comments)
      .where(eq(comments.authorId, userId)),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(userShopItems)
      .where(eq(userShopItems.userId, userId)),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(userShopItems)
      .where(
        and(
          eq(userShopItems.userId, userId),
          sql`${userShopItems.itemSlug} like 'frame-%'`
        )
      ),
  ]);

  return {
    threadCount: threadRow[0]?.count ?? 0,
    commentCount: commentRow[0]?.count ?? 0,
    shopItemCount: shopRow[0]?.count ?? 0,
    frameCount: frameRow[0]?.count ?? 0,
    level: user.level ?? 1,
    checkInStreak: user.checkInStreak ?? 0,
    points: user.points ?? 0,
    hasEquipped: !!(user.equippedAvatarFrame || user.equippedTitleBadge),
  };
}

function matchesAchievement(id: string, ctx: AchievementContext): boolean {
  switch (id) {
    case "first_thread":
      return ctx.threadCount >= 1;
    case "first_comment":
      return ctx.commentCount >= 1;
    case "equipped_style":
      return ctx.hasEquipped;
    case "streak_7":
      return ctx.checkInStreak >= 7;
    case "first_shop":
      return ctx.shopItemCount >= 1;
    case "comments_10":
      return ctx.commentCount >= 10;
    case "threads_5":
      return ctx.threadCount >= 5;
    case "collector_frame":
      return ctx.frameCount >= 3;
    case "level_10":
      return ctx.level >= 10;
    case "points_500":
      return ctx.points >= 500;
    default:
      return false;
  }
}

export async function unlockAchievement(
  userId: string,
  achievementId: string
): Promise<AchievementDef | null> {
  const def = ACHIEVEMENT_MAP.get(achievementId);
  if (!def) return null;

  const existing = await db.query.userAchievements.findFirst({
    where: and(
      eq(userAchievements.userId, userId),
      eq(userAchievements.achievementId, achievementId)
    ),
  });
  if (existing) return null;

  await db.insert(userAchievements).values({
    userId,
    achievementId,
  });

  if (def.points > 0) {
    await awardPoints(userId, def.points);
  }

  return def;
}

export async function checkStatAchievements(userId: string): Promise<AchievementDef[]> {
  const ctx = await buildAchievementContext(userId);
  if (!ctx) return [];

  const unlocked: AchievementDef[] = [];
  for (const def of ACHIEVEMENTS) {
    if (MANUAL_ONLY.has(def.id)) continue;
    if (!matchesAchievement(def.id, ctx)) continue;
    const result = await unlockAchievement(userId, def.id);
    if (result) unlocked.push(result);
  }
  return unlocked;
}

export async function getAchievementBoard(userId: string) {
  const rows = await db.query.userAchievements.findMany({
    where: eq(userAchievements.userId, userId),
    columns: { achievementId: true, unlockedAt: true },
  });
  const unlockedMap = new Map(
    rows.map((r) => [r.achievementId, r.unlockedAt])
  );

  return ACHIEVEMENTS.map((def) => ({
    ...def,
    unlocked: unlockedMap.has(def.id),
    unlockedAt: unlockedMap.get(def.id)?.toISOString() ?? null,
  }));
}
