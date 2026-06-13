"use client";

import { useState } from "react";
import { CalendarCheck, Sparkles } from "lucide-react";
import { dailyCheckIn } from "@/app/actions/level";
import { Button } from "@/components/ui/button";
import {
  FortuneCard,
  type FortuneCardData,
} from "@/components/user/FortuneCard";

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

    const result = await dailyCheckIn();
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
        setTimeout(() => setRevealFortune(true), 120);
      }
      setMessage(
        `签到成功 +${result.xpGain} 经验${result.leveledUp ? ` · 升级至 Lv.${result.level}` : ""}`
      );
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 flex-wrap">
        <Button
          type="button"
          size="lg"
          disabled={done || loading}
          onClick={handleCheckIn}
          className="font-orbitron gap-2"
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
          className={`text-sm ${done && !message.includes("已签到") ? "text-theme-accent" : "text-theme-muted"}`}
        >
          {message}
        </p>
      )}

      {fortune && revealFortune && <FortuneCard fortune={fortune} revealed />}
    </div>
  );
}
