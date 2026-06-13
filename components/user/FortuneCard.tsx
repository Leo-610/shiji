"use client";

import { motion } from "motion/react";
import { Sparkles } from "lucide-react";
import {
  FORTUNE_TIER_STYLES,
  type DailyFortune,
  type FortuneTier,
} from "@/lib/fortunes";
import { cn } from "@/lib/utils";

export type FortuneCardData = {
  id: string;
  tier: FortuneTier;
  tierLabel: string;
  name: string;
  oracle: string;
  advice: string;
};

interface FortuneCardProps {
  fortune: FortuneCardData;
  revealed?: boolean;
  className?: string;
}

export function FortuneCard({
  fortune,
  revealed = true,
  className,
}: FortuneCardProps) {
  const style = FORTUNE_TIER_STYLES[fortune.tier];

  return (
    <motion.div
      initial={revealed ? { rotateY: 90, opacity: 0, scale: 0.92 } : false}
      animate={{ rotateY: 0, opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className={cn(
        "fortune-card relative overflow-hidden rounded-xl border p-5 sm:p-6",
        style.border,
        style.glow,
        className
      )}
    >
      <div className="fortune-card-shimmer" aria-hidden />
      <div className="relative z-10 space-y-3">
        <div className="flex items-center justify-between gap-3">
          <span className="fortune-tier-label font-orbitron text-xs tracking-widest uppercase">
            {fortune.tierLabel}
          </span>
          <Sparkles className="size-4 text-theme-accent opacity-70" />
        </div>
        <div>
          <p className="text-lg font-bold text-theme-heading font-orbitron tracking-wide">
            {fortune.name}
          </p>
          <p className="text-xs text-theme-muted mt-1">今日运势签</p>
        </div>
        <p className="text-sm text-theme-heading leading-relaxed border-l-2 border-theme-accent pl-3">
          {fortune.oracle}
        </p>
        <p className="text-xs text-theme-muted bg-theme-surface/50 rounded-lg px-3 py-2">
          <span className="text-theme-accent">宜：</span>
          {fortune.advice}
        </p>
      </div>
    </motion.div>
  );
}
