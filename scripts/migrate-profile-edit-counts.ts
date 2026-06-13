/**
 * Add name_change_count and avatar_change_count columns.
 * Usage: npx tsx scripts/migrate-profile-edit-counts.ts
 */
import "dotenv/config";
import { sql } from "drizzle-orm";
import { db } from "@/lib/db";

async function main() {
  console.log("==> Adding profile edit count columns if missing");
  await db.execute(sql`
    ALTER TABLE users
    ADD COLUMN IF NOT EXISTS name_change_count integer NOT NULL DEFAULT 0
  `);
  await db.execute(sql`
    ALTER TABLE users
    ADD COLUMN IF NOT EXISTS avatar_change_count integer NOT NULL DEFAULT 0
  `);
  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
