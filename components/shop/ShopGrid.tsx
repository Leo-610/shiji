"use client";

import { useState } from "react";
import { Coins, Sparkles } from "lucide-react";
import {
  equipShopItem,
  purchaseShopItem,
  unequipShopItem,
  type ShopItemView,
} from "@/app/actions/shop";
import { AvatarWithFrame } from "@/components/user/AvatarWithFrame";
import { NeonCard } from "@/components/cyber/NeonCard";
import { Button } from "@/components/ui/button";
import { getFrameTheme, frameHasAnimatedOverlay, getTitleBadgeClass } from "@/lib/shop-items";
import { cn } from "@/lib/utils";

interface ShopGridProps {
  initialPoints: number;
  userImage?: string | null;
  userName?: string | null;
  items: ShopItemView[];
}

export function ShopGrid({
  initialPoints,
  userImage,
  userName,
  items,
}: ShopGridProps) {
  const [points, setPoints] = useState(initialPoints);
  const [catalog, setCatalog] = useState(items);
  const [loadingSlug, setLoadingSlug] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const previewFrame = catalog.find(
    (i) => i.type === "avatar_frame" && i.equipped
  );

  async function handlePurchase(slug: string) {
    setLoadingSlug(slug);
    setMessage(null);
    const result = await purchaseShopItem(slug);
    setLoadingSlug(null);

    if (result.error) {
      setMessage(result.error);
      return;
    }

    if (result.success && result.points !== undefined) {
      setPoints(result.points);
      setCatalog((prev) =>
        prev.map((item) =>
          item.slug === slug ? { ...item, owned: true } : item
        )
      );
      setMessage("兑换成功！可在下方装备。");
    }
  }

  async function handleEquip(slug: string) {
    setLoadingSlug(slug);
    setMessage(null);
    const result = await equipShopItem(slug);
    setLoadingSlug(null);

    if (result.error) {
      setMessage(result.error);
      return;
    }

    if (result.success) {
      setCatalog((prev) =>
        prev.map((item) => ({
          ...item,
          equipped:
            item.slug === slug
              ? true
              : item.type === result.type
                ? false
                : item.equipped,
        }))
      );
      setMessage("已装备");
    }
  }

  async function handleUnequip(type: "avatar_frame" | "title_badge") {
    setLoadingSlug(`unequip-${type}`);
    const result = await unequipShopItem(type);
    setLoadingSlug(null);
    if (result.error) {
      setMessage(result.error);
      return;
    }
    setCatalog((prev) =>
      prev.map((item) =>
        item.type === type ? { ...item, equipped: false } : item
      )
    );
    setMessage("已卸下");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2 text-theme-heading">
          <Coins className="size-5 text-theme-accent" />
          <span className="font-orbitron text-lg">{points}</span>
          <span className="text-sm text-theme-muted">积分</span>
        </div>
        <div className="flex items-center gap-3">
          <AvatarWithFrame
            name={userName}
            image={userImage}
            frameSlug={previewFrame?.slug}
            size="md"
          />
          <span className="text-xs text-theme-muted">头像预览</span>
        </div>
      </div>

      {message && (
        <p className="text-sm text-theme-accent">{message}</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        {catalog.map((item) => (
          <NeonCard
            key={item.slug}
            className={cn(
              "p-4 space-y-3",
              item.equipped && "border-[color:var(--app-accent)]/45"
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="font-medium text-theme-heading">{item.name}</p>
                <span
                  className={cn(
                    "text-[10px] font-orbitron tracking-wide mt-1 inline-block px-2 py-0.5 rounded",
                    `shop-rarity-${item.rarity}`
                  )}
                >
                  {item.rarityLabel}
                  {item.type === "avatar_frame" ? " · 头像框" : " · 称号"}
                  {item.type === "avatar_frame" &&
                    frameHasAnimatedOverlay(item.slug) &&
                    " · 动效"}
                </span>
              </div>
              <span className="text-sm font-orbitron text-theme-accent shrink-0">
                {item.price}
              </span>
            </div>

            <p className="text-xs text-theme-muted leading-relaxed">
              {item.description}
            </p>

            {item.type === "avatar_frame" && (
              <div className="flex justify-center py-2">
                <AvatarWithFrame
                  name={userName}
                  image={userImage}
                  frameSlug={item.slug}
                  size="lg"
                />
              </div>
            )}

            {item.type === "title_badge" && item.badgeLabel && (
              <div className="flex justify-center py-1">
                <span
                  className={cn(
                    "shop-title-badge",
                    getTitleBadgeClass(item.slug)
                  )}
                >
                  {item.badgeLabel}
                </span>
              </div>
            )}

            <div className="flex gap-2 flex-wrap">
              {!item.owned ? (
                <Button
                  size="sm"
                  disabled={loadingSlug === item.slug || points < item.price}
                  onClick={() => handlePurchase(item.slug)}
                >
                  {loadingSlug === item.slug ? "兑换中…" : "兑换"}
                </Button>
              ) : item.equipped ? (
                <Button
                  size="sm"
                  variant="outline"
                  disabled={loadingSlug?.startsWith("unequip")}
                  onClick={() => handleUnequip(item.type)}
                >
                  卸下
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  disabled={loadingSlug === item.slug}
                  onClick={() => handleEquip(item.slug)}
                >
                  {loadingSlug === item.slug ? "…" : "装备"}
                </Button>
              )}
              {item.owned && (
                <span className="text-xs text-theme-muted flex items-center gap-1">
                  <Sparkles className="size-3" /> 已拥有
                </span>
              )}
            </div>
          </NeonCard>
        ))}
      </div>
    </div>
  );
}
