"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { getTodayInShanghai } from "@/lib/date";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import {
  clearExpiredEquippedItems,
  formatGrantExpiry,
  getActiveGrants,
  grantPermanentShopItem,
  grantShopItemTrial,
  hasPermanentShopItem,
} from "@/lib/shop-ownership";
import { getShopItem } from "@/lib/shop-items";
import { checkStatAchievements } from "@/lib/achievements";
import {
  describeWheelPrize,
  getLuckBonusSummary,
  LEGEND_SHARD_GOAL,
  LUCK_CAP,
  LUCK_PER_SPIN,
  pickNothingLine,
  pickWheelPrize,
  ULTIMATE_FRAME_SLUG,
  WHEEL_PRIZES,
  WHEEL_SPIN_POINT_COST,
  formatUltimateChance,
  type WheelPrize,
} from "@/lib/wheel";

export type WheelPaymentMethod = "points" | "ticket" | "free";

export type WheelPrizeResult = {
  index: number;
  label: string;
  description: string;
  type: WheelPrize["type"];
  tier: WheelPrize["tier"];
  expiresAt?: string;
  isGrand?: boolean;
};

export type WheelPageData = {
  points: number;
  wheelTickets: number;
  wheelLuck: number;
  legendShards: number;
  shardGoal: number;
  spinPointCost: number;
  freeSpinAvailable: boolean;
  luckSummary: ReturnType<typeof getLuckBonusSummary>;
  ultimateChanceLabel: string;
  prizes: Array<{
    id: string;
    label: string;
    shortLabel: string;
    color: string;
  }>;
  activeTrials: Array<{
    itemSlug: string;
    name: string;
    expiresLabel: string;
  }>;
};

async function tryLegendShardMilestone(
  userId: string,
  shards: number
): Promise<{
  shards: number;
  extraPoints: number;
  milestone?: string;
}> {
  if (shards < LEGEND_SHARD_GOAL) {
    return { shards, extraPoints: 0 };
  }

  const legendaryFrames = [
    ULTIMATE_FRAME_SLUG,
    "frame-ascension",
    "frame-void-eclipse",
    "frame-ascension-dawn",
  ];

  for (const slug of legendaryFrames) {
    if (await hasPermanentShopItem(userId, slug)) continue;
    const grant = await grantPermanentShopItem(userId, slug);
    if (grant.ok) {
      const item = getShopItem(slug);
      return {
        shards: shards - LEGEND_SHARD_GOAL,
        extraPoints: 0,
        milestone: item?.name ?? slug,
      };
    }
  }

  return {
    shards: shards - LEGEND_SHARD_GOAL,
    extraPoints: 800,
    milestone: "已集满碎片且拥有全部传说框，折算 800 积分",
  };
}

export async function getWheelPageData(): Promise<WheelPageData | null> {
  const session = await auth();
  if (!session?.user?.id) return null;

  try {
    await clearExpiredEquippedItems(session.user.id);

    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
      columns: {
        points: true,
        wheelTickets: true,
        wheelLuck: true,
        legendShards: true,
        lastFreeWheelDate: true,
      },
    });
    if (!user) return null;

    const grants = await getActiveGrants(session.user.id);
    const luck = Math.min(user.wheelLuck ?? 0, LUCK_CAP);
    const today = getTodayInShanghai();

    return {
      points: user.points ?? 0,
      wheelTickets: user.wheelTickets ?? 0,
      wheelLuck: luck,
      legendShards: user.legendShards ?? 0,
      shardGoal: LEGEND_SHARD_GOAL,
      spinPointCost: WHEEL_SPIN_POINT_COST,
      freeSpinAvailable: user.lastFreeWheelDate !== today,
      luckSummary: getLuckBonusSummary(luck),
      ultimateChanceLabel: formatUltimateChance(luck),
      prizes: WHEEL_PRIZES.map((p) => ({
        id: p.id,
        label: p.label,
        shortLabel: p.shortLabel,
        color: p.color,
      })),
      activeTrials: grants.map((g) => {
        const item = getShopItem(g.itemSlug);
        return {
          itemSlug: g.itemSlug,
          name: item?.name ?? g.itemSlug,
          expiresLabel: formatGrantExpiry(g.expiresAt),
        };
      }),
    };
  } catch {
    return null;
  }
}

export async function spinWheel(payment: WheelPaymentMethod) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "请先登录" };
  }

  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
      columns: {
        points: true,
        wheelTickets: true,
        wheelLuck: true,
        legendShards: true,
        lastFreeWheelDate: true,
      },
    });
    if (!user) return { error: "用户不存在" };

    const today = getTodayInShanghai();
    const points = user.points ?? 0;
    const tickets = user.wheelTickets ?? 0;
    const luck = Math.min(user.wheelLuck ?? 0, LUCK_CAP);
    const shards = user.legendShards ?? 0;

    if (payment === "free") {
      if (user.lastFreeWheelDate === today) {
        return { error: "今日免费次数已用完" };
      }
    } else if (payment === "ticket") {
      if (tickets < 1) {
        return { error: "代积分券不足" };
      }
    } else if (points < WHEEL_SPIN_POINT_COST) {
      return {
        error: `积分不足，抽奖需 ${WHEEL_SPIN_POINT_COST} 积分（当前 ${points}）`,
      };
    }

    const { prize, index } = pickWheelPrize(luck);

    let newPoints = points;
    let newTickets = tickets;
    let newLuck = Math.min(luck + LUCK_PER_SPIN, LUCK_CAP);
    let newShards = shards;
    let description = describeWheelPrize(prize);
    let expiresAt: string | undefined;
    let isGrand = prize.tier === "ultimate";

    if (payment === "ticket") {
      newTickets -= 1;
    } else if (payment === "points") {
      newPoints -= WHEEL_SPIN_POINT_COST;
    }

    const lastFreeWheelDate =
      payment === "free" ? today : user.lastFreeWheelDate;

    switch (prize.type) {
      case "nothing":
        description = describeWheelPrize(
          prize,
          pickNothingLine(Date.now() % 1000)
        );
        break;
      case "points":
        newPoints += prize.points ?? 0;
        break;
      case "ticket":
        newTickets += prize.ticketCount ?? 1;
        break;
      case "shard":
        newShards += prize.shardCount ?? 1;
        break;
      case "frame_trial":
      case "badge_trial": {
        if (!prize.itemSlug || !prize.trialHours) break;
        const trial = await grantShopItemTrial(
          session.user.id,
          prize.itemSlug,
          prize.trialHours,
          "wheel"
        );
        if (trial.ok) {
          expiresAt = trial.expiresAt.toISOString();
          description = trial.extended
            ? `${describeWheelPrize(prize)}（已延长）`
            : describeWheelPrize(prize);
        } else {
          newPoints += trial.fallbackPoints;
          description = `已拥有永久款，折算 ${trial.fallbackPoints} 积分`;
        }
        break;
      }
      case "frame_permanent": {
        const slug = prize.itemSlug ?? ULTIMATE_FRAME_SLUG;
        const grant = await grantPermanentShopItem(session.user.id, slug);
        if (grant.ok) {
          description = describeWheelPrize(prize);
          newLuck = 0;
          isGrand = true;
          await checkStatAchievements(session.user.id);
        } else {
          newPoints += grant.fallbackPoints;
          description = `已拥有该传说框，折算 ${grant.fallbackPoints} 积分`;
          newLuck = Math.max(0, newLuck - 20);
        }
        break;
      }
    }

    const milestone = await tryLegendShardMilestone(session.user.id, newShards);
    newShards = milestone.shards;
    newPoints += milestone.extraPoints;
    if (milestone.milestone) {
      description += ` · 碎片已满：${milestone.milestone}`;
      isGrand = true;
      await checkStatAchievements(session.user.id);
    }

    await db
      .update(users)
      .set({
        points: newPoints,
        wheelTickets: newTickets,
        wheelLuck: newLuck,
        legendShards: newShards,
        lastFreeWheelDate,
      })
      .where(eq(users.id, session.user.id));

    await clearExpiredEquippedItems(session.user.id);

    revalidatePath("/wheel");
    revalidatePath("/profile");
    revalidatePath("/shop");
    revalidatePath("/", "layout");

    const result: WheelPrizeResult = {
      index,
      label: prize.label,
      description,
      type: prize.type,
      tier: prize.tier,
      expiresAt,
      isGrand,
    };

    return {
      success: true,
      prize: result,
      points: newPoints,
      wheelTickets: newTickets,
      wheelLuck: newLuck,
      legendShards: newShards,
      freeSpinAvailable: lastFreeWheelDate !== today,
      payment,
    };
  } catch {
    return { error: "抽奖失败，请稍后再试" };
  }
}
