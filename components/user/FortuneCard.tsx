"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Stars } from "lucide-react";
import {
  FORTUNE_TIER_STYLES,
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
  const [flipped, setFlipped] = useState(revealed);

  useEffect(() => {
    if (revealed) {
      const timer = window.setTimeout(() => setFlipped(true), 80);
      return () => window.clearTimeout(timer);
    }
    setFlipped(false);
  }, [revealed, fortune.id]);

  const isSupreme = fortune.tier === "supreme";

  return (
    <div className={cn("fortune-card-3d mx-auto w-full max-w-md", className)}>
      <motion.div
        className="fortune-card-inner"
        initial={false}
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ type: "spring", stiffness: 210, damping: 26 }}
      >
        {/* Mystery back */}
        <div
          className={cn(
            "fortune-card-face fortune-card-mystery rounded-xl border p-5 sm:p-6",
            "border-[color:var(--app-accent)]/35"
          )}
        >
          <div className="fortune-gacha-portal fortune-gacha-portal-sm" aria-hidden />
          <div className="relative z-10 flex flex-col items-center justify-center gap-3 py-4 text-center">
            <div className="fortune-mystery-sigil font-orbitron text-3xl tracking-[0.35em]">
              签
            </div>
            <p className="text-xs font-orbitron tracking-[0.25em] text-theme-accent uppercase">
              量子余烬 · 每日神谕
            </p>
            <p className="text-[11px] text-theme-muted max-w-[220px] leading-relaxed">
              意识潜入概率海，等待签文坍缩为现实…
            </p>
            <div className="flex gap-1 opacity-60">
              {Array.from({ length: 5 }).map((_, i) => (
                <Stars key={i} className="size-3 text-theme-accent" />
              ))}
            </div>
          </div>
        </div>

        {/* Revealed front */}
        <div
          className={cn(
            "fortune-card-face fortune-card-front fortune-card relative overflow-hidden rounded-xl border p-5 sm:p-6",
            style.border,
            style.glow,
            isSupreme && "fortune-card-supreme-burst"
          )}
        >
          <div className="fortune-card-shimmer" aria-hidden />
          {isSupreme && <div className="fortune-burst-rays" aria-hidden />}
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
        </div>
      </motion.div>
    </div>
  );
}
