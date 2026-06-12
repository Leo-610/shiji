import { and, count, eq, gte } from "drizzle-orm";
import { db } from "@/lib/db";
import { rateLimitEvents } from "@/lib/db/schema";
import { getClientIp } from "@/lib/request";

const HOUR_MS = 60 * 60 * 1000;

const LIMITS = {
  email_signin: { limit: 5, windowMs: HOUR_MS },
  create_thread: { limit: 5, windowMs: HOUR_MS },
  create_comment: { limit: 30, windowMs: HOUR_MS },
} as const;

type RateLimitScope = keyof typeof LIMITS;

function buildKey(scope: RateLimitScope, identifier: string) {
  return `${scope}:${identifier}`;
}

async function countRecent(key: string, windowMs: number) {
  const since = new Date(Date.now() - windowMs);
  const [row] = await db
    .select({ value: count() })
    .from(rateLimitEvents)
    .where(and(eq(rateLimitEvents.key, key), gte(rateLimitEvents.createdAt, since)));

  return row?.value ?? 0;
}

async function recordEvent(key: string) {
  await db.insert(rateLimitEvents).values({ key });
}

export async function checkRateLimit(
  scope: RateLimitScope,
  identifier: string
): Promise<{ allowed: true } | { allowed: false; error: string }> {
  const { limit, windowMs } = LIMITS[scope];
  const key = buildKey(scope, identifier);
  const recent = await countRecent(key, windowMs);

  if (recent >= limit) {
    const messages: Record<RateLimitScope, string> = {
      email_signin: "发送过于频繁，请一小时后再试",
      create_thread: "发帖过于频繁，请稍后再试",
      create_comment: "评论过于频繁，请稍后再试",
    };
    return { allowed: false, error: messages[scope] };
  }

  await recordEvent(key);
  return { allowed: true };
}

export async function rateLimitForUserOrIp(
  scope: "create_thread" | "create_comment",
  userId?: string | null
) {
  const ip = await getClientIp();
  const identifier = userId ? `user:${userId}` : `ip:${ip}`;
  return checkRateLimit(scope, identifier);
}

export async function rateLimitEmailSignIn() {
  const ip = await getClientIp();
  return checkRateLimit("email_signin", `ip:${ip}`);
}
