"use client";

import { useState } from "react";
import { CalendarCheck, Sparkles } from "lucide-react";
import { dailyCheckIn } from "@/app/actions/level";
import { Button } from "@/components/ui/button";
import {
  FortuneCard,
  type FortuneCardData,
} from "@/components/user/FortuneCard";
import {
  FortuneGachaAltar,
  FortuneGachaRitual,
} from "@/components/user/FortuneGachaStage";
import { cn } from "@/lib/utils";

interface CheckInButtonProps {
  checkedInToday: boolean;
  streak: number;
  todayXp: number;
  initialFortune?: FortuneCardData | null;
}

export function CheckInButton({
  checkedInToday,
  streak,
  todayXp,
  initialFortune = null,
}: CheckInButtonProps) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(checkedInToday);
  const [currentStreak, setCurrentStreak] = useState(streak);
  const [message, setMessage] = useState<string | null>(null);
  const [fortune, setFortune] = useState<FortuneCardData | null>(
    initialFortune
  );
  const [revealFortune, setRevealFortune] = useState(
    checkedInToday && initialFortune !== null
  );

  async function handleCheckIn() {
    if (done || loading) return;
    setLoading(true);
    setMessage(null);
    setRevealFortune(false);

    const ritualStart = Date.now();
    const result = await dailyCheckIn();
    const ritualRemaining = 1600 - (Date.now() - ritualStart);
    if (ritualRemaining > 0) {
      await new Promise((r) => setTimeout(r, ritualRemaining));
    }

    setLoading(false);

    if (result.error) {
      if (result.alreadyCheckedIn) {
        setDone(true);
        setCurrentStreak(result.streak ?? currentStreak);
        if (result.fortune) {
          setFortune(result.fortune);
          setRevealFortune(true);
        }
      }
      setMessage(result.error);
      return;
    }

    if (result.success) {
      setDone(true);
      setCurrentStreak(result.streak ?? currentStreak);
      if (result.fortune) {
        setFortune(result.fortune);
        window.setTimeout(() => setRevealFortune(true), 200);
      }
      setMessage(
        `签到成功 +${result.xpGain} 经验 · +${result.pointsGain ?? 0} 积分${result.leveledUp ? ` · 升级至 Lv.${result.level}` : ""}${
          result.wheelTicketGain
            ? ` · 至尊大吉 +${result.wheelTicketGain} 代积分券`
            : ""
        }${
          result.weeklyRewards?.length
            ? ` · 周任务「${result.weeklyRewards[0].name}」+${result.weeklyRewards[0].points}`
            : ""
        }`
      );
    }
  }

  const showAltar = !done && !loading && !revealFortune;
  const showCard = fortune !== null;

  return (
    <div className="fortune-gacha-panel space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <Button
          type="button"
          size="lg"
          disabled={done || loading}
          onClick={handleCheckIn}
          className="font-orbitron gap-2 shadow-[0_0_20px_rgba(0,240,255,0.15)]"
        >
          <CalendarCheck className="size-4" />
          {done ? "今日已签到" : loading ? "抽卡中…" : "签到抽卡"}
        </Button>
        <span className="text-sm text-theme-muted flex items-center gap-1">
          <Sparkles className="size-3.5 text-theme-accent" />
          连续 {currentStreak} 天
          {!done && ` · 今日可得 ${todayXp} 经验 + 运势签`}
        </span>
      </div>

      {message && (
        <p
          className={cn(
            "text-sm",
            done && !message.includes("已签到")
              ? "text-theme-accent"
              : "text-theme-muted"
          )}
        >
          {message}
        </p>
      )}

      <div className="fortune-gacha-stage">
        {showAltar && <FortuneGachaAltar />}
        <FortuneGachaRitual active={loading} />
        {showCard && (
          <div
            className={cn(
              loading && "opacity-0 pointer-events-none absolute inset-0"
            )}
          >
            <FortuneCard
              fortune={fortune}
              revealed={revealFortune && !loading}
            />
          </div>
        )}
      </div>
    </div>
  );
}
