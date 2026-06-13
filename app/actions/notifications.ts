"use server";

import { revalidatePath } from "next/cache";
import { and, desc, eq, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { notifications } from "@/lib/db/schema";

export type NotificationItem = {
  id: string;
  type: string;
  threadSlug: string;
  body: string;
  actorName: string | null;
  read: boolean;
  createdAt: string;
};

export async function getUnreadNotificationCount(): Promise<number> {
  const session = await auth();
  if (!session?.user?.id) return 0;

  try {
    const row = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(notifications)
      .where(
        and(
          eq(notifications.userId, session.user.id),
          eq(notifications.read, false)
        )
      );
    return row[0]?.count ?? 0;
  } catch {
    return 0;
  }
}

export async function getRecentNotifications(limit = 12): Promise<NotificationItem[]> {
  const session = await auth();
  if (!session?.user?.id) return [];

  try {
    const rows = await db.query.notifications.findMany({
      where: eq(notifications.userId, session.user.id),
      orderBy: [desc(notifications.createdAt)],
      limit,
      columns: {
        id: true,
        type: true,
        threadSlug: true,
        body: true,
        actorName: true,
        read: true,
        createdAt: true,
      },
    });

    return rows.map((row) => ({
      id: row.id,
      type: row.type,
      threadSlug: row.threadSlug,
      body: row.body,
      actorName: row.actorName,
      read: row.read,
      createdAt: row.createdAt.toISOString(),
    }));
  } catch {
    return [];
  }
}

export async function markNotificationRead(notificationId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "请先登录" };

  try {
    await db
      .update(notifications)
      .set({ read: true })
      .where(
        and(
          eq(notifications.id, notificationId),
          eq(notifications.userId, session.user.id)
        )
      );
    revalidatePath("/", "layout");
    return { success: true };
  } catch {
    return { error: "操作失败" };
  }
}

export async function markAllNotificationsRead() {
  const session = await auth();
  if (!session?.user?.id) return { error: "请先登录" };

  try {
    await db
      .update(notifications)
      .set({ read: true })
      .where(
        and(
          eq(notifications.userId, session.user.id),
          eq(notifications.read, false)
        )
      );
    revalidatePath("/", "layout");
    return { success: true };
  } catch {
    return { error: "操作失败" };
  }
}
