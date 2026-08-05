import { apiURL, authClient } from "@/lib/auth-client";

export type WorkoutListItem = {
  exerciseCount: number;
  id: string;
  image: string | null;
  muscles: string;
  name: string;
  totalSets: number;
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
