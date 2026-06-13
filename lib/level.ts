/** Cumulative XP required to reach each level (index 0 = Lv1). */
export const LEVEL_XP_THRESHOLDS = [
  0,
  200,
  1500,
  4500,
  10800,
  28800,
  45000,
  64000,
  90000,
  120000,
];

export const MAX_LEVEL = 64;

export const XP_REWARDS = {
  dailyCheckIn: 10,
  checkInStreakPerDay: 2,
  checkInStreakCap: 7,
  checkInMilestone7: 50,
  createThread: 15,
  createComment: 5,
  receiveThreadLike: 3,
  receiveCommentLike: 2,
  threadViewReceived: 1,
} as const;

const LEVEL_TITLES: Record<number, string> = {
  1: "见习观测者",
  2: "余烬读者",
  3: "量子旅人",
  4: "维度行者",
  5: "时空编目员",
  6: "余烬元老",
  7: "星云守望者",
  8: "熵渊行者",
  9: "奇点编年史",
  10: "深空执政官",
};

export function levelFromXp(xp: number): number {
  let level = 1;
  for (let i = 1; i < LEVEL_XP_THRESHOLDS.length; i++) {
    if (xp >= LEVEL_XP_THRESHOLDS[i]) level = i + 1;
  }
  if (xp >= 120000) {
    const extra = Math.floor((xp - 120000) / 20000);
    level = Math.max(level, 10 + extra);
  }
  return Math.min(level, MAX_LEVEL);
}

export function xpRequiredForLevel(level: number): number {
  if (level <= 1) return 0;
  if (level <= LEVEL_XP_THRESHOLDS.length) {
    return LEVEL_XP_THRESHOLDS[level - 1];
  }
  if (level <= MAX_LEVEL) {
    return 120000 + (level - 10) * 20000;
  }
  return 120000 + (MAX_LEVEL - 10) * 20000;
}

export function xpForNextLevel(level: number): number | null {
  if (level >= MAX_LEVEL) return null;
  return xpRequiredForLevel(level + 1);
}

export function getLevelTitle(level: number): string {
  if (level <= 10) return LEVEL_TITLES[level] ?? `Lv.${level}`;
  if (level >= 60) return "量子至尊";
  if (level >= 50) return "时空领主";
  if (level >= 40) return "维度先驱";
  if (level >= 30) return "余烬传说";
  if (level >= 20) return "深空元老";
  return `深空旅人 · ${level}`;
}

export function getCheckInXp(streak: number): number {
  const capped = Math.min(streak, XP_REWARDS.checkInStreakCap);
  const streakBonus = capped * XP_REWARDS.checkInStreakPerDay;
  const milestone =
    streak === 7 ? XP_REWARDS.checkInMilestone7 : 0;
  return XP_REWARDS.dailyCheckIn + streakBonus + milestone;
}

export function getXpProgress(xp: number, level: number) {
  const currentFloor = xpRequiredForLevel(level);
  const nextCeiling = xpForNextLevel(level);
  if (nextCeiling === null) {
    return { current: xp, floor: currentFloor, next: null, percent: 100 };
  }
  const span = nextCeiling - currentFloor;
  const gained = xp - currentFloor;
  const percent =
    span <= 0 ? 100 : Math.min(100, Math.round((gained / span) * 100));
  return {
    current: xp,
    floor: currentFloor,
    next: nextCeiling,
    percent,
  };
}

/** Bilibili-style tier color for level badge. */
export function getLevelTier(level: number): "bronze" | "silver" | "gold" | "purple" | "legend" {
  if (level >= 50) return "legend";
  if (level >= 30) return "purple";
  if (level >= 20) return "gold";
  if (level >= 10) return "silver";
  return "bronze";
}

export function getXpRuleDescriptions() {
  return [
    { action: "每日签到", xp: XP_REWARDS.dailyCheckIn, note: "连续签到额外 +2/天，上限 7 天" },
    { action: "连续 7 天签到", xp: XP_REWARDS.checkInMilestone7, note: "第七天一次性奖励" },
    { action: "发布帖子", xp: XP_REWARDS.createThread, note: "仅登录用户" },
    { action: "发表评论", xp: XP_REWARDS.createComment, note: "仅登录用户" },
    { action: "帖子被点赞", xp: XP_REWARDS.receiveThreadLike, note: "每次新增点赞" },
    { action: "评论被点赞", xp: XP_REWARDS.receiveCommentLike, note: "每次新增点赞" },
    { action: "帖子被浏览", xp: XP_REWARDS.threadViewReceived, note: "每位登录读者首次浏览" },
  ];
}
