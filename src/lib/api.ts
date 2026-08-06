import { format } from "date-fns";

import { apiURL, authClient } from "@/lib/auth-client";

export type WorkoutListItem = {
  exerciseCount: number;
  id: string;
  image: string | null;
  muscles: string;
  name: string;
  totalSets: number;
};

export type WorkoutExercise = {
  id: string;
  image: string | null;
  muscles: string;
  name: string;
  targetWeight?: number | null;
  reps?: number;
  rest?: number;
  sets?: number;
};

export type WorkoutDetail = {
  description: string | null;
  exercises: WorkoutExercise[];
  id: string;
  image: string | null;
  muscles: string;
  name: string;
};

export async function getWorkoutsQueryFn(
  limit?: number,
): Promise<WorkoutListItem[]> {
  const response = await fetch(
    `${apiURL}/api/workouts${limit ? `?limit=${limit}` : ""}`,
    {
      credentials: "omit",
      headers: { Cookie: authClient.getCookie() },
    },
  );
  if (!response.ok) throw new Error("Could not load workouts");
  return response.json();
}

export async function getWorkoutQueryFn(id: string): Promise<WorkoutDetail> {
  const response = await fetch(
    `${apiURL}/api/workouts/${encodeURIComponent(id)}`,
    {
      credentials: "omit",
      headers: { Cookie: authClient.getCookie() },
    },
  );
  if (!response.ok) throw new Error("Could not load workout");
  return response.json();
}

export type HomeStats = {
  avgTimeSeconds: number;
  totalTimeSeconds: number;
  workouts: number;
};

export async function getHomeStatsQueryFn(date: Date): Promise<HomeStats> {
  const response = await fetch(
    `${apiURL}/api/home-stats?date=${format(date, "yyyy-MM-dd")}`,
    {
      credentials: "omit",
      headers: { Cookie: authClient.getCookie() },
    },
  );
  if (!response.ok) throw new Error("Could not load stats");
  return response.json();
}

export type SaveSessionSet = {
  exerciseId: string;
  setNumber: number;
  reps: number;
  weight?: number;
};

export type SaveSessionInput = {
  workoutId: string;
  startedAt: string;
  completedAt: string;
  durationSeconds: number;
  sets: SaveSessionSet[];
};

export async function createWorkoutSessionQueryFn(
  input: SaveSessionInput,
): Promise<{ id: string }> {
  const response = await fetch(`${apiURL}/api/workout-sessions`, {
    method: "POST",
    credentials: "omit",
    headers: {
      "Content-Type": "application/json",
      Cookie: authClient.getCookie(),
    },
    body: JSON.stringify(input),
  });
  if (!response.ok) throw new Error("Could not save workout");
  return response.json();
}

export type HistoryItem = {
  id: string;
  workoutId: string;
  workoutName: string;
  image: string | null;
  completedAt: string;
  durationSeconds: number;
  exerciseCount: number;
  setCount: number;
};

export type HistoryExercise = {
  id: string;
  image: string | null;
  name: string;
  reps: number;
  setCount: number;
  weight: number | null;
};

export type HistoryDetail = {
  completedAt: string;
  durationSeconds: number;
  exercises: HistoryExercise[];
  id: string;
  image: string | null;
  setCount: number;
  volume: number | null;
  workoutId: string;
  workoutName: string;
};

export async function getHistoryQueryFn(): Promise<HistoryItem[]> {
  const response = await fetch(`${apiURL}/api/workout-sessions`, {
    credentials: "omit",
    headers: { Cookie: authClient.getCookie() },
  });
  if (!response.ok) throw new Error("Could not load history");
  return response.json();
}

export async function getHistoryDetailQueryFn(
  id: string,
): Promise<HistoryDetail> {
  const response = await fetch(
    `${apiURL}/api/workout-sessions/${encodeURIComponent(id)}`,
    {
      credentials: "omit",
      headers: { Cookie: authClient.getCookie() },
    },
  );
  if (!response.ok) throw new Error("Could not load session");
  return response.json();
}
