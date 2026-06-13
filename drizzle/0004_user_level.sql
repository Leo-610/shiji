ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "xp" integer DEFAULT 0 NOT NULL;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "level" integer DEFAULT 1 NOT NULL;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "last_check_in" text;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "check_in_streak" integer DEFAULT 0 NOT NULL;
ALTER TABLE "threads" ADD COLUMN IF NOT EXISTS "view_count" integer DEFAULT 0 NOT NULL;
CREATE TABLE IF NOT EXISTS "thread_views" (
	"user_id" uuid NOT NULL,
	"thread_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "thread_views_user_id_thread_id_pk" PRIMARY KEY("user_id","thread_id")
);
ALTER TABLE "thread_views" ADD CONSTRAINT "thread_views_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
ALTER TABLE "thread_views" ADD CONSTRAINT "thread_views_thread_id_threads_id_fk" FOREIGN KEY ("thread_id") REFERENCES "public"."threads"("id") ON DELETE cascade ON UPDATE no action;
