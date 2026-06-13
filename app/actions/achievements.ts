"use server";

import { auth } from "@/lib/auth";
import { getAchievementBoard } from "@/lib/achievements";

export async function getMyAchievements() {
  const session = await auth();
  if (!session?.user?.id) return null;

  try {
    const items = await getAchievementBoard(session.user.id);
    const unlocked = items.filter((i) => i.unlocked).length;
    return {
      items,
      unlocked,
      total: items.length,
    };
  } catch {
    return null;
  }
}
