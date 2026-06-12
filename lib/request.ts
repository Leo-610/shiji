import { headers } from "next/headers";

export async function getClientIp(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) {
    const ip = forwarded.split(",")[0]?.trim();
    if (ip) return ip;
  }

  const realIp = h.get("x-real-ip") ?? h.get("cf-connecting-ip");
  if (realIp) return realIp;

  return "unknown";
}
