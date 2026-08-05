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

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session)
    return Response.json({ message: "Unauthorized" }, { status: 401 });

  const value = new URL(request.url).searchParams.get("limit");
  const limit = value
    ? z.coerce.number().int().min(1).max(20).safeParse(value)
    : null;

  if (limit && !limit.success)
    return Response.json({ message: "Invalid limit" }, { status: 400 });

  const query = db
    .select({
      exerciseCount: count(workoutExercises.id),
      id: workouts.id,
      image: workouts.image,
      // Combine the workout's unique muscle labels into one string.
      muscles: sql<string>`coalesce(string_agg(distinct ${exerciseTable.muscles}, ' • '), '')`,
      name: workouts.name,
      // Add every exercise's planned sets; an empty workout returns 0.
      totalSets: sql<number>`coalesce(sum(${workoutExercises.sets}), 0)::int`,
    })
    .from(workouts)
    .leftJoin(workoutExercises, eq(workoutExercises.workoutId, workouts.id))
    .leftJoin(exerciseTable, eq(exerciseTable.id, workoutExercises.exerciseId))
    .where(
      and(eq(workouts.userId, session.user.id), eq(workouts.isTemplate, false)),
    )
    .groupBy(workouts.id)
    .orderBy(desc(workouts.createdAt));

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
