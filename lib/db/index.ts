import { neon } from "@neondatabase/serverless";
import { drizzle, type NeonHttpDatabase } from "drizzle-orm/neon-http";
import * as schema from "./schema";

type Db = NeonHttpDatabase<typeof schema>;

let _db: Db | undefined;

function getDb(): Db {
  if (!_db) {
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error(
        "DATABASE_URL is not set. Configure it in Vercel Environment Variables."
      );
    }
    _db = drizzle(neon(url), { schema });
  }
  return _db;
}

export const db = new Proxy({} as Db, {
  get(_target, prop) {
    const instance = getDb();
    const value = instance[prop as keyof Db];
    if (typeof value === "function") {
      return (value as (...args: unknown[]) => unknown).bind(instance);
    }
    return value;
  },
});
