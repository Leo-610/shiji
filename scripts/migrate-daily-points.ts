/**
 * Add user_daily_points table for daily point caps.
 * Usage: source .env.production.local && npx tsx scripts/migrate-daily-points.ts
 */
import "dotenv/config";
import { sql } from "drizzle-orm";
import { db } from "@/lib/db";

async function main() {
  console.log("==> Creating user_daily_points if missing");
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS user_daily_points (
      user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      date text NOT NULL,
      category text NOT NULL,
      points integer NOT NULL DEFAULT 0,
      PRIMARY KEY (user_id, date, category)
    )
  `);
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
