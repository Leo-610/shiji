/** Profile nickname / avatar edit pricing — first change free, then escalating. */

export const PROFILE_EDIT_COST = {
  nickname: { base: 35, step: 25, max: 500 },
  avatar: { base: 50, step: 35, max: 800 },
} as const;

/** Cost for the next change given how many successful changes already made. */
export function getNicknameEditCost(priorChanges: number): number {
  if (priorChanges <= 0) return 0;
  const { base, step, max } = PROFILE_EDIT_COST.nickname;
  return Math.min(base + step * (priorChanges - 1), max);
}

export function getAvatarEditCost(priorChanges: number): number {
  if (priorChanges <= 0) return 0;
  const { base, step, max } = PROFILE_EDIT_COST.avatar;
  return Math.min(base + step * (priorChanges - 1), max);
}

export function formatProfileEditCost(cost: number): string {
  return cost === 0 ? "免费" : `${cost} 积分`;
}

export function getProfileEditRuleDescriptions() {
  return [
    {
      action: "修改昵称",
      note: "首次免费，之后每次 +25 积分递增（上限 500）",
      firstFree: true,
    },
    {
      action: "修改头像",
      note: "首次免费，之后每次 +35 积分递增（上限 800）",
      firstFree: true,
    },
  ];
}
