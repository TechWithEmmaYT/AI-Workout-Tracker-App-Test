import { useLocalSearchParams } from "expo-router";
import { z } from "zod";

import { getExerciseById } from "@/lib/exercises";
import ExerciseDetailScreen from "@/screens/exercise-detail-screen";

const exerciseParamsSchema = z.object({
  id: z.string().min(1),
});

export default function ExerciseDetailPage() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const result = exerciseParamsSchema.safeParse({
    id: Array.isArray(params.id) ? params.id[0] : params.id,
  });
  const exercise = result.success ? getExerciseById(result.data.id) : undefined;

  return <ExerciseDetailScreen exercise={exercise} />;
}
