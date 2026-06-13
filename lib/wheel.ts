import { getShopItem } from "@/lib/shop-items";

export const WHEEL_SPIN_POINT_COST = 80;
export const WHEEL_SEGMENT_COUNT = 12;
export const WHEEL_SEGMENT_ANGLE = 360 / WHEEL_SEGMENT_COUNT;

/** Shard collection goal — grants a permanent legendary frame. */
export const LEGEND_SHARD_GOAL = 100;

/** Luck gained per spin (also boosts rare outcomes). */
export const LUCK_PER_SPIN = 2;
export const LUCK_CAP = 500;

export const ULTIMATE_FRAME_SLUG = "frame-void";
export const LEGENDARY_TRIAL_FRAMES = [
  "frame-void",
  "frame-ascension",
] as const;

export type WheelPrizeTier =
  | "junk"
  | "low"
  | "mid"
  | "rare"
  | "epic"
  | "legendary"
  | "ultimate";

export type WheelPrizeType =
  | "nothing"
  | "points"
  | "ticket"
  | "shard"
  | "frame_trial"
  | "badge_trial"
  | "frame_permanent";

export interface WheelPrize {
  id: string;
  label: string;
  shortLabel: string;
  type: WheelPrizeType;
  tier: WheelPrizeTier;
  /** Base weight in 100M pool before luck modifiers. */
  baseWeight: number;
  color: string;
  points?: number;
  ticketCount?: number;
  shardCount?: number;
  itemSlug?: string;
  trialHours?: number;
}

const NOTHING_LINES = [
  "虚空吞噬了本次奖励",
  "量子噪声干扰，一无所获",
  "余烬飘散，下次再来",
  "熵增生效，奖励归零",
];

/** 12 segments — order is wheel index (top → clockwise). */
export const WHEEL_PRIZES: WheelPrize[] = [
  {
    id: "nothing",
    label: "虚空余烬",
    shortLabel: "空",
    type: "nothing",
    tier: "junk",
    baseWeight: 41_370_001,
    color: "#0f1419",
  },
  {
    id: "pts-5",
    label: "+5 积分",
    shortLabel: "+5",
    type: "points",
    tier: "junk",
    baseWeight: 22_000_000,
    color: "#141c24",
    points: 5,
  },
  {
    id: "pts-8",
    label: "+8 积分",
    shortLabel: "+8",
    type: "points",
    tier: "low",
    baseWeight: 15_000_000,
    color: "#182430",
    points: 8,
  },
  {
    id: "pts-12",
    label: "+12 积分",
    shortLabel: "+12",
    type: "points",
    tier: "low",
    baseWeight: 9_000_000,
    color: "#1a2a38",
    points: 12,
  },
  {
    id: "pts-20",
    label: "+20 积分",
    shortLabel: "+20",
    type: "points",
    tier: "mid",
    baseWeight: 5_000_000,
    color: "#1e3a5f",
    points: 20,
  },
  {
    id: "ticket-1",
    label: "代积分券 ×1",
    shortLabel: "券",
    type: "ticket",
    tier: "mid",
    baseWeight: 3_500_000,
    color: "#2d1f4e",
    ticketCount: 1,
  },
  {
    id: "trial-frame-ember",
    label: "余烬框体验 48h",
    shortLabel: "余烬",
    type: "frame_trial",
    tier: "rare",
    baseWeight: 2_000_000,
    color: "#4a2010",
    itemSlug: "frame-ember",
    trialHours: 48,
  },
  {
    id: "trial-badge-reader",
    label: "读者铭牌 48h",
    shortLabel: "读者",
    type: "badge_trial",
    tier: "rare",
    baseWeight: 1_500_000,
    color: "#1f3d3a",
    itemSlug: "badge-reader",
    trialHours: 48,
  },
  {
    id: "shard-1",
    label: "传说碎片 ×1",
    shortLabel: "碎片",
    type: "shard",
    tier: "epic",
    baseWeight: 500_000,
    color: "#4c1d95",
    shardCount: 1,
  },
  {
    id: "trial-frame-void",
    label: "虚空框体验 12h",
    shortLabel: "虚空",
    type: "frame_trial",
    tier: "legendary",
    baseWeight: 80_000,
    color: "#312e81",
    itemSlug: "frame-void",
    trialHours: 12,
  },
  {
    id: "trial-frame-ascension",
    label: "升格框体验 12h",
    shortLabel: "升格",
    type: "frame_trial",
    tier: "legendary",
    baseWeight: 50_000,
    color: "#713f12",
    itemSlug: "frame-ascension",
    trialHours: 12,
  },
  {
    id: "ultimate-legend-frame",
    label: "终极大奖 · 传说框永久",
    shortLabel: "终奖",
    type: "frame_permanent",
    tier: "ultimate",
    baseWeight: 10,
    color: "#fcd34d",
    itemSlug: ULTIMATE_FRAME_SLUG,
  },
];

const WEIGHT_POOL_TOTAL = WHEEL_PRIZES.reduce((s, p) => s + p.baseWeight, 0);

function tierLuckMultiplier(tier: WheelPrizeTier, luck: number): number {
  const capped = Math.min(luck, LUCK_CAP);
  switch (tier) {
    case "junk":
      return 1;
    case "low":
      return 1 + capped / 400;
    case "mid":
      return 1 + capped / 250;
    case "rare":
      return 1 + capped / 120;
    case "epic":
      return 1 + capped / 80;
    case "legendary":
      return 1 + capped / 50;
    case "ultimate":
      return 1;
    default:
      return 1;
  }
}

export function getEffectiveWeights(luck: number): number[] {
  const ultimatePity = Math.floor(Math.min(luck, LUCK_CAP) / 120);
  return WHEEL_PRIZES.map((p) => {
    if (p.tier === "ultimate") {
      return p.baseWeight + ultimatePity;
    }
    return Math.max(1, Math.floor(p.baseWeight * tierLuckMultiplier(p.tier, luck)));
  });
}

export function pickWheelPrize(luck: number): { prize: WheelPrize; index: number } {
  const weights = getEffectiveWeights(luck);
  const total = weights.reduce((s, w) => s + w, 0);
  let roll = Math.random() * total;
  for (let i = 0; i < WHEEL_PRIZES.length; i++) {
    roll -= weights[i];
    if (roll < 0) {
      return { prize: WHEEL_PRIZES[i], index: i };
    }
  }
  const last = WHEEL_PRIZES.length - 1;
  return { prize: WHEEL_PRIZES[last], index: last };
}

export function getLuckBonusSummary(luck: number): {
  luck: number;
  rareBoostPercent: number;
  shardBoostPercent: number;
  ultimatePityBonus: number;
} {
  const capped = Math.min(luck, LUCK_CAP);
  const rareMult = tierLuckMultiplier("rare", capped);
  const shardMult = tierLuckMultiplier("epic", capped);
  return {
    luck: capped,
    rareBoostPercent: Math.round((rareMult - 1) * 100),
    shardBoostPercent: Math.round((shardMult - 1) * 100),
    ultimatePityBonus: Math.floor(capped / 120),
  };
}

export function describeWheelPrize(
  prize: WheelPrize,
  nothingLine?: string
): string {
  switch (prize.type) {
    case "nothing":
      return nothingLine ?? NOTHING_LINES[0];
    case "points":
      return `获得 ${prize.points} 积分`;
    case "ticket":
      return `获得 ${prize.ticketCount ?? 1} 张代积分券`;
    case "shard":
      return `获得 ${prize.shardCount ?? 1} 枚传说碎片`;
    case "frame_trial":
    case "badge_trial": {
      const item = prize.itemSlug ? getShopItem(prize.itemSlug) : null;
      const name = item?.name ?? prize.label;
      return `${name} 体验 ${prize.trialHours} 小时`;
    }
    case "frame_permanent": {
      const item = prize.itemSlug ? getShopItem(prize.itemSlug) : null;
      return `永久获得 ${item?.name ?? "传说头像框"}`;
    }
    default:
      return prize.label;
  }
}

export function pickNothingLine(seed: number): string {
  return NOTHING_LINES[seed % NOTHING_LINES.length];
}

export function getWheelRuleDescriptions() {
  return [
    {
      action: "转盘抽奖",
      note: `每日 1 次免费，或消耗 ${WHEEL_SPIN_POINT_COST} 积分 / 1 张代积分券`,
    },
    {
      action: "每日免费",
      note: "每天首次抽奖可免费（不扣积分与券）",
    },
    {
      action: "至尊运势",
      note: "签到抽到至尊大吉赠送 1 张代积分券",
    },
    {
      action: "幸运值",
      note: "每次抽奖 +2 幸运值，提升稀有奖励与碎片概率，并累积终极大奖保底",
    },
    {
      action: "传说碎片",
      note: `集满 ${LEGEND_SHARD_GOAL} 枚可兑换永久传说头像框`,
    },
    {
      action: "终极大奖",
      note: "传说头像框永久使用权，基础概率约 0.00001%，幸运值可微量提升",
    },
    {
      action: "体验装扮",
      note: "传说框体验 12 小时，到期自动卸下；已永久拥有则折算积分",
    },
  ];
}

/** Approximate ultimate hit rate display for UI. */
export function formatUltimateChance(luck: number): string {
  const weights = getEffectiveWeights(luck);
  const total = weights.reduce((s, w) => s + w, 0);
  const ultimateIdx = WHEEL_PRIZES.findIndex((p) => p.tier === "ultimate");
  if (ultimateIdx < 0 || total <= 0) return "—";
  const pct = (weights[ultimateIdx] / total) * 100;
  if (pct < 0.0001) return "<0.0001%";
  if (pct < 0.01) return pct.toFixed(4) + "%";
  return pct.toFixed(3) + "%";
}

export const WHEEL_WEIGHT_POOL_TOTAL = WEIGHT_POOL_TOTAL;
