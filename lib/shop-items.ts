export type ShopItemType = "avatar_frame" | "title_badge";
export type ShopRarity = "common" | "rare" | "epic" | "legendary";

export interface ShopItem {
  slug: string;
  name: string;
  description: string;
  type: ShopItemType;
  price: number;
  rarity: ShopRarity;
  /** CSS wrapper class for avatar frames */
  frameClass?: string;
  /** Short label for title badges */
  badgeLabel?: string;
}

export const SHOP_ITEMS: ShopItem[] = [
  {
    slug: "frame-ember",
    name: "余烬脉冲框",
    description: "微弱余烬环绕头像，入门款科幻光晕。",
    type: "avatar_frame",
    price: 60,
    rarity: "common",
    frameClass: "avatar-frame-ember",
  },
  {
    slug: "frame-ion",
    name: "离子流框",
    description: "青色离子流沿边框循环，清爽耐看。",
    type: "avatar_frame",
    price: 120,
    rarity: "common",
    frameClass: "avatar-frame-ion",
  },
  {
    slug: "frame-nebula",
    name: "星云旋臂框",
    description: "紫青星云渐变，讨论区辨识度拉满。",
    type: "avatar_frame",
    price: 200,
    rarity: "rare",
    frameClass: "avatar-frame-nebula",
  },
  {
    slug: "frame-entropy",
    name: "熵流之环",
    description: "暗紫熵流涌动，神秘读者专属。",
    type: "avatar_frame",
    price: 280,
    rarity: "rare",
    frameClass: "avatar-frame-entropy",
  },
  {
    slug: "frame-solar",
    name: "日冕金环",
    description: "金色日冕闪耀，如同恒星大气层。",
    type: "avatar_frame",
    price: 400,
    rarity: "epic",
    frameClass: "avatar-frame-solar",
  },
  {
    slug: "frame-quantum",
    name: "量子棱镜框",
    description: "七彩棱镜折射，高阶收藏款。",
    type: "avatar_frame",
    price: 550,
    rarity: "epic",
    frameClass: "avatar-frame-quantum",
  },
  {
    slug: "frame-void",
    name: "虚空裂隙框",
    description: "深空裂隙边框，压迫感与高级感并存。",
    type: "avatar_frame",
    price: 720,
    rarity: "legendary",
    frameClass: "avatar-frame-void",
  },
  {
    slug: "frame-ascension",
    name: "升格神谕框",
    description: "至尊光效头像框，积分商店终极奖励。",
    type: "avatar_frame",
    price: 1200,
    rarity: "legendary",
    frameClass: "avatar-frame-ascension",
  },
  {
    slug: "badge-stargazer",
    name: "观星者徽章",
    description: "显示在昵称旁的「观星者」称号。",
    type: "title_badge",
    price: 80,
    rarity: "common",
    badgeLabel: "观星者",
  },
  {
    slug: "badge-archivist",
    name: "档案员徽章",
    description: "显示在昵称旁的「档案员」称号。",
    type: "title_badge",
    price: 150,
    rarity: "rare",
    badgeLabel: "档案员",
  },
  {
    slug: "badge-oracle",
    name: "神谕使徽章",
    description: "显示在昵称旁的「神谕使」称号。",
    type: "title_badge",
    price: 320,
    rarity: "epic",
    badgeLabel: "神谕使",
  },
];

const itemMap = new Map(SHOP_ITEMS.map((item) => [item.slug, item]));

export function getShopItem(slug: string): ShopItem | undefined {
  return itemMap.get(slug);
}

export function getFrameClass(slug: string | null | undefined): string | null {
  if (!slug) return null;
  const item = itemMap.get(slug);
  if (item?.type !== "avatar_frame" || !item.frameClass) return null;
  return item.frameClass;
}

export function getTitleBadge(slug: string | null | undefined): string | null {
  if (!slug) return null;
  const item = itemMap.get(slug);
  if (item?.type !== "title_badge" || !item.badgeLabel) return null;
  return item.badgeLabel;
}

export const RARITY_LABELS: Record<ShopRarity, string> = {
  common: "普通",
  rare: "稀有",
  epic: "史诗",
  legendary: "传说",
};
