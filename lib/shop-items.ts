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
    price: 120,
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
    description: "同款 Lottie 动效 · 紫青换色款，讨论区辨识度拉满。",
    type: "avatar_frame",
    price: 500,
    rarity: "rare",
  },
  {
    slug: "frame-entropy",
    name: "熵流之环",
    description: "同款 Lottie 动效 · 暗紫换色款，神秘读者专属。",
    type: "avatar_frame",
    price: 500,
    rarity: "rare",
  },
  {
    slug: "frame-solar",
    name: "日冕金环",
    description: "同款 Lottie 动效 · 日冕金换色款，如同恒星大气层。",
    type: "avatar_frame",
    price: 500,
    rarity: "epic",
  },
  {
    slug: "frame-quantum",
    name: "量子棱镜框",
    description: "同款 Lottie 动效 · 棱镜青换色款，高阶收藏向。",
    type: "avatar_frame",
    price: 500,
    rarity: "epic",
  },
  {
    slug: "frame-void",
    name: "虚空裂隙框",
    description: "同款 Lottie 动效 · 虚空靛换色款，压迫感与高级感并存。",
    type: "avatar_frame",
    price: 500,
    rarity: "legendary",
  },
  {
    slug: "frame-ascension",
    name: "升格神谕框",
    description: "同款 Lottie 动效 · 原色典藏款，积分商店动效框标准价。",
    type: "avatar_frame",
    price: 500,
    rarity: "legendary",
  },
  {
    slug: "badge-reader",
    name: "读者铭牌",
    description: "低调灰青称号，入门读者标识。",
    type: "title_badge",
    price: 50,
    rarity: "common",
    badgeLabel: "读者",
  },
  {
    slug: "badge-stargazer",
    name: "观星者徽章",
    description: "青色光晕称号，夜空漫游者专属。",
    type: "title_badge",
    price: 80,
    rarity: "common",
    badgeLabel: "观星者",
  },
  {
    slug: "badge-wanderer",
    name: "漫游者徽章",
    description: "青绿渐变称号，星际旅人气质。",
    type: "title_badge",
    price: 120,
    rarity: "common",
    badgeLabel: "漫游者",
  },
  {
    slug: "badge-archivist",
    name: "档案员徽章",
    description: "蓝色辉光称号，资料整理者之选。",
    type: "title_badge",
    price: 180,
    rarity: "rare",
    badgeLabel: "档案员",
  },
  {
    slug: "badge-entropy",
    name: "熵行者徽章",
    description: "暗紫脉动光效称号，熵流追随者。",
    type: "title_badge",
    price: 250,
    rarity: "rare",
    badgeLabel: "熵行者",
  },
  {
    slug: "badge-observer",
    name: "观测者徽章",
    description: "蓝紫流光边框称号，深空观测岗位。",
    type: "title_badge",
    price: 300,
    rarity: "rare",
    badgeLabel: "观测者",
  },
  {
    slug: "badge-oracle",
    name: "神谕使徽章",
    description: "史诗紫 shimmer 称号，神谕传述者。",
    type: "title_badge",
    price: 380,
    rarity: "epic",
    badgeLabel: "神谕使",
  },
  {
    slug: "badge-prism",
    name: "棱镜使徽章",
    description: "七彩渐变流动称号，棱镜折射特效。",
    type: "title_badge",
    price: 480,
    rarity: "epic",
    badgeLabel: "棱镜使",
  },
  {
    slug: "badge-void-lord",
    name: "虚空领主徽章",
    description: "深空紫黑辉光称号，虚空裂隙守护者。",
    type: "title_badge",
    price: 650,
    rarity: "legendary",
    badgeLabel: "虚空领主",
  },
  {
    slug: "badge-ascendant",
    name: "升格者徽章",
    description: "金橙流光 shimmer 称号，升格之路见证者。",
    type: "title_badge",
    price: 900,
    rarity: "legendary",
    badgeLabel: "升格者",
  },
  {
    slug: "badge-prophet",
    name: "余烬先知徽章",
    description: "金红至尊脉冲称号，积分商店终极铭牌。",
    type: "title_badge",
    price: 1200,
    rarity: "legendary",
    badgeLabel: "余烬先知",
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

/** Per-badge CSS class for color and motion tier. */
export const TITLE_BADGE_CLASSES: Record<string, string> = {
  "badge-reader": "title-badge-reader",
  "badge-stargazer": "title-badge-stargazer",
  "badge-wanderer": "title-badge-wanderer",
  "badge-archivist": "title-badge-archivist",
  "badge-entropy": "title-badge-entropy",
  "badge-observer": "title-badge-observer",
  "badge-oracle": "title-badge-oracle",
  "badge-prism": "title-badge-prism",
  "badge-void-lord": "title-badge-void-lord",
  "badge-ascendant": "title-badge-ascendant",
  "badge-prophet": "title-badge-prophet",
};

export function getTitleBadgeClass(slug: string | null | undefined): string {
  if (!slug) return "title-badge-default";
  return TITLE_BADGE_CLASSES[slug] ?? "title-badge-default";
}

export const RARITY_LABELS: Record<ShopRarity, string> = {
  common: "普通",
  rare: "稀有",
  epic: "史诗",
  legendary: "传说",
};
