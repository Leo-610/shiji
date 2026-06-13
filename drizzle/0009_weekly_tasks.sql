CREATE TABLE IF NOT EXISTS "user_weekly_tasks" (
	"user_id" uuid NOT NULL,
	"week_start" text NOT NULL,
	"task_id" text NOT NULL,
	"progress" integer DEFAULT 0 NOT NULL,
	"completed_at" timestamp,
	CONSTRAINT "user_weekly_tasks_user_id_week_start_task_id_pk" PRIMARY KEY("user_id","week_start","task_id")
);
ALTER TABLE "user_weekly_tasks" ADD CONSTRAINT "user_weekly_tasks_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
