import { and, count, countDistinct, desc, eq } from "drizzle-orm";
import { z } from "zod";

import {
  db,
  workoutExercises,
  workouts,
  workoutSessions,
  workoutSessionSets,
} from "@/db";
import { auth } from "@/lib/auth";

// Route handler for GET /api/workout-sessions (list the user's completed workouts / History tab)
export async function GET(request: Request) {
  // Look up the logged-in user's session from the request's auth cookies/headers
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session)
    // If there is no session, reject with 401 Unauthorized
    return Response.json({ message: "Unauthorized" }, { status: 401 });

  // One row per completed session, joined with its workout + a count of its sets and exercises
  const rows = await db
    .select({
      id: workoutSessions.id, // session id (used to open the history detail)
      workoutId: workoutSessions.workoutId, // the workout that was performed
      workoutName: workouts.name, // workout name, e.g. "Push Day"
      image: workouts.image, // workout cover image URL (may be null)
      completedAt: workoutSessions.completedAt, // when the workout was finished
      durationSeconds: workoutSessions.durationSeconds, // total elapsed workout time
      exerciseCount: countDistinct(workoutSessionSets.exerciseId), // how many distinct exercises were completed
      setCount: count(workoutSessionSets.id), // how many sets were completed in total
    })
    .from(workoutSessions) // from the sessions table
    .innerJoin(workouts, eq(workouts.id, workoutSessions.workoutId)) // join the workout for its name/image
    .leftJoin(
      workoutSessionSets, // join the session's sets (left join keeps sessions with no sets)
      eq(workoutSessionSets.sessionId, workoutSessions.id),
    )
    .where(eq(workoutSessions.userId, session.user.id)) // only the logged-in user's sessions
    .groupBy(workoutSessions.id, workouts.id) // collapse the sets join into one row per session
    .orderBy(desc(workoutSessions.completedAt)); // newest sessions first

  // Send the list of sessions to the History screen
  return Response.json(rows);
}

// Each saved set is one completed row of a logged-in user's workout
const setSchema = z.object({
  exerciseId: z.uuid(),
  setNumber: z.number().int().min(1).max(20),
  reps: z.number().int().min(0).max(500),
  weight: z.number().min(0).max(1000).optional(),
});

// A completed workout session plus all of its completed sets
const sessionSchema = z.object({
  workoutId: z.uuid(),
  startedAt: z.string().datetime(),
  completedAt: z.string().datetime(),
  durationSeconds: z.number().int().min(0),
  sets: z.array(setSchema).max(100),
});

export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session)
    return Response.json({ message: "Unauthorized" }, { status: 401 });

  const result = sessionSchema.safeParse(
    await request.json().catch(() => null),
  );
  if (!result.success)
    return Response.json({ message: "Invalid session" }, { status: 400 });

  const { completedAt, durationSeconds, sets, startedAt, workoutId } =
    result.data;

  // Fetch the workout and its exercise ids in ONE round trip
  const [workoutRows, exerciseRows] = await db.batch([
    // Confirm the workout exists AND belongs to this user
    db
      .select({ id: workouts.id })
      .from(workouts)
      .where(
        and(eq(workouts.id, workoutId), eq(workouts.userId, session.user.id)),
      )
      .limit(1),
    // Get every exercise id that is part of this workout
    db
      .select({ exerciseId: workoutExercises.exerciseId })
      .from(workoutExercises)
      .where(eq(workoutExercises.workoutId, workoutId)),
  ]);

  // If the workout doesn't exist or belongs to someone else, reject with 404
  if (workoutRows.length === 0)
    return Response.json({ message: "Workout not found" }, { status: 404 });

  // Only keep sets whose exercise actually belongs to the workout
  const validExerciseIds = new Set(
    exerciseRows.map(({ exerciseId }) => exerciseId),
  );
  const validSets = sets.filter(({ exerciseId }) =>
    validExerciseIds.has(exerciseId),
  );

  // Create the session and all of its sets in ONE transaction-like batch
  const sessionId = crypto.randomUUID();
  await db.batch([
    // Insert the session row (the header of the history entry)
    db.insert(workoutSessions).values({
      id: sessionId,
      userId: session.user.id,
      workoutId,
      startedAt: new Date(startedAt),
      completedAt: new Date(completedAt),
      durationSeconds,
    }),
    // Insert one row per completed set, all linked to the new session
    db.insert(workoutSessionSets).values(
      validSets.map((set) => ({
        sessionId,
        exerciseId: set.exerciseId,
        setNumber: set.setNumber,
        reps: set.reps,
        weight: set.weight ?? null,
      })),
    ),
  ]);

  // Return the new session id so the client can reference it
  return Response.json({ id: sessionId }, { status: 201 });
}
