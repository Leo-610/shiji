ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "points" integer DEFAULT 0 NOT NULL;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "equipped_avatar_frame" text;
ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "equipped_title_badge" text;
CREATE TABLE IF NOT EXISTS "user_shop_items" (
	"user_id" uuid NOT NULL,
	"item_slug" text NOT NULL,
	"purchased_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_shop_items_user_id_item_slug_pk" PRIMARY KEY("user_id","item_slug")
);
ALTER TABLE "user_shop_items" ADD CONSTRAINT "user_shop_items_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
