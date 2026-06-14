/**
 * Add github_login; keep super_admin only on site owner GitHub account.
 * Usage: npx tsx scripts/migrate-github-login.ts
 */
import "dotenv/config";
import { sql } from "drizzle-orm";
import { db } from "@/lib/db";
import { getOwnerGitHubUsername } from "@/lib/roles";

async function main() {
  const ownerLogin = getOwnerGitHubUsername();
  console.log("==> Adding github_login column if missing");
  await db.execute(sql`
    ALTER TABLE users
    ADD COLUMN IF NOT EXISTS github_login text
  `);

  console.log(`==> Tagging existing super_admin rows as GitHub ${ownerLogin}`);
  await db.execute(sql`
    UPDATE users
    SET github_login = ${ownerLogin}
    WHERE role = 'super_admin' AND github_login IS NULL
  `);

  console.log("==> Clearing super_admin from all accounts");
  await db.execute(sql`
    UPDATE users SET role = 'user' WHERE role = 'super_admin'
  `);

  console.log(`==> Granting super_admin only to GitHub ${ownerLogin}`);
  await db.execute(sql`
    UPDATE users
    SET role = 'super_admin'
    WHERE github_login ILIKE ${ownerLogin}
  `);

  console.log("Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
