/**
 * Backfill reader_id for users created before the reader ID feature.
 * Usage: export DATABASE_URL=... && npx tsx scripts/backfill-reader-ids.ts
 */
import "dotenv/config";
import { isNull } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { assignReaderIdIfMissing } from "@/lib/reader-id";

async function main() {
  const missing = await db.query.users.findMany({
    where: isNull(users.readerId),
    columns: { id: true, email: true },
  });

  console.log(`Found ${missing.length} users without reader_id`);

  for (const user of missing) {
    const id = await assignReaderIdIfMissing(user.id);
    console.log(`  ${user.email ?? user.id} → #${id}`);
  }

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
