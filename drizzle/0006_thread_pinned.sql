ALTER TABLE "threads" ADD COLUMN IF NOT EXISTS "pinned" boolean DEFAULT false NOT NULL;
ALTER TABLE "threads" ADD COLUMN IF NOT EXISTS "pinned_at" timestamp;
