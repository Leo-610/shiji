"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import {
  getShopItem,
  RARITY_LABELS,
  SHOP_ITEMS,
  type ShopItemType,
} from "@/lib/shop-items";
import {
  clearExpiredEquippedItems,
  formatGrantExpiry,
  formatPurchaseExpiry,
  getActiveGrants,
  getActiveShopPurchases,
  getOwnedShopSlugs,
  grantOrExtendShopPurchase,
  hasPermanentShopItem,
  userOwnsShopItem,
} from "@/lib/shop-ownership";
import { checkStatAchievements } from "@/lib/achievements";

export type ShopItemView = {
  slug: string;
  name: string;
  description: string;
  type: ShopItemType;
  price: number;
  rarity: string;
  rarityLabel: string;
  badgeLabel?: string;
  owned: boolean;
  equipped: boolean;
  trialExpiresLabel?: string;
  purchaseExpiresLabel?: string;
  isPermanent?: boolean;
};

export async function getShopPageData() {
  const session = await auth();
  if (!session?.user?.id) return null;

  try {
    await clearExpiredEquippedItems(session.user.id);

    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
      columns: {
        points: true,
        equippedAvatarFrame: true,
        equippedTitleBadge: true,
      },
    });
    if (!user) return null;

    const ownedSet = await getOwnedShopSlugs(session.user.id);
    const grants = await getActiveGrants(session.user.id);
    const purchases = await getActiveShopPurchases(session.user.id);
    const grantExpiry = new Map(
      grants.map((g) => [g.itemSlug, formatGrantExpiry(g.expiresAt)])
    );
    const purchaseExpiry = new Map(
      purchases.map((p) => [
        p.itemSlug,
        formatPurchaseExpiry(p.expiresAt),
      ])
    );
    const permanentSlugs = new Set(
      purchases.filter((p) => p.expiresAt === null).map((p) => p.itemSlug)
    );

    const items: ShopItemView[] = SHOP_ITEMS.map((item) => ({
      slug: item.slug,
      name: item.name,
      description: item.description,
      type: item.type,
      price: item.price,
      rarity: item.rarity,
      rarityLabel: RARITY_LABELS[item.rarity],
      badgeLabel: item.badgeLabel,
      owned: ownedSet.has(item.slug),
      trialExpiresLabel: grantExpiry.get(item.slug),
      purchaseExpiresLabel: purchaseExpiry.get(item.slug),
      isPermanent: permanentSlugs.has(item.slug),
      equipped:
        item.type === "avatar_frame"
          ? user.equippedAvatarFrame === item.slug
          : user.equippedTitleBadge === item.slug,
    }));

    return {
      points: user.points ?? 0,
      equippedAvatarFrame: user.equippedAvatarFrame,
      equippedTitleBadge: user.equippedTitleBadge,
      items,
    };
  } catch {
    return null;
  }
}

export async function purchaseShopItem(slug: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "请先登录" };

  const item = getShopItem(slug);
  if (!item) return { error: "商品不存在" };

  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
      columns: { points: true },
    });
    if (!user) return { error: "用户不存在" };

    if (await hasPermanentShopItem(session.user.id, slug)) {
      return { error: "已永久拥有该物品" };
    }

    const points = user.points ?? 0;
    if (points < item.price) {
      return { error: `积分不足，还需 ${item.price - points} 积分` };
    }

    let purchaseMeta: { expiresAt: Date; extended: boolean };
    try {
      purchaseMeta = await grantOrExtendShopPurchase(session.user.id, slug);
    } catch {
      return { error: "已永久拥有该物品" };
    }

    await db
      .update(users)
      .set({ points: points - item.price })
      .where(eq(users.id, session.user.id));

    await checkStatAchievements(session.user.id);

    revalidatePath("/shop");
    revalidatePath("/profile");
    revalidatePath("/", "layout");

    return {
      success: true,
      points: points - item.price,
      slug,
      expiresAt: purchaseMeta.expiresAt.toISOString(),
      extended: purchaseMeta.extended,
      expiresLabel: formatPurchaseExpiry(purchaseMeta.expiresAt),
    };
  } catch {
    return { error: "商店尚未就绪，请稍后再试" };
  }
}

export async function equipShopItem(slug: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "请先登录" };

  const item = getShopItem(slug);
  if (!item) return { error: "商品不存在" };

  try {
    const owned = await userOwnsShopItem(session.user.id, slug);
    if (!owned) return { error: "请先兑换或获得该物品" };

    if (item.type === "avatar_frame") {
      await db
        .update(users)
        .set({ equippedAvatarFrame: slug })
        .where(eq(users.id, session.user.id));
    } else {
      await db
        .update(users)
        .set({ equippedTitleBadge: slug })
        .where(eq(users.id, session.user.id));
    }

    await checkStatAchievements(session.user.id);

    revalidatePath("/shop");
    revalidatePath("/profile");
    revalidatePath("/discussions");
    revalidatePath("/", "layout");

    return { success: true, equipped: slug, type: item.type };
  } catch {
    return { error: "装备失败，请稍后再试" };
  }
}

export async function unequipShopItem(type: ShopItemType) {
  const session = await auth();
  if (!session?.user?.id) return { error: "请先登录" };

  try {
    if (type === "avatar_frame") {
      await db
        .update(users)
        .set({ equippedAvatarFrame: null })
        .where(eq(users.id, session.user.id));
    } else {
      await db
        .update(users)
        .set({ equippedTitleBadge: null })
        .where(eq(users.id, session.user.id));
    }

    revalidatePath("/shop");
    revalidatePath("/", "layout");

    return { success: true };
  } catch {
    return { error: "操作失败" };
  }
}
