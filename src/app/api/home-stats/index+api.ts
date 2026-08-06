import { and, eq, gte, lt } from "drizzle-orm";
import { z } from "zod";

import { db, workoutSessions } from "@/db";
import { auth } from "@/lib/auth";

const datePattern = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session)
    return Response.json({ message: "Unauthorized" }, { status: 401 });

  const date = datePattern.safeParse(
    new URL(request.url).searchParams.get("date"),
  );
  if (!date.success)
    return Response.json({ message: "Invalid date" }, { status: 400 });

  // Split the validated "YYYY-MM-DD" string into year, month (1-based), and day numbers
  const [year, month, day] = date.data.split("-").map(Number);
  // Start of the selected day in the server's local timezone
  // (month is 0-based in Date, so month - 1)
  const start = new Date(year, month - 1, day);
  // Start of the NEXT day —
  // the exclusive end boundary so the whole selected day is included
  const end = new Date(year, month - 1, day + 1);

  // Query the workout_sessions table for that user's sessions on that day.
  // We filter on the session's "startedAt" timestamp: it must be >= start (00:00 of the day)
  // and < end (00:00 of the next day).
  const sessions = await db
    .select({ durationSeconds: workoutSessions.durationSeconds })
    .from(workoutSessions)
    .where(
      and(
        eq(workoutSessions.userId, session.user.id), // only the logged-in user's sessions
        gte(workoutSessions.startedAt, start),
        lt(workoutSessions.startedAt, end),
      ),
    );

  // Number of sessions = number of workouts performed that day
  const workouts = sessions.length;
  // Total training time: sum the durationSeconds of every session that day
  const totalTimeSeconds = sessions.reduce(
    (sum, { durationSeconds }) => sum + durationSeconds,
    0,
  );
  // Average time per workout; guard against dividing by zero when there are no sessions
  const avgTimeSeconds = workouts ? Math.round(totalTimeSeconds / workouts) : 0;

  return Response.json({ avgTimeSeconds, totalTimeSeconds, workouts });
}
