"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

const RITUAL_STEPS = [
  "同步量子场…",
  "坍缩概率云…",
  "解读余烬签文…",
];

interface FortuneGachaStageProps {
  active: boolean;
  className?: string;
}

export function FortuneGachaRitual({ active, className }: FortuneGachaStageProps) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!active) {
      setStep(0);
      return;
    }
    const interval = window.setInterval(() => {
      setStep((s) => (s + 1) % RITUAL_STEPS.length);
    }, 650);
    return () => window.clearInterval(interval);
  }, [active]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          className={cn("fortune-gacha-ritual", className)}
        >
          <div className="fortune-gacha-portal" aria-hidden />
          <div className="fortune-gacha-portal fortune-gacha-portal-reverse" aria-hidden />
          <motion.div
            className="fortune-gacha-orb"
            animate={{ scale: [1, 1.08, 1], opacity: [0.75, 1, 0.75] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden
          />
          <div className="relative z-10 flex flex-col items-center gap-2 py-2">
            <p className="font-orbitron text-[10px] tracking-[0.35em] text-theme-accent uppercase">
              Oracle Protocol
            </p>
            <motion.p
              key={step}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-theme-heading font-orbitron"
            >
              {RITUAL_STEPS[step]}
            </motion.p>
            <div className="fortune-ritual-bars" aria-hidden>
              {RITUAL_STEPS.map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    "fortune-ritual-bar",
                    i <= step && "fortune-ritual-bar-active"
                  )}
                />
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function FortuneGachaAltar({ className }: { className?: string }) {
  return (
    <div className={cn("fortune-gacha-altar", className)}>
      <div className="fortune-gacha-portal fortune-gacha-portal-idle" aria-hidden />
      <div className="fortune-gacha-orb fortune-gacha-orb-idle" aria-hidden />
      <div className="relative z-10 text-center space-y-1 py-2">
        <p className="font-orbitron text-[10px] tracking-[0.3em] text-theme-accent/80 uppercase">
          Daily Oracle Pool
        </p>
        <p className="text-xs text-theme-muted">点击签到，从概率海中抽取今日签文</p>
      </div>
    </div>
  );
}
