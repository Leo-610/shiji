import { defineConfig } from "drizzle-kit";
import { getDatabaseUrl } from "./lib/load-env";

export default defineConfig({
  schema: "./lib/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: getDatabaseUrl(),
  },
});
