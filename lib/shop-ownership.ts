import { and, eq, gt } from "drizzle-orm";
import { db } from "@/lib/db";
import { userItemGrants, userShopItems, users } from "@/lib/db/schema";
import { addShopValidity } from "@/lib/shop-duration";
import { getShopItem, type ShopRarity } from "@/lib/shop-items";

const TRIAL_FALLBACK_POINTS: Record<ShopRarity, number> = {
  common: 40,
  rare: 90,
  epic: 180,
  legendary: 350,
};

export type ActiveGrant = {
  itemSlug: string;
  expiresAt: Date;
};

export type ShopPurchaseRow = {
  itemSlug: string;
  expiresAt: Date | null;
};

export async function getShopPurchase(
  userId: string,
  itemSlug: string
): Promise<ShopPurchaseRow | null> {
  const row = await db.query.userShopItems.findFirst({
    where: and(
      eq(userShopItems.userId, userId),
      eq(userShopItems.itemSlug, itemSlug)
    ),
    columns: { itemSlug: true, expiresAt: true },
  });
  return row ?? null;
}

/** Permanent ownership (null expires_at) — wheel / shard grand prizes only. */
export async function hasPermanentShopItem(
  userId: string,
  itemSlug: string
): Promise<boolean> {
  const row = await getShopPurchase(userId, itemSlug);
  return row !== null && row.expiresAt === null;
}

export async function hasActiveShopPurchase(
  userId: string,
  itemSlug: string
): Promise<boolean> {
  const row = await getShopPurchase(userId, itemSlug);
  if (!row) return false;
  if (row.expiresAt === null) return true;
  return row.expiresAt > new Date();
}

export async function getActiveShopPurchases(
  userId: string
): Promise<ShopPurchaseRow[]> {
  const now = new Date();
  const rows = await db.query.userShopItems.findMany({
    where: eq(userShopItems.userId, userId),
    columns: { itemSlug: true, expiresAt: true },
  });
  return rows.filter(
    (r) => r.expiresAt === null || r.expiresAt > now
  );
}

export async function grantOrExtendShopPurchase(
  userId: string,
  itemSlug: string
): Promise<{ expiresAt: Date; extended: boolean }> {
  const now = new Date();
  const existing = await getShopPurchase(userId, itemSlug);

  if (existing?.expiresAt === null) {
    throw new Error("PERMANENT_OWNED");
  }

  if (existing) {
    const base =
      existing.expiresAt && existing.expiresAt > now
        ? existing.expiresAt
        : now;
    const expiresAt = addShopValidity(base);
    await db
      .update(userShopItems)
      .set({ expiresAt, purchasedAt: now })
      .where(
        and(
          eq(userShopItems.userId, userId),
          eq(userShopItems.itemSlug, itemSlug)
        )
      );
    return { expiresAt, extended: true };
  }

  const expiresAt = addShopValidity(now);
  await db.insert(userShopItems).values({
    userId,
    itemSlug,
    expiresAt,
  });
  return { expiresAt, extended: false };
}

export async function getActiveGrants(userId: string): Promise<ActiveGrant[]> {
  const now = new Date();
  const rows = await db.query.userItemGrants.findMany({
    where: and(
      eq(userItemGrants.userId, userId),
      gt(userItemGrants.expiresAt, now)
    ),
    columns: { itemSlug: true, expiresAt: true },
    orderBy: (t, { desc }) => [desc(t.expiresAt)],
  });

  const bySlug = new Map<string, Date>();
  for (const row of rows) {
    const existing = bySlug.get(row.itemSlug);
    if (!existing || row.expiresAt > existing) {
      bySlug.set(row.itemSlug, row.expiresAt);
    }
  }

  return Array.from(bySlug.entries()).map(([itemSlug, expiresAt]) => ({
    itemSlug,
    expiresAt,
  }));
}

export async function userOwnsShopItem(
  userId: string,
  itemSlug: string
): Promise<boolean> {
  if (await hasActiveShopPurchase(userId, itemSlug)) return true;
  const now = new Date();
  const grant = await db.query.userItemGrants.findFirst({
    where: and(
      eq(userItemGrants.userId, userId),
      eq(userItemGrants.itemSlug, itemSlug),
      gt(userItemGrants.expiresAt, now)
    ),
    columns: { id: true },
  });
  return !!grant;
}

export async function getOwnedShopSlugs(userId: string): Promise<Set<string>> {
  const purchases = await getActiveShopPurchases(userId);
  const grants = await getActiveGrants(userId);
  const set = new Set(purchases.map((r) => r.itemSlug));
  for (const g of grants) set.add(g.itemSlug);
  return set;
}

export async function grantShopItemTrial(
  userId: string,
  itemSlug: string,
  hours: number,
  source: string
): Promise<
  | { ok: true; expiresAt: Date; extended: boolean }
  | { ok: false; fallbackPoints: number }
> {
  const item = getShopItem(itemSlug);
  if (!item) {
    return { ok: false, fallbackPoints: 30 };
  }

  if (await hasActiveShopPurchase(userId, itemSlug)) {
    return {
      ok: false,
      fallbackPoints: TRIAL_FALLBACK_POINTS[item.rarity],
    };
  }

  const now = new Date();
  const ms = hours * 60 * 60 * 1000;

  const active = await db.query.userItemGrants.findFirst({
    where: and(
      eq(userItemGrants.userId, userId),
      eq(userItemGrants.itemSlug, itemSlug),
      gt(userItemGrants.expiresAt, now)
    ),
    orderBy: (t, { desc }) => [desc(t.expiresAt)],
  });

  if (active) {
    const expiresAt = new Date(active.expiresAt.getTime() + ms);
    await db
      .update(userItemGrants)
      .set({ expiresAt })
      .where(eq(userItemGrants.id, active.id));
    return { ok: true, expiresAt, extended: true };
  }

  const expiresAt = new Date(now.getTime() + ms);
  await db.insert(userItemGrants).values({
    userId,
    itemSlug,
    source,
    expiresAt,
  });
  return { ok: true, expiresAt, extended: false };
}

export async function grantPermanentShopItem(
  userId: string,
  itemSlug: string
): Promise<{ ok: true } | { ok: false; fallbackPoints: number }> {
  const item = getShopItem(itemSlug);
  if (!item) {
    return { ok: false, fallbackPoints: 50 };
  }

  if (await hasPermanentShopItem(userId, itemSlug)) {
    return {
      ok: false,
      fallbackPoints: TRIAL_FALLBACK_POINTS[item.rarity],
    };
  }

  const existing = await getShopPurchase(userId, itemSlug);
  if (existing) {
    await db
      .update(userShopItems)
      .set({ expiresAt: null, purchasedAt: new Date() })
      .where(
        and(
          eq(userShopItems.userId, userId),
          eq(userShopItems.itemSlug, itemSlug)
        )
      );
  } else {
    await db.insert(userShopItems).values({
      userId,
      itemSlug,
      expiresAt: null,
    });
  }

  return { ok: true };
}

export async function clearExpiredEquippedItems(userId: string) {
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: { equippedAvatarFrame: true, equippedTitleBadge: true },
  });
  if (!user) return;

  const updates: Partial<{
    equippedAvatarFrame: string | null;
    equippedTitleBadge: string | null;
  }> = {};

  if (
    user.equippedAvatarFrame &&
    !(await userOwnsShopItem(userId, user.equippedAvatarFrame))
  ) {
    updates.equippedAvatarFrame = null;
  }
  if (
    user.equippedTitleBadge &&
    !(await userOwnsShopItem(userId, user.equippedTitleBadge))
  ) {
    updates.equippedTitleBadge = null;
  }

  if (Object.keys(updates).length > 0) {
    await db.update(users).set(updates).where(eq(users.id, userId));
  }
}

export function formatGrantExpiry(expiresAt: Date): string {
  const diff = expiresAt.getTime() - Date.now();
  if (diff <= 0) return "已过期";
  const hours = Math.ceil(diff / (60 * 60 * 1000));
  if (hours < 24) return `${hours} 小时后到期`;
  const days = Math.ceil(hours / 24);
  if (days > 60) return `${Math.ceil(days / 30)} 个月后到期`;
  return `${days} 天后到期`;
}

export function formatPurchaseExpiry(expiresAt: Date | null): string | undefined {
  if (expiresAt === null) return "永久";
  if (expiresAt <= new Date()) return undefined;
  return formatGrantExpiry(expiresAt);
}
