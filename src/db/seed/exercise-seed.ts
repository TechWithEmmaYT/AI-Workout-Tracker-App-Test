import { z } from "zod";

import { db } from "../index";
import { exercises } from "../schema";
import { exerciseIds } from "./exercises";

const EXERCISE_DATA_URL =
  "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json";
const EXERCISE_IMAGE_BASE_URL =
  "https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/";

const sourceExerciseSchema = z.object({
  id: z.string(),
  name: z.string(),
  force: z.string().nullable(),
  level: z.string(),
  mechanic: z.string().nullable(),
  equipment: z.string().nullable(),
  primaryMuscles: z.array(z.string()),
  secondaryMuscles: z.array(z.string()),
  instructions: z.array(z.string()).min(1),
  category: z.string(),
  images: z.array(z.string()).min(1),
});

type SourceExercise = z.infer<typeof sourceExerciseSchema>;

function titleCase(value: string) {
  return value.replace(/\b\w/g, (character) => character.toUpperCase());
}

function mapExercise(exercise: SourceExercise) {
  const muscles = [
    ...new Set([...exercise.primaryMuscles, ...exercise.secondaryMuscles]),
  ];

  return {
    id: exercise.id,
    name: exercise.name,
    image: new URL(exercise.images[0], EXERCISE_IMAGE_BASE_URL).href,
    muscles: muscles.map(titleCase).join(" • "),
    description: exercise.instructions[0],
    equipment: titleCase(exercise.equipment ?? "body only"),
    difficulty:
      exercise.level === "expert" ? "Advanced" : titleCase(exercise.level),
    forceType: titleCase(exercise.force ?? "other"),
    mechanics: titleCase(exercise.mechanic ?? "other"),
    instructions: exercise.instructions,
  };
}

async function getExercises() {
  const response = await fetch(EXERCISE_DATA_URL);

  if (!response.ok) {
    throw new Error(`Free Exercise DB request failed: ${response.status}`);
  }

  const sourceExercises = z
    .array(sourceExerciseSchema)
    .parse(await response.json());
  const sourceById = new Map(
    sourceExercises.map((exercise) => [exercise.id, exercise]),
  );
  const missingIds = exerciseIds.filter((id) => !sourceById.has(id));

  if (missingIds.length) {
    throw new Error(`Missing exercises: ${missingIds.join(", ")}`);
  }

  return exerciseIds.map((id) => mapExercise(sourceById.get(id)!));
}

export async function seedExercises() {
  const exerciseSeed = await getExercises();

  for (const exercise of exerciseSeed) {
    const { id: _id, ...values } = exercise;

    await db.insert(exercises).values(exercise).onConflictDoUpdate({
      target: exercises.id,
      set: values,
    });
  }

  console.log(`Seeded ${exerciseSeed.length} exercises.`);
}
