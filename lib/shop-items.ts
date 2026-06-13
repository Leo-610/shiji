import { LOTTIE_ASSETS } from "@/lib/lottie-frames";

export type ShopItemType = "avatar_frame" | "title_badge";
export type ShopRarity = "common" | "rare" | "epic" | "legendary";

export interface FrameTheme {
  id: string;
  primary: string;
  secondary: string;
  accent: string;
  glow: string;
  rarity: ShopRarity;
  /** Lottie overlay for animated frames (epic+). */
  lottieSrc?: string;
  /** CSS filter to tint a shared Lottie asset per frame theme. */
  lottieFilter?: string;
}

export interface ShopItem {
  slug: string;
  name: string;
  description: string;
  type: ShopItemType;
  price: number;
  rarity: ShopRarity;
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
  },
  {
    slug: "frame-ion",
    name: "离子流框",
    description: "青色离子流沿边框循环，清爽耐看。",
    type: "avatar_frame",
    price: 120,
    rarity: "common",
  },
  {
    slug: "frame-nebula",
    name: "星云旋臂框",
    description: "紫青星云渐变 + Lottie 动效，讨论区辨识度拉满。",
    type: "avatar_frame",
    price: 200,
    rarity: "rare",
  },
  {
    slug: "frame-entropy",
    name: "熵流之环",
    description: "暗紫熵流涌动 + Lottie 动效，神秘读者专属。",
    type: "avatar_frame",
    price: 280,
    rarity: "rare",
  },
  {
    slug: "frame-solar",
    name: "日冕金环",
    description: "金色日冕 Lottie 动效，如同恒星大气层。",
    type: "avatar_frame",
    price: 400,
    rarity: "epic",
  },
  {
    slug: "frame-quantum",
    name: "量子棱镜框",
    description: "七彩棱镜 Lottie 动效，高阶收藏款。",
    type: "avatar_frame",
    price: 550,
    rarity: "epic",
  },
  {
    slug: "frame-void",
    name: "虚空裂隙框",
    description: "深空裂隙 Lottie 动效，压迫感与高级感并存。",
    type: "avatar_frame",
    price: 720,
    rarity: "legendary",
  },
  {
    slug: "frame-ascension",
    name: "升格神谕框",
    description: "至尊 Lottie 动效头像框，积分商店终极奖励。",
    type: "avatar_frame",
    price: 1200,
    rarity: "legendary",
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

export const FRAME_THEMES: Record<string, FrameTheme> = {
  "frame-ember": {
    id: "ember",
    primary: "#fb923c",
    secondary: "#ea580c",
    accent: "#fde047",
    glow: "#f97316",
    rarity: "common",
  },
  "frame-ion": {
    id: "ion",
    primary: "#22d3ee",
    secondary: "#0891b2",
    accent: "#67e8f9",
    glow: "#06b6d4",
    rarity: "common",
  },
  "frame-nebula": {
    id: "nebula",
    primary: "#c084fc",
    secondary: "#7c3aed",
    accent: "#e0e7ff",
    glow: "#a78bfa",
    rarity: "rare",
    lottieSrc: LOTTIE_ASSETS.avatarFrame,
    lottieFilter: "hue-rotate(248deg) saturate(1.45) brightness(1.08)",
  },
  "frame-entropy": {
    id: "entropy",
    primary: "#8b5cf6",
    secondary: "#4c1d95",
    accent: "#ddd6fe",
    glow: "#7c3aed",
    rarity: "rare",
    lottieSrc: LOTTIE_ASSETS.avatarFrame,
    lottieFilter: "hue-rotate(265deg) saturate(1.35) brightness(0.95)",
  },
  "frame-solar": {
    id: "solar",
    primary: "#fbbf24",
    secondary: "#d97706",
    accent: "#fef3c7",
    glow: "#f59e0b",
    rarity: "epic",
    lottieSrc: LOTTIE_ASSETS.avatarFrame,
    lottieFilter: "hue-rotate(32deg) saturate(1.55) brightness(1.12)",
  },
  "frame-quantum": {
    id: "quantum",
    primary: "#22d3ee",
    secondary: "#f472b6",
    accent: "#c084fc",
    glow: "#e879f9",
    rarity: "epic",
    lottieSrc: LOTTIE_ASSETS.avatarFrame,
    lottieFilter: "hue-rotate(155deg) saturate(1.4) brightness(1.05)",
  },
  "frame-void": {
    id: "void",
    primary: "#6366f1",
    secondary: "#312e81",
    accent: "#a5b4fc",
    glow: "#4f46e5",
    rarity: "legendary",
    lottieSrc: LOTTIE_ASSETS.avatarFrame,
    lottieFilter: "hue-rotate(205deg) saturate(1.15) brightness(0.88)",
  },
  "frame-ascension": {
    id: "ascension",
    primary: "#ffd700",
    secondary: "#ff6b6b",
    accent: "#c084fc",
    glow: "#fcd34d",
    rarity: "legendary",
    lottieSrc: LOTTIE_ASSETS.avatarFrame,
  },
};

export function getFrameTheme(
  slug: string | null | undefined
): FrameTheme | null {
  if (!slug) return null;
  return FRAME_THEMES[slug] ?? null;
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
