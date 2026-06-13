"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Coins, Gift, Loader2, Sparkles, Ticket } from "lucide-react";
import {
  spinWheel,
  type WheelPageData,
  type WheelPaymentMethod,
  type WheelPrizeResult,
} from "@/app/actions/wheel";
import { NeonCard } from "@/components/cyber/NeonCard";
import { Button } from "@/components/ui/button";
import {
  WHEEL_SEGMENT_ANGLE,
  WHEEL_SEGMENT_COUNT,
} from "@/lib/wheel";
import { cn } from "@/lib/utils";

interface WheelLotteryProps {
  initialData: WheelPageData;
}

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
    const segmentCenter = prizeIndex * WHEEL_SEGMENT_ANGLE + WHEEL_SEGMENT_ANGLE / 2;
    const currentMod = rotation % 360;
    const delta = extra * 360 + (360 - segmentCenter) - currentMod;
    setRotation(rotation + delta);

    window.setTimeout(() => {
      setSpinning(false);
      setPoints(spinResult.points ?? points);
      setTickets(spinResult.wheelTickets ?? tickets);
      if (spinResult.wheelLuck !== undefined) setLuck(spinResult.wheelLuck);
      if (spinResult.legendShards !== undefined) setShards(spinResult.legendShards);
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

  const conic = initialData.prizes
    .map((p, i) => {
      const start = i * WHEEL_SEGMENT_ANGLE;
      return `${p.color} ${start}deg ${start + WHEEL_SEGMENT_ANGLE}deg`;
    })
    .join(", ");

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm">
        <span className="flex items-center gap-1.5 text-theme-muted">
          <Coins className="size-4 text-theme-accent" />
          <span className="font-orbitron text-theme-heading">{points}</span>
          积分
        </span>
        <span className="flex items-center gap-1.5 text-theme-muted">
          <Ticket className="size-4 text-theme-accent-secondary" />
          <span className="font-orbitron text-theme-heading">{tickets}</span>
          代积分券
        </span>
        <span className="flex items-center gap-1.5 text-theme-muted">
          <Sparkles className="size-4 text-amber-400" />
          <span className="font-orbitron text-theme-heading">{luck}</span>
          幸运值
        </span>
      </div>

      <NeonCard className="p-4 space-y-3">
        <div className="flex justify-between text-xs text-theme-muted">
          <span>传说碎片 {shards}/{initialData.shardGoal}</span>
          <span>终极大奖约 {ultimateChance}</span>
        </div>
        <div className="weekly-task-progress-track h-2">
          <div
            className="weekly-task-progress-fill"
            style={{ width: `${shardPercent}%` }}
          />
        </div>
        <p className="text-[11px] text-theme-muted leading-relaxed">
          幸运值 +{luckSummary.rareBoostPercent}% 稀有概率 · 碎片 +{luckSummary.shardBoostPercent}% · 终奖保底 +{luckSummary.ultimatePityBonus}
        </p>
      </NeonCard>

      <div className="flex justify-center gap-2 flex-wrap">
        <Button
          type="button"
          size="sm"
          variant={payment === "free" ? "default" : "outline"}
          disabled={!freeSpinAvailable}
          onClick={() => setPayment("free")}
        >
          每日免费
        </Button>
        <Button
          type="button"
          size="sm"
          variant={payment === "points" ? "default" : "outline"}
          onClick={() => setPayment("points")}
        >
          {initialData.spinPointCost} 积分
        </Button>
        <Button
          type="button"
          size="sm"
          variant={payment === "ticket" ? "default" : "outline"}
          onClick={() => setPayment("ticket")}
        >
          代积分券 ×1
        </Button>
      </div>

      <div className="relative mx-auto w-full max-w-[min(100%,340px)]">
        <div className="wheel-pointer" aria-hidden />
        <div
          className={cn(
            "wheel-rotor mx-auto aspect-square w-full rounded-full border-2 border-[color:var(--app-accent)]/40 shadow-[0_0_40px_rgba(0,240,255,0.15)]",
            spinning && "wheel-rotor-spinning"
          )}
          style={{
            background: `conic-gradient(from -90deg, ${conic})`,
            transform: `rotate(${rotation}deg)`,
            transition: spinning
              ? "transform 4.2s cubic-bezier(0.2, 0.8, 0.2, 1)"
              : "none",
          }}
        >
          {initialData.prizes.map((prize, i) => (
            <span
              key={prize.id}
              className="wheel-segment-label wheel-segment-label-dense"
              style={{
                transform: `rotate(${i * WHEEL_SEGMENT_ANGLE + WHEEL_SEGMENT_ANGLE / 2}deg)`,
              }}
            >
              {prize.shortLabel}
            </span>
          ))}
        </div>
        <div className="wheel-center-cap">
          <Gift className="size-6 text-theme-accent" />
        </div>
      </div>

      <p className="text-center text-[11px] text-theme-muted">
        {WHEEL_SEGMENT_COUNT} 格奖池 · 大量虚空余烬与低积分 · 传说永久极难获得
      </p>

      <div className="flex justify-center">
        <Button
          size="lg"
          disabled={spinning || !canSpin}
          onClick={handleSpin}
          className="min-w-[10rem] font-orbitron tracking-wide"
        >
          {spinning ? (
            <>
              <Loader2 className="size-4 animate-spin mr-2" />
              转动中…
            </>
          ) : (
            "开始抽奖"
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
            {result.type === "nothing" ? "抽奖结果" : result.isGrand ? "传说降临" : "恭喜获得"}
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
