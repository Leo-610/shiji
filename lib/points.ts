export const POINT_REWARDS = {
  dailyCheckIn: 20,
  checkInStreakPerDay: 5,
  checkInStreakCap: 7,
  checkInMilestone7: 100,
  createThread: 30,
  createComment: 10,
  receiveThreadLike: 8,
  receiveCommentLike: 5,
  threadViewReceived: 3,
} as const;

export function getCheckInPoints(streak: number): number {
  const capped = Math.min(streak, POINT_REWARDS.checkInStreakCap);
  const streakBonus = capped * POINT_REWARDS.checkInStreakPerDay;
  const milestone =
    streak === 7 ? POINT_REWARDS.checkInMilestone7 : 0;
  return POINT_REWARDS.dailyCheckIn + streakBonus + milestone;
}

export function getPointRuleDescriptions() {
  return [
    { action: "每日签到抽卡", points: POINT_REWARDS.dailyCheckIn, note: "连续签到额外 +5/天" },
    { action: "连续 7 天签到", points: POINT_REWARDS.checkInMilestone7, note: "第七天一次性奖励" },
    { action: "发布帖子", points: POINT_REWARDS.createThread, note: "仅登录用户" },
    { action: "发表评论", points: POINT_REWARDS.createComment, note: "仅登录用户" },
    { action: "帖子被点赞", points: POINT_REWARDS.receiveThreadLike, note: "每次新增点赞" },
    { action: "评论被点赞", points: POINT_REWARDS.receiveCommentLike, note: "每次新增点赞" },
    { action: "帖子被浏览", points: POINT_REWARDS.threadViewReceived, note: "每位登录读者首次浏览" },
  ];
}
