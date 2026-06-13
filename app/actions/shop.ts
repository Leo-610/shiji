"use server";

import { revalidatePath } from "next/cache";
import { and, eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { userShopItems, users } from "@/lib/db/schema";
import {
  getShopItem,
  RARITY_LABELS,
  SHOP_ITEMS,
  type ShopItemType,
} from "@/lib/shop-items";

export type ShopItemView = {
  slug: string;
  name: string;
  description: string;
  type: ShopItemType;
  price: number;
  rarity: string;
  rarityLabel: string;
  frameClass?: string;
  badgeLabel?: string;
  owned: boolean;
  equipped: boolean;
};

export async function getShopPageData() {
  const session = await auth();
  if (!session?.user?.id) return null;

  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
      columns: {
        points: true,
        equippedAvatarFrame: true,
        equippedTitleBadge: true,
      },
    });
    if (!user) return null;

    const ownedRows = await db.query.userShopItems.findMany({
      where: eq(userShopItems.userId, session.user.id),
      columns: { itemSlug: true },
    });
    const ownedSet = new Set(ownedRows.map((r) => r.itemSlug));

    const items: ShopItemView[] = SHOP_ITEMS.map((item) => ({
      slug: item.slug,
      name: item.name,
      description: item.description,
      type: item.type,
      price: item.price,
      rarity: item.rarity,
      rarityLabel: RARITY_LABELS[item.rarity],
      frameClass: item.frameClass,
      badgeLabel: item.badgeLabel,
      owned: ownedSet.has(item.slug),
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

    const existing = await db.query.userShopItems.findFirst({
      where: and(
        eq(userShopItems.userId, session.user.id),
        eq(userShopItems.itemSlug, slug)
      ),
    });
    if (existing) return { error: "已拥有该物品" };

    const points = user.points ?? 0;
    if (points < item.price) {
      return { error: `积分不足，还需 ${item.price - points} 积分` };
    }

    await db
      .update(users)
      .set({ points: points - item.price })
      .where(eq(users.id, session.user.id));

    await db.insert(userShopItems).values({
      userId: session.user.id,
      itemSlug: slug,
    });

    revalidatePath("/shop");
    revalidatePath("/profile");
    revalidatePath("/", "layout");

    return {
      success: true,
      points: points - item.price,
      slug,
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
    const owned = await db.query.userShopItems.findFirst({
      where: and(
        eq(userShopItems.userId, session.user.id),
        eq(userShopItems.itemSlug, slug)
      ),
    });
    if (!owned) return { error: "请先兑换该物品" };

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
