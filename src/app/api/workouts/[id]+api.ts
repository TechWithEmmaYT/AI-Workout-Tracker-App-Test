import { and, asc, eq } from "drizzle-orm"; // and: combine WHERE conditions, asc: order by ascending, eq: equality check
import { z } from "zod"; // runtime validation library

// Database tables + drizzle query builder (same import style as index+api.ts)
import {
  db,
  exercises as exerciseTable,
  workoutExercises,
  workouts,
} from "@/db";
import { auth } from "@/lib/auth";

const idSchema = z.uuid();

export async function GET(request: Request, { id }: Record<string, string>) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session)
    return Response.json({ message: "Unauthorized" }, { status: 401 });

  // Reject non-UUID ids so invalid input never reaches the database
  if (!idSchema.safeParse(id).success)
    return Response.json({ message: "Workout not found" }, { status: 404 });

  // Run two queries in ONE round trip to the database
  // (faster than two separate calls)
  const [workoutRows, exerciseRows] = await db.batch([
    // Query 1: fetch the workout's own fields
    db
      .select({
        description: workouts.description,
        id: workouts.id,
        image: workouts.image,
        name: workouts.name,
      })
      .from(workouts) // from the workouts table
      .where(
        and(
          eq(workouts.id, id), // the workout must match the id from the URL
          eq(workouts.userId, session.user.id),
        ),
      )
      .limit(1), // we only want a single workout, so stop after one row

    // Query 2: fetch every exercise in this workout, in order
    db
      .select({
        id: exerciseTable.id,
        image: exerciseTable.image,
        muscles: exerciseTable.muscles,
        name: exerciseTable.name,
        position: workoutExercises.position,
        reps: workoutExercises.reps, // planned reps per set
        rest: workoutExercises.restSeconds, // rest seconds between sets
        sets: workoutExercises.sets, // planned number of sets
        targetWeight: workoutExercises.targetWeight, // optional planned weight (may be null)
      })
      .from(workoutExercises) // from the join table (links workouts to exercises)
      .innerJoin(
        exerciseTable, // join in the exercises table so we get the exercise names/images
        eq(exerciseTable.id, workoutExercises.exerciseId), // on the matching exercise id
      )
      .where(eq(workoutExercises.workoutId, id)) // only rows for this workout
      .orderBy(asc(workoutExercises.position)), // sorted by their order inside the workout
  ]);

  // Take the first (only) workout row out of the array
  const workout = workoutRows[0];
  if (!workout)
    return Response.json({ message: "Workout not found" }, { status: 404 });

  // Strip the internal "position" field from each exercise before sending it to the client
  const exercises = exerciseRows;

  // Combine the unique muscle labels into one string like "Chest • Shoulders",
  // using a Set to remove duplicates
  const muscles = [...new Set(exerciseRows.map(({ muscles }) => muscles))].join(
    " • ",
  );

  // Send back the workout with its ordered exercises and combined muscles string
  return Response.json({
    ...workout,
    exercises,
    muscles,
  });
}
