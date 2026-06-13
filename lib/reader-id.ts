import { and, eq, isNull, max, ne, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

const READER_ID_START = 10001;

export function formatReaderId(readerId: number | null | undefined): string {
  if (!readerId) return "";
  return `#${readerId}`;
}

/** Assign a permanent numeric reader ID (starts at 10001). */
export async function assignReaderIdIfMissing(userId: string): Promise<number | null> {
  const existing = await db.query.users.findFirst({
    where: eq(users.id, userId),
    columns: { readerId: true },
  });
  if (existing?.readerId) return existing.readerId;

  for (let attempt = 0; attempt < 5; attempt++) {
    const [row] = await db.select({ maxId: max(users.readerId) }).from(users);
    const nextId = Math.max(row?.maxId ?? 0, READER_ID_START - 1) + 1;

    try {
      await db
        .update(users)
        .set({ readerId: nextId })
        .where(and(eq(users.id, userId), isNull(users.readerId)));

      const updated = await db.query.users.findFirst({
        where: eq(users.id, userId),
        columns: { readerId: true },
      });
      if (updated?.readerId) return updated.readerId;
    } catch {
      // unique conflict — retry with a higher id
    }
  }

  return null;
}

export async function isNicknameTaken(
  name: string,
  excludeUserId?: string
): Promise<boolean> {
  const normalized = name.trim().toLowerCase();
  if (!normalized) return false;

  const conditions = [
    sql`lower(trim(${users.name})) = ${normalized}`,
    sql`${users.name} is not null`,
  ];
  if (excludeUserId) {
    conditions.push(ne(users.id, excludeUserId));
  }

  const row = await db.query.users.findFirst({
    where: and(...conditions),
    columns: { id: true },
  });

  return !!row;
}
