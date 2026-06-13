"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { getTodayInShanghai, getYesterdayInShanghai } from "@/lib/date";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import {
  getFortuneById,
  pickDailyFortune,
  serializeFortune,
} from "@/lib/fortunes";
import {
  getCheckInXp,
  getLevelTitle,
  getXpProgress,
  levelFromXp,
} from "@/lib/level";
import { getCheckInPoints } from "@/lib/points";

export async function getMyLevelProfile() {
  const session = await auth();
  if (!session?.user?.id) return null;

  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
      columns: {
        xp: true,
        level: true,
        lastCheckIn: true,
        checkInStreak: true,
        dailyFortuneId: true,
        points: true,
      },
    });
    if (!user) return null;

    const today = getTodayInShanghai();
    const level = user.level ?? 1;
    const xp = user.xp ?? 0;
    const checkedInToday = user.lastCheckIn === today;
    let fortuneId = user.dailyFortuneId;

    if (checkedInToday && !fortuneId) {
      const backfill = pickDailyFortune(session.user.id, today);
      fortuneId = backfill.id;
      await db
        .update(users)
        .set({ dailyFortuneId: backfill.id })
        .where(eq(users.id, session.user.id));
    }

    const fortune =
      checkedInToday && fortuneId ? getFortuneById(fortuneId) : null;

    return {
      xp,
      level,
      title: getLevelTitle(level),
      progress: getXpProgress(xp, level),
      checkInStreak: user.checkInStreak ?? 0,
      checkedInToday,
      todayCheckInXp: getCheckInXp(
        checkedInToday
          ? user.checkInStreak ?? 0
          : user.lastCheckIn === getYesterdayInShanghai()
            ? (user.checkInStreak ?? 0) + 1
            : 1
      ),
      dailyFortune: fortune ? serializeFortune(fortune) : null,
      points: user.points ?? 0,
    };
  } catch {
    return null;
  }
}

export async function dailyCheckIn() {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: "请先登录后签到" };
  }

  const today = getTodayInShanghai();
  const yesterday = getYesterdayInShanghai();

  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
      columns: {
        xp: true,
        level: true,
        lastCheckIn: true,
        checkInStreak: true,
        dailyFortuneId: true,
        points: true,
      },
    });

    if (!user) {
      return { error: "用户不存在" };
    }

    if (user.lastCheckIn === today) {
      const fortune = getFortuneById(user.dailyFortuneId);
      return {
        error: "今日已签到",
        alreadyCheckedIn: true,
        streak: user.checkInStreak ?? 0,
        fortune: fortune ? serializeFortune(fortune) : null,
      };
    }

    const streak =
      user.lastCheckIn === yesterday ? (user.checkInStreak ?? 0) + 1 : 1;
    const xpGain = getCheckInXp(streak);
    const pointsGain = getCheckInPoints(streak);
    const prevLevel = user.level ?? 1;
    const newXp = (user.xp ?? 0) + xpGain;
    const newLevel = levelFromXp(newXp);
    const newPoints = (user.points ?? 0) + pointsGain;
    const fortune = pickDailyFortune(session.user.id, today);

    await db
      .update(users)
      .set({
        lastCheckIn: today,
        checkInStreak: streak,
        xp: newXp,
        level: newLevel,
        points: newPoints,
        dailyFortuneId: fortune.id,
      })
      .where(eq(users.id, session.user.id));

    revalidatePath("/profile");
    revalidatePath("/shop");
    revalidatePath("/", "layout");

    return {
      success: true,
      xpGain,
      pointsGain,
      streak,
      xp: newXp,
      points: newPoints,
      level: newLevel,
      title: getLevelTitle(newLevel),
      leveledUp: newLevel > prevLevel,
      fortune: serializeFortune(fortune),
    };
  } catch {
    return { error: "签到功能尚未就绪，请稍后再试" };
  }
}
