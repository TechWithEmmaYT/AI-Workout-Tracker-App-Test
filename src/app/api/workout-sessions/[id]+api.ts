import { and, asc, eq } from "drizzle-orm";
import { z } from "zod";

import {
  db,
  exercises as exerciseTable,
  workoutSessions,
  workoutSessionSets,
  workouts,
} from "@/db";
import { auth } from "@/lib/auth";

const idSchema = z.uuid();

// Route handler for GET /api/workout-sessions/[id] (one session / History detail)
export async function GET(
  request: Request,
  { id }: Record<string, string>,
) {
  // Look up the logged-in user's session from the request's auth cookies/headers
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session)
    // If there is no session, reject with 401 Unauthorized
    return Response.json({ message: "Unauthorized" }, { status: 401 });

  // Reject non-UUID ids so invalid input never reaches the database
  if (!idSchema.safeParse(id).success)
    return Response.json({ message: "Session not found" }, { status: 404 });

  // Run two queries in ONE round trip: the session header + all its sets with exercise details
  const [sessionRows, setRows] = await db.batch([
    // Query 1: the session's own fields joined with its workout
    db
      .select({
        id: workoutSessions.id,
        workoutId: workoutSessions.workoutId,
        workoutName: workouts.name,
        image: workouts.image,
        completedAt: workoutSessions.completedAt,
        durationSeconds: workoutSessions.durationSeconds,
      })
      .from(workoutSessions)
      .innerJoin(workouts, eq(workouts.id, workoutSessions.workoutId))
      .where(
        and(
          eq(workoutSessions.id, id), // the session must match the id from the URL
          eq(workoutSessions.userId, session.user.id), // and belong to this user
        ),
      )
      .limit(1),

    // Query 2: every completed set of this session, joined with its exercise
    db
      .select({
        id: exerciseTable.id,
        name: exerciseTable.name,
        image: exerciseTable.image,
        setNumber: workoutSessionSets.setNumber,
        reps: workoutSessionSets.reps,
        weight: workoutSessionSets.weight,
      })
      .from(workoutSessionSets)
      .innerJoin(
        exerciseTable,
        eq(exerciseTable.id, workoutSessionSets.exerciseId),
      )
      .where(eq(workoutSessionSets.sessionId, id))
      .orderBy(asc(workoutSessionSets.setNumber)),
  ]);

  // Take the first (only) session row out of the array
  const sessionRow = sessionRows[0];
  if (!sessionRow)
    return Response.json({ message: "Session not found" }, { status: 404 });

  // Group the set rows by exercise and compute volume (sum of weight × reps).
  // Per exercise we keep the max reps and max weight, and count the sets.
  const exercises = new Map<
    string,
    {
      id: string;
      name: string;
      image: string | null;
      setCount: number;
      reps: number;
      weight: number | null;
    }
  >();
  let volume = 0;
  let hasWeight = false;
  for (const row of setRows) {
    const group = exercises.get(row.id);
    if (group) {
      group.setCount += 1;
      if (row.reps > group.reps) group.reps = row.reps;
      if (row.weight !== null && (group.weight === null || row.weight > group.weight))
        group.weight = row.weight;
    } else {
      exercises.set(row.id, {
        id: row.id,
        name: row.name,
        image: row.image,
        setCount: 1,
        reps: row.reps,
        weight: row.weight,
      });
    }
    if (row.weight !== null) {
      hasWeight = true;
      volume += row.weight * row.reps;
    }
  }

  // Send the session with its grouped exercises and total volume
  return Response.json({
    ...sessionRow,
    exercises: [...exercises.values()],
    setCount: setRows.length,
    volume: hasWeight ? Math.round(volume) : null,
  });
}
