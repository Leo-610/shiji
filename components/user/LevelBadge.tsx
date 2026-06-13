import { cn } from "@/lib/utils";
import { getLevelTier } from "@/lib/level";

interface LevelBadgeProps {
  level: number;
  showLabel?: boolean;
  className?: string;
}

const tierStyles = {
  bronze: "level-badge-bronze",
  silver: "level-badge-silver",
  gold: "level-badge-gold",
  purple: "level-badge-purple",
  legend: "level-badge-legend",
};

export function LevelBadge({
  level,
  showLabel = true,
  className,
}: LevelBadgeProps) {
  const tier = getLevelTier(level);

  return (
    <span
      className={cn("level-badge", tierStyles[tier], className)}
      title={`等级 ${level}`}
    >
      {showLabel ? `Lv.${level}` : level}
    </span>
  );
}
