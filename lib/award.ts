import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

export async function awardPoints(userId: string, amount: number) {
  if (amount <= 0) return null;

  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: { points: true },
    });
    if (!user) return null;

    const newPoints = (user.points ?? 0) + amount;
    await db
      .update(users)
      .set({ points: newPoints })
      .where(eq(users.id, userId));

    return { points: newPoints, gained: amount };
  } catch {
    return null;
  }
}
