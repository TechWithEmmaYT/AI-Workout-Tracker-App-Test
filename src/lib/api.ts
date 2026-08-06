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
  image: string | null;
  muscles: string;
  name: string;
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
