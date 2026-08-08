import { and, asc, eq } from "drizzle-orm";
import { z } from "zod";

import {
  db,
  exercises as exerciseTable,
  workouts,
  workoutSessions,
  workoutSessionSets,
} from "@/db";
import { auth } from "@/lib/auth";

const idSchema = z.uuid();

// Route handler for GET /api/workout-sessions/[id] (one session / History detail)

export async function GET(request: Request, { id }: Record<string, string>) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session)
    return Response.json({ message: "Unauthorized" }, { status: 401 });

  if (!idSchema.safeParse(id).success)
    return Response.json({ message: "Session not found" }, { status: 404 });

  // Run both queries in a single database round trip instead of two
  // separate awaits — fewer network hops, faster response.
  const [sessionRows, setRows] = await db.batch([
    // Query 1: the session's own info (name, image, timing), joined with
    // the workout it belongs to so we get workoutName/image in one go.
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
          eq(workoutSessions.id, id),
          eq(workoutSessions.userId, session.user.id),
        ),
      )
      .limit(1),

    // Query 2: every individual set logged in this session, joined with
    // the exercise it was performed on.
    // Ordered by exerciseId first so each exercise's sets group together,
    // then by setNumber so sets stay in performed order within an exercise.
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
      // Pull in the exercise's name/image via its id.
      .innerJoin(
        exerciseTable,
        eq(exerciseTable.id, workoutSessionSets.exerciseId),
      )
      // Only the sets that belong to this specific session.
      .where(eq(workoutSessionSets.sessionId, id))
      .orderBy(
        asc(workoutSessionSets.exerciseId),
        asc(workoutSessionSets.setNumber),
      ),
  ]);

  // db.batch() always returns an array for each query — take the first
  // (and only) row for the session itself.
  const sessionRow = sessionRows[0];
  if (!sessionRow)
    return Response.json({ message: "Session not found" }, { status: 404 });

  // Keep every set (not just the max) so the detail screen can show
  // real per-set progression.

  const exercises = new Map<
    string,
    {
      id: string;
      name: string;
      image: string | null;
      sets: { reps: number; weight: number | null }[]; // every set performed on this exercise, in order
    }
  >();

  // Running total of "volume" (weight × reps summed across every set) for
  // the whole session — a common workout-tracking stat.
  let volume = 0;

  // Tracks whether ANY set in this session had a weight logged, so we can
  // tell "0 kg volume"
  let hasWeight = false;

  // Walk through every set row once, building up the exercises Map and
  // the volume total at the same time.
  for (const row of setRows) {
    // Have we already started a group for this exercise?
    const group = exercises.get(row.id);
    if (group) {
      // Yes — just add this set to its existing list.
      group.sets.push({ reps: row.reps, weight: row.weight });
    } else {
      // No — this is the first set we've seen for this exercise, so
      // create a new group with it as the first entry.
      exercises.set(row.id, {
        id: row.id,
        name: row.name,
        image: row.image,
        sets: [{ reps: row.reps, weight: row.weight }],
      });
    }

    // Only add to volume if this set actually has a weight logged
    // (bodyweight sets have weight === null and don't count toward it).
    if (row.weight !== null) {
      hasWeight = true;
      volume += row.weight * row.reps;
    }
  }

  return Response.json({
    ...sessionRow,
    exercises: [...exercises.values()],
    setCount: setRows.length,
    volume: hasWeight ? Math.round(volume) : null,
  });
}

//
//
//
//
//
// export async function GET(
//   request: Request,
//   { id }: Record<string, string>,
// ) {
//   // Look up the logged-in user's session from the request's auth cookies/headers
//   const session = await auth.api.getSession({ headers: request.headers });
//   if (!session)
//     // If there is no session, reject with 401 Unauthorized
//     return Response.json({ message: "Unauthorized" }, { status: 401 });

//   // Reject non-UUID ids so invalid input never reaches the database
//   if (!idSchema.safeParse(id).success)
//     return Response.json({ message: "Session not found" }, { status: 404 });

//   // Run two queries in ONE round trip: the session header + all its sets with exercise details
//   const [sessionRows, setRows] = await db.batch([
//     // Query 1: the session's own fields joined with its workout
//     db
//       .select({
//         id: workoutSessions.id,
//         workoutId: workoutSessions.workoutId,
//         workoutName: workouts.name,
//         image: workouts.image,
//         completedAt: workoutSessions.completedAt,
//         durationSeconds: workoutSessions.durationSeconds,
//       })
//       .from(workoutSessions)
//       .innerJoin(workouts, eq(workouts.id, workoutSessions.workoutId))
//       .where(
//         and(
//           eq(workoutSessions.id, id), // the session must match the id from the URL
//           eq(workoutSessions.userId, session.user.id), // and belong to this user
//         ),
//       )
//       .limit(1),

//     // Query 2: every completed set of this session, joined with its exercise
//     db
//       .select({
//         id: exerciseTable.id,
//         name: exerciseTable.name,
//         image: exerciseTable.image,
//         setNumber: workoutSessionSets.setNumber,
//         reps: workoutSessionSets.reps,
//         weight: workoutSessionSets.weight,
//       })
//       .from(workoutSessionSets)
//       .innerJoin(
//         exerciseTable,
//         eq(exerciseTable.id, workoutSessionSets.exerciseId),
//       )
//       .where(eq(workoutSessionSets.sessionId, id))
//       .orderBy(asc(workoutSessionSets.setNumber)),
//   ]);

//   // Take the first (only) session row out of the array
//   const sessionRow = sessionRows[0];
//   if (!sessionRow)
//     return Response.json({ message: "Session not found" }, { status: 404 });

//   // Group the set rows by exercise and compute volume (sum of weight × reps).
//   // Per exercise we keep the max reps and max weight, and count the sets.
//   const exercises = new Map<
//     string,
//     {
//       id: string;
//       name: string;
//       image: string | null;
//       setCount: number;
//       reps: number;
//       weight: number | null;
//     }
//   >();
//   let volume = 0;
//   let hasWeight = false;
//   for (const row of setRows) {
//     const group = exercises.get(row.id);
//     if (group) {
//       group.setCount += 1;
//       if (row.reps > group.reps) group.reps = row.reps;
//       if (row.weight !== null && (group.weight === null || row.weight > group.weight))
//         group.weight = row.weight;
//     } else {
//       exercises.set(row.id, {
//         id: row.id,
//         name: row.name,
//         image: row.image,
//         setCount: 1,
//         reps: row.reps,
//         weight: row.weight,
//       });
//     }
//     if (row.weight !== null) {
//       hasWeight = true;
//       volume += row.weight * row.reps;
//     }
//   }

//   // Send the session with its grouped exercises and total volume
//   return Response.json({
//     ...sessionRow,
//     exercises: [...exercises.values()],
//     setCount: setRows.length,
//     volume: hasWeight ? Math.round(volume) : null,
//   });
// }
