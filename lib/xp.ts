import { eq, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { threads, threadViews, users } from "@/lib/db/schema";
import { levelFromXp, XP_REWARDS } from "@/lib/level";

export async function awardXp(userId: string, amount: number) {
  if (amount <= 0) return null;

  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: { xp: true, level: true },
    });
    if (!user) return null;

    const prevLevel = user.level ?? 1;
    const newXp = (user.xp ?? 0) + amount;
    const newLevel = levelFromXp(newXp);

    await db
      .update(users)
      .set({ xp: newXp, level: newLevel })
      .where(eq(users.id, userId));

    return {
      xp: newXp,
      level: newLevel,
      gained: amount,
      leveledUp: newLevel > prevLevel,
    };
  } catch {
    return null;
  }
}

export async function recordThreadView(threadId: string, authorId: string | null) {
  const session = await auth();
  const viewerId = session?.user?.id;
  if (!viewerId) return;

  if (authorId && authorId === viewerId) return;

  try {
    const inserted = await db
      .insert(threadViews)
      .values({ userId: viewerId, threadId })
      .onConflictDoNothing()
      .returning({ userId: threadViews.userId });

    if (inserted.length === 0) return;

    await db
      .update(threads)
      .set({ viewCount: sql`${threads.viewCount} + 1` })
      .where(eq(threads.id, threadId));

    if (authorId) {
      await awardXp(authorId, XP_REWARDS.threadViewReceived);
    }
  } catch {
    // tables may be missing until migration
  }
}
