CREATE TABLE IF NOT EXISTS "leaderboard_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"create_ts" timestamp DEFAULT now() NOT NULL,
	"user_id" text NOT NULL,
	"score" integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE "users_table" DROP CONSTRAINT "users_table_email_unique";--> statement-breakpoint
ALTER TABLE "users_table" ADD COLUMN "user_id" text PRIMARY KEY NOT NULL;--> statement-breakpoint
ALTER TABLE "users_table" ADD COLUMN "create_ts" timestamp DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "users_table" ADD COLUMN "streak" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "leaderboard_table" ADD CONSTRAINT "leaderboard_table_user_id_users_table_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users_table"("user_id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "users_table" DROP COLUMN IF EXISTS "id";--> statement-breakpoint
ALTER TABLE "users_table" DROP COLUMN IF EXISTS "age";--> statement-breakpoint
ALTER TABLE "users_table" DROP COLUMN IF EXISTS "email";