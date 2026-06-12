import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

function getConnectionString(): string {
  const url =
    process.env.DATABASE_URL ??
    process.env.POSTGRES_URL ??
    process.env.POSTGRES_URL_NON_POOLING;

  if (url) {
    return url;
  }

  // Next.js production build loads server modules without env vars configured.
  if (process.env.NEXT_PHASE === "phase-production-build") {
    return "postgresql://build:build@localhost:5432/build";
  }

  throw new Error(
    "DATABASE_URL is not set. Configure it in Vercel Environment Variables."
  );
}

export const db = drizzle(neon(getConnectionString()), { schema });
