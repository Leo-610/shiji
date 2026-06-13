/**
 * Add reader_id column, backfill, and add unique constraint.
 * Usage: source .env.production.local && npx tsx scripts/migrate-reader-id.ts
 */
import "dotenv/config";
import { isNull } from "drizzle-orm";
import { sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { assignReaderIdIfMissing } from "@/lib/reader-id";

async function main() {
  console.log("==> Adding reader_id column if missing");
  await db.execute(
    sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS reader_id integer`
  );

  const missing = await db.query.users.findMany({
    where: isNull(users.readerId),
    columns: { id: true, email: true },
  });

  console.log(`==> Backfilling ${missing.length} users`);
  for (const user of missing) {
    const id = await assignReaderIdIfMissing(user.id);
    console.log(`  ${user.email ?? user.id} → #${id}`);
  }

  console.log("==> Adding unique constraint if missing");
  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'users_reader_id_unique'
      ) THEN
        ALTER TABLE users ADD CONSTRAINT users_reader_id_unique UNIQUE (reader_id);
      END IF;
    END $$;
  `);

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
