import { createContext, useContext, useState } from "react";

export type WorkoutExercise = {
  id: string;
  reps: number;
  rest: number;
  sets: number;
};

type WorkoutDraftContextValue = {
  selected: WorkoutExercise[];
  toggleExercise: (id: string) => void;
  updateExercise: (
    id: string,
    field: "reps" | "rest" | "sets",
    amount: number,
  ) => void;
};

const WorkoutDraftContext = createContext<WorkoutDraftContextValue | null>(
  null,
);

export function WorkoutDraftProvider({ children }: React.PropsWithChildren) {
  const [selected, setSelected] = useState<WorkoutExercise[]>([]);

  const toggleExercise = (id: string) =>
    setSelected((current) =>
      current.some((exercise) => exercise.id === id)
        ? current.filter((exercise) => exercise.id !== id)
        : [...current, { id, reps: 10, rest: 90, sets: 3 }],
    );

  const updateExercise: WorkoutDraftContextValue["updateExercise"] = (
    id,
    field,
    amount,
  ) =>
    setSelected((current) =>
      current.map((exercise) =>
        exercise.id === id
          ? { ...exercise, [field]: Math.max(1, exercise[field] + amount) }
          : exercise,
      ),
    );

  return (
    <WorkoutDraftContext.Provider
      value={{ selected, toggleExercise, updateExercise }}
    >
      {children}
    </WorkoutDraftContext.Provider>
  );
}

export function useWorkoutDraft() {
  const value = useContext(WorkoutDraftContext);

  if (!value) throw new Error("useWorkoutDraft must be used inside its provider");

  return value;
}
