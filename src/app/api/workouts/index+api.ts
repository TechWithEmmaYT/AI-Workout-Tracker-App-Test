import { z } from "zod";

import { db, workoutExercises, workouts } from "@/db";
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
