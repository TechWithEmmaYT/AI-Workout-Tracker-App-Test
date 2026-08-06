import { and, count, desc, eq, sql } from "drizzle-orm";
import { z } from "zod";

import {
  db,
  exercises as exerciseTable,
  workoutExercises,
  workouts,
} from "@/db";
import { auth } from "@/lib/auth";
import { uploadImage } from "@/lib/imagekit";

const workoutSchema = z.object({
  description: z.string().trim().max(500).optional(),
  exercises: z
    .array(
      z.object({
        id: z.uuid(),
        reps: z.number().int().min(1).max(100),
        rest: z.number().int().min(0).max(600),
        sets: z.number().int().min(1).max(20),
        targetWeight: z.number().min(0).optional(),
      }),
    )
    .min(1)
    .max(10),
  image: z.string().min(100).max(12_000_000).nullable().optional(),
  name: z.string().trim().min(1).max(80),
});

// Route handler for GET /api/workouts (list the current user's workouts)
export async function GET(request: Request) {
  // Look up the logged-in user's session from the request's auth cookies/headers
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session)
    // If there is no session, reject with 401 Unauthorized
    return Response.json({ message: "Unauthorized" }, { status: 401 });

  // Read the optional "?limit=" query param from the URL
  const value = new URL(request.url).searchParams.get("limit");
  // Validate it as an integer between 1 and 20; if missing, limit is null (fetch all)
  const limit = value
    ? z.coerce.number().int().min(1).max(20).safeParse(value)
    : null;

  // If a limit was provided but it's invalid, reject with 400
  if (limit && !limit.success)
    return Response.json({ message: "Invalid limit" }, { status: 400 });

  // Build the SELECT query that returns one row per workout with aggregate stats
  const query = db
    .select({
      exerciseCount: count(workoutExercises.id), // number of exercises in the workout
      id: workouts.id, // workout id (UUID)
      image: workouts.image, // cover image URL (may be null)
      // Combine the workout's unique muscle labels into one string.
      muscles: sql<string>`coalesce(string_agg(distinct ${exerciseTable.muscles}, ' • '), '')`,
      name: workouts.name, // workout name, e.g. "Push Day"
      // Add every exercise's planned sets; an empty workout returns 0.
      totalSets: sql<number>`coalesce(sum(${workoutExercises.sets}), 0)::int`,
    })
    .from(workouts) // from the workouts table
    .leftJoin(workoutExercises, eq(workoutExercises.workoutId, workouts.id)) // join the exercises link table (left join keeps workouts with no exercises)
    .leftJoin(exerciseTable, eq(exerciseTable.id, workoutExercises.exerciseId)) // join the exercises table for muscle names (left join keeps workouts with no exercises)
    .where(
      and(
        eq(workouts.userId, session.user.id), // only the logged-in user's workouts
        eq(workouts.isTemplate, false), // exclude templates (only show real workouts)
      ),
    )
    .groupBy(workouts.id) // collapse the joins into one row per workout so the aggregates work
    .orderBy(desc(workouts.createdAt)); // newest workouts first

  // Execute the query, applying the limit only if a valid one was provided
  return Response.json(
    limit?.success ? await query.limit(limit.data) : await query,
  );
}

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session)
    return Response.json({ message: "Unauthorized" }, { status: 401 });

  const result = workoutSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!result.success)
    return Response.json({ message: "Invalid workout" }, { status: 400 });

  const { description, exercises, image, name } = result.data;
  if (new Set(exercises.map(({ id }) => id)).size !== exercises.length)
    return Response.json({ message: "Duplicate exercise" }, { status: 400 });

  const imageUrl = image
    ? await uploadImage(image, `workout-${session.user.id}-${Date.now()}.jpg`)
    : null;

  const workoutId = crypto.randomUUID();
  const [created] = await db.batch([
    db
      .insert(workouts)
      .values({
        description: description || null,
        id: workoutId,
        image: imageUrl,
        name,
        userId: session.user.id,
      })
      .returning(),
    db.insert(workoutExercises).values(
      exercises.map((exercise, position) => ({
        exerciseId: exercise.id,
        position,
        reps: exercise.reps,
        restSeconds: exercise.rest,
        sets: exercise.sets,
        targetWeight: exercise.targetWeight,
        workoutId,
      })),
    ),
  ]);

  return Response.json(created[0], { status: 201 });
}
