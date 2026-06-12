import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { categories } from "../lib/db/schema";

const seedCategories = [
  { name: "世界观设定", slug: "worldbuilding", sortOrder: 1 },
  { name: "第一章", slug: "chapter-1", sortOrder: 2 },
  { name: "第二章", slug: "chapter-2", sortOrder: 3 },
  { name: "角色讨论", slug: "characters", sortOrder: 4 },
  { name: "剧情走向", slug: "plot", sortOrder: 5 },
  { name: "写作建议", slug: "writing-feedback", sortOrder: 6 },
];

async function seed() {
  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL is not set");
    process.exit(1);
  }

  const sql = neon(process.env.DATABASE_URL);
  const db = drizzle(sql);

  console.log("Seeding categories...");
  for (const cat of seedCategories) {
    await db
      .insert(categories)
      .values(cat)
      .onConflictDoNothing({ target: categories.slug });
  }

  console.log("Seed complete!");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
