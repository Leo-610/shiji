import { Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AchievementTier } from "@/lib/achievements";

export type AchievementItemView = {
  id: string;
  name: string;
  description: string;
  points: number;
  tier: AchievementTier;
  unlocked: boolean;
  unlockedAt: string | null;
};

const tierClass: Record<AchievementTier, string> = {
  common: "achievement-tier-common",
  rare: "achievement-tier-rare",
  epic: "achievement-tier-epic",
  legendary: "achievement-tier-legendary",
};

const tierLabel: Record<AchievementTier, string> = {
  common: "普通",
  rare: "稀有",
  epic: "史诗",
  legendary: "传说",
};

interface AchievementGridProps {
  items: AchievementItemView[];
  unlocked: number;
  total: number;
}

export function AchievementGrid({ items, unlocked, total }: AchievementGridProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-theme-heading">
          <Trophy className="size-4 text-theme-accent" />
          <span className="text-sm font-medium">成就墙</span>
        </div>
        <span className="text-xs text-theme-muted font-orbitron">
          {unlocked}/{total}
        </span>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              "achievement-card rounded-lg border p-3 space-y-1.5",
              item.unlocked ? tierClass[item.tier] : "achievement-locked"
            )}
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-sm font-medium text-theme-heading">
                {item.name}
              </p>
              <span className="text-[10px] shrink-0 px-1.5 py-0.5 rounded achievement-tier-tag">
                {tierLabel[item.tier]}
              </span>
            </div>
            <p className="text-xs text-theme-muted leading-relaxed">
              {item.description}
            </p>
            {item.points > 0 && (
              <p className="text-[10px] text-theme-accent font-orbitron">
                奖励 +{item.points} 积分
              </p>
            )}
            <p className="text-[10px] text-theme-subtle">
              {item.unlocked
                ? item.unlockedAt
                  ? `已解锁 · ${new Date(item.unlockedAt).toLocaleDateString("zh-CN")}`
                  : "已解锁"
                : "未解锁"}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
