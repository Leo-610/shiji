/**
 * Wheel lottery + shop item expiry migrations.
 * Usage: npx tsx scripts/migrate-wheel.ts
 */
import "dotenv/config";
import { sql } from "drizzle-orm";
import { db } from "@/lib/db";

async function main() {
  console.log("==> Adding wheel_tickets column if missing");
  await db.execute(sql`
    ALTER TABLE users
    ADD COLUMN IF NOT EXISTS wheel_tickets integer NOT NULL DEFAULT 0
  `);

  console.log("==> Adding wheel_luck and legend_shards columns if missing");
  await db.execute(sql`
    ALTER TABLE users
    ADD COLUMN IF NOT EXISTS wheel_luck integer NOT NULL DEFAULT 0
  `);
  await db.execute(sql`
    ALTER TABLE users
    ADD COLUMN IF NOT EXISTS legend_shards integer NOT NULL DEFAULT 0
  `);

  console.log("==> Adding last_free_wheel_date column if missing");
  await db.execute(sql`
    ALTER TABLE users
    ADD COLUMN IF NOT EXISTS last_free_wheel_date text
  `);

  console.log("==> Creating user_item_grants if missing");
  await db.execute(sql`
    CREATE TABLE IF NOT EXISTS user_item_grants (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      item_slug text NOT NULL,
      source text NOT NULL DEFAULT 'wheel',
      granted_at timestamp NOT NULL DEFAULT now(),
      expires_at timestamp NOT NULL
    )
  `);

  console.log("==> Adding expires_at to user_shop_items if missing");
  await db.execute(sql`
    ALTER TABLE user_shop_items
    ADD COLUMN IF NOT EXISTS expires_at timestamp
  `);

  console.log("==> Backfill shop item expiry (6 months from now for legacy rows)");
  await db.execute(sql`
    UPDATE user_shop_items
    SET expires_at = now() + interval '180 days'
    WHERE expires_at IS NULL
  `);

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
