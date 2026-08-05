ALTER TABLE "exercises" ALTER COLUMN "id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "exercises" ALTER COLUMN "id" SET DEFAULT gen_random_uuid();--> statement-breakpoint
ALTER TABLE "exercises" ALTER COLUMN "equipment" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "exercises" ALTER COLUMN "force_type" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "exercises" ALTER COLUMN "mechanics" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "workout_exercises" ALTER COLUMN "exercise_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "workout_session_sets" ALTER COLUMN "exercise_id" SET DATA TYPE uuid;--> statement-breakpoint
ALTER TABLE "exercises" ADD COLUMN "slug" text NOT NULL;--> statement-breakpoint
ALTER TABLE "exercises" ADD COLUMN "category" text NOT NULL;--> statement-breakpoint
ALTER TABLE "exercises" DROP COLUMN "instructions";--> statement-breakpoint
ALTER TABLE "exercises" ADD CONSTRAINT "exercises_slug_unique" UNIQUE("slug");