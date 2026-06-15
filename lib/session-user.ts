import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import type { UserRole } from "@/lib/roles";

/** Session user with points/level refreshed from DB (JWT cookie can be stale). */
export async function getLayoutUser() {
  const session = await auth();
  if (!session?.user?.id) return null;

  try {
    const fresh = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
      columns: {
        name: true,
        image: true,
        role: true,
        level: true,
        points: true,
        equippedAvatarFrame: true,
        equippedTitleBadge: true,
      },
    });
    if (!fresh) return session.user;

    return {
      ...session.user,
      name: fresh.name,
      image: fresh.image,
      role: (fresh.role as UserRole | undefined) ?? session.user.role,
      level: fresh.level ?? session.user.level,
      points: fresh.points ?? 0,
      equippedAvatarFrame: fresh.equippedAvatarFrame,
      equippedTitleBadge: fresh.equippedTitleBadge,
    };
  } catch {
    return session.user;
  }
}
