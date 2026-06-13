"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { getTodayInShanghai, getYesterdayInShanghai } from "@/lib/date";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import {
  getCheckInXp,
  getLevelTitle,
  getXpProgress,
  levelFromXp,
} from "@/lib/level";

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
      },
    });
    if (!user) return null;

    const today = getTodayInShanghai();
    const level = user.level ?? 1;
    const xp = user.xp ?? 0;

    return {
      xp,
      level,
      title: getLevelTitle(level),
      progress: getXpProgress(xp, level),
      checkInStreak: user.checkInStreak ?? 0,
      checkedInToday: user.lastCheckIn === today,
      todayCheckInXp: getCheckInXp(
        user.lastCheckIn === today
          ? user.checkInStreak ?? 0
          : user.lastCheckIn === getYesterdayInShanghai()
            ? (user.checkInStreak ?? 0) + 1
            : 1
      ),
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
      },
    });

    if (!user) {
      return { error: "用户不存在" };
    }

    if (user.lastCheckIn === today) {
      return {
        error: "今日已签到",
        alreadyCheckedIn: true,
        streak: user.checkInStreak ?? 0,
      };
    }

    const streak =
      user.lastCheckIn === yesterday ? (user.checkInStreak ?? 0) + 1 : 1;
    const xpGain = getCheckInXp(streak);
    const prevLevel = user.level ?? 1;
    const newXp = (user.xp ?? 0) + xpGain;
    const newLevel = levelFromXp(newXp);

    await db
      .update(users)
      .set({
        lastCheckIn: today,
        checkInStreak: streak,
        xp: newXp,
        level: newLevel,
      })
      .where(eq(users.id, session.user.id));

    revalidatePath("/profile");
    revalidatePath("/", "layout");

    return {
      success: true,
      xpGain,
      streak,
      xp: newXp,
      level: newLevel,
      title: getLevelTitle(newLevel),
      leveledUp: newLevel > prevLevel,
    };
  } catch {
    return { error: "签到功能尚未就绪，请稍后再试" };
  }
}
