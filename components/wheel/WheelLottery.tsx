"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Coins, Gift, Loader2, Sparkles, Ticket, Zap } from "lucide-react";
import {
  spinWheel,
  type WheelPageData,
  type WheelPaymentMethod,
  type WheelPrizeResult,
} from "@/app/actions/wheel";
import { NeonCard } from "@/components/cyber/NeonCard";
import { WheelDisc } from "@/components/wheel/WheelDisc";
import { Button } from "@/components/ui/button";
import { WHEEL_SEGMENT_ANGLE, WHEEL_SEGMENT_COUNT } from "@/lib/wheel";
import { cn } from "@/lib/utils";

interface WheelLotteryProps {
  initialData: WheelPageData;
}

const PAY_OPTIONS: {
  id: WheelPaymentMethod;
  label: string;
  sub?: string;
}[] = [
  { id: "free", label: "每日免费", sub: "首抽" },
  { id: "points", label: "80 积分" },
  { id: "ticket", label: "代积分券", sub: "×1" },
];

export function WheelLottery({ initialData }: WheelLotteryProps) {
  const router = useRouter();
  const [points, setPoints] = useState(initialData.points);
  const [tickets, setTickets] = useState(initialData.wheelTickets);
  const [luck, setLuck] = useState(initialData.wheelLuck);
  const [shards, setShards] = useState(initialData.legendShards);
  const [ultimateChance, setUltimateChance] = useState(
    initialData.ultimateChanceLabel
  );
  const [luckSummary, setLuckSummary] = useState(initialData.luckSummary);
  const [payment, setPayment] = useState<WheelPaymentMethod>(
    initialData.freeSpinAvailable ? "free" : "points"
  );
  const [freeSpinAvailable, setFreeSpinAvailable] = useState(
    initialData.freeSpinAvailable
  );
  const [spinning, setSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [result, setResult] = useState<WheelPrizeResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [trials, setTrials] = useState(initialData.activeTrials);

  useEffect(() => {
    setPoints(initialData.points);
    setTickets(initialData.wheelTickets);
    setLuck(initialData.wheelLuck);
    setShards(initialData.legendShards);
    setUltimateChance(initialData.ultimateChanceLabel);
    setLuckSummary(initialData.luckSummary);
    setTrials(initialData.activeTrials);
    setFreeSpinAvailable(initialData.freeSpinAvailable);
    if (initialData.freeSpinAvailable) {
      setPayment("free");
    }
  }, [initialData]);

  const canSpinPoints = points >= initialData.spinPointCost;
  const canSpinTicket = tickets >= 1;
  const canSpinFree = freeSpinAvailable;
  const canSpin =
    payment === "free"
      ? canSpinFree
      : payment === "ticket"
        ? canSpinTicket
        : canSpinPoints;
  const shardPercent = Math.min(
    100,
    Math.round((shards / initialData.shardGoal) * 100)
  );

  async function handleSpin() {
    if (spinning || !canSpin) return;
    setSpinning(true);
    setError(null);
    setResult(null);

    const spinResult = await spinWheel(payment);

    if (spinResult.error) {
      setSpinning(false);
      setError(spinResult.error);
      return;
    }

    if (!spinResult.success || !spinResult.prize) {
      setSpinning(false);
      setError("抽奖失败");
      return;
    }

    const prizeIndex = spinResult.prize.index;
    const extra = 5 + Math.floor(Math.random() * 3);
    const segmentCenter =
      prizeIndex * WHEEL_SEGMENT_ANGLE + WHEEL_SEGMENT_ANGLE / 2;
    const currentMod = rotation % 360;
    const delta = extra * 360 + (360 - segmentCenter) - currentMod;
    setRotation(rotation + delta);

    window.setTimeout(() => {
      setSpinning(false);
      setPoints(spinResult.points ?? points);
      setTickets(spinResult.wheelTickets ?? tickets);
      if (spinResult.wheelLuck !== undefined) setLuck(spinResult.wheelLuck);
      if (spinResult.legendShards !== undefined)
        setShards(spinResult.legendShards);
      if (spinResult.freeSpinAvailable !== undefined) {
        setFreeSpinAvailable(spinResult.freeSpinAvailable);
        if (!spinResult.freeSpinAvailable && payment === "free") {
          setPayment("points");
        }
      }
      setResult(spinResult.prize!);
      router.refresh();
    }, 4200);
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-2">
        <div className="wheel-stat-chip">
          <Coins className="size-4 text-theme-accent shrink-0" />
          <div>
            <p className="wheel-stat-value">{points}</p>
            <p className="wheel-stat-label">积分</p>
          </div>
        </div>
        <div className="wheel-stat-chip">
          <Ticket className="size-4 text-[#a78bfa] shrink-0" />
          <div>
            <p className="wheel-stat-value">{tickets}</p>
            <p className="wheel-stat-label">代积分券</p>
          </div>
        </div>
        <div className="wheel-stat-chip">
          <Sparkles className="size-4 text-amber-400 shrink-0" />
          <div>
            <p className="wheel-stat-value">{luck}</p>
            <p className="wheel-stat-label">幸运值</p>
          </div>
        </div>
      </div>

      <NeonCard glow="purple" className="p-4 space-y-3">
        <div className="flex justify-between items-center gap-2 text-xs">
          <span className="font-orbitron tracking-wide text-theme-heading">
            传说碎片{" "}
            <span className="text-theme-accent">{shards}</span>
            <span className="text-theme-muted">/{initialData.shardGoal}</span>
          </span>
          <span className="text-theme-muted shrink-0">
            终极大奖 <span className="text-amber-400/90">{ultimateChance}</span>
          </span>
        </div>
        <div className="wheel-shard-track">
          <div
            className="wheel-shard-fill"
            style={{ width: `${shardPercent}%` }}
          />
        </div>
        <p className="text-[11px] text-theme-muted leading-relaxed flex items-center gap-1.5">
          <Zap className="size-3 text-theme-accent shrink-0" />
          稀有 +{luckSummary.rareBoostPercent}% · 碎片 +{luckSummary.shardBoostPercent}% · 终奖保底 +{luckSummary.ultimatePityBonus}
        </p>
      </NeonCard>

      <div className="flex justify-center gap-2 flex-wrap">
        {PAY_OPTIONS.map((opt) => {
          const disabled =
            opt.id === "free"
              ? !freeSpinAvailable
              : opt.id === "ticket"
                ? !canSpinTicket
                : false;
          const active = payment === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              disabled={disabled}
              onClick={() => setPayment(opt.id)}
              className={cn(
                "wheel-pay-chip",
                active && "wheel-pay-chip-active",
                disabled && "opacity-40 pointer-events-none"
              )}
            >
              <span className="font-orbitron text-xs tracking-wide">
                {opt.id === "points"
                  ? `${initialData.spinPointCost} 积分`
                  : opt.label}
              </span>
              {opt.sub && (
                <span className="text-[10px] text-theme-muted">{opt.sub}</span>
              )}
            </button>
          );
        })}
      </div>

      <div className="wheel-stage">
        <div className="wheel-stage-aura" aria-hidden />
        <div
          className={cn("wheel-orbit-ring", spinning && "wheel-orbit-ring-spin")}
          aria-hidden
        />
        <div className="wheel-rim-lights" aria-hidden>
          {Array.from({ length: WHEEL_SEGMENT_COUNT }).map((_, i) => (
            <div
              key={i}
              className="wheel-rim-spoke"
              style={{ transform: `rotate(${i * WHEEL_SEGMENT_ANGLE}deg)` }}
            >
              <span
                className={cn(
                  "wheel-rim-light",
                  spinning && "wheel-rim-light-pulse"
                )}
              />
            </div>
          ))}
        </div>

        <div className="wheel-pointer-crown" aria-hidden>
          <div className="wheel-pointer-glow" />
          <div className="wheel-pointer-arrow" />
        </div>

        <div className="wheel-disc-shell">
          <WheelDisc
            prizes={initialData.prizes}
            rotation={rotation}
            spinning={spinning}
          />
        </div>

        <button
          type="button"
          disabled={spinning || !canSpin}
          onClick={handleSpin}
          className={cn(
            "wheel-hub-btn",
            spinning && "wheel-hub-btn-spinning",
            !canSpin && "opacity-50"
          )}
          aria-label="开始抽奖"
        >
          {spinning ? (
            <Loader2 className="size-7 animate-spin text-theme-accent" />
          ) : (
            <Gift className="size-7 text-theme-accent" />
          )}
        </button>
      </div>

      <p className="text-center text-[11px] text-theme-muted px-2">
        {WHEEL_SEGMENT_COUNT} 格量子奖池 · 暗色区块为低奖 · 金格为终极大奖
      </p>

      <div className="flex justify-center">
        <Button
          size="lg"
          disabled={spinning || !canSpin}
          onClick={handleSpin}
          className="min-w-[12rem] font-orbitron tracking-widest shadow-[0_0_24px_rgba(0,240,255,0.2)]"
        >
          {spinning ? (
            <>
              <Loader2 className="size-4 animate-spin mr-2" />
              量子转动中…
            </>
          ) : (
            "启动转盘"
          )}
        </Button>
      </div>

      {error && <p className="text-center text-sm text-red-400">{error}</p>}

      {result && !spinning && (
        <NeonCard
          glow={result.isGrand ? "purple" : "cyan"}
          className="p-4 text-center space-y-2"
        >
          <p className="text-xs font-orbitron tracking-widest text-theme-accent uppercase">
            {result.type === "nothing"
              ? "抽奖结果"
              : result.isGrand
                ? "传说降临"
                : "恭喜获得"}
          </p>
          <p className="text-lg font-medium text-theme-heading">{result.label}</p>
          <p className="text-sm text-theme-muted">{result.description}</p>
        </NeonCard>
      )}

      {trials.length > 0 && (
        <NeonCard className="p-4 space-y-2">
          <p className="text-xs font-orbitron tracking-widest text-theme-accent opacity-80 uppercase">
            体验装扮
          </p>
          <ul className="space-y-1.5 text-sm text-theme-muted">
            {trials.map((t) => (
              <li key={t.itemSlug} className="flex justify-between gap-2">
                <span className="text-theme-heading">{t.name}</span>
                <span className="text-xs shrink-0">{t.expiresLabel}</span>
              </li>
            ))}
          </ul>
        </NeonCard>
      )}
    </div>
  );
}
