import type { ImageSourcePropType } from "react-native";

export type Exercise = {
  description: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  equipment: string;
  forceType: "Pull" | "Push";
  id: string;
  image: ImageSourcePropType;
  instructions: readonly string[];
  mechanics: "Compound" | "Isolation";
  muscleGroups: readonly string[];
  muscles: string;
  name: string;
};

const workoutImages = {
  legs: require("../../assets/images/workouts/leg-day.png"),
  pull: require("../../assets/images/workouts/pull-day.png"),
  push: require("../../assets/images/workouts/push-day.png"),
};

export const exercises: Exercise[] = [
  {
    description:
      "A compound pushing movement that primarily trains the chest, with the shoulders and triceps assisting throughout the press.",
    difficulty: "Intermediate",
    equipment: "Barbell, Bench",
    forceType: "Push",
    id: "barbell-bench-press",
    image: workoutImages.push,
    instructions: [
      "Lie on the bench with your eyes under the bar, feet planted, and shoulder blades gently pulled back.",
      "Grip the bar slightly wider than shoulder width, unrack it, and hold it above your mid-chest.",
      "Lower the bar with control toward your mid-chest while keeping your wrists stacked over your elbows.",
      "Press the bar upward until your arms are straight without bouncing the bar or lifting your hips.",
    ],
    mechanics: "Compound",
    muscleGroups: ["Chest", "Shoulders", "Arms"],
    muscles: "Chest \u2022 Triceps",
    name: "Barbell Bench Press",
  },
  {
    description:
      "An angled dumbbell press that emphasizes the upper chest while also training the front shoulders and triceps.",
    difficulty: "Intermediate",
    equipment: "Dumbbells, Incline Bench",
    forceType: "Push",
    id: "incline-dumbbell-press",
    image: workoutImages.push,
    instructions: [
      "Set the bench to a low incline and sit with a dumbbell resting on each thigh.",
      "Bring the dumbbells to shoulder level and keep your feet firmly planted.",
      "Press the dumbbells upward and slightly inward while keeping your shoulders down.",
      "Lower them with control until your elbows are just below shoulder level, then repeat.",
    ],
    mechanics: "Compound",
    muscleGroups: ["Chest", "Shoulders", "Arms"],
    muscles: "Chest \u2022 Triceps",
    name: "Incline Dumbbell Press",
  },
  {
    description:
      "A vertical pulling exercise that develops the back and biceps while teaching controlled shoulder-blade movement.",
    difficulty: "Beginner",
    equipment: "Cable Machine, Lat Bar",
    forceType: "Pull",
    id: "lat-pulldown",
    image: workoutImages.pull,
    instructions: [
      "Adjust the thigh pad, sit tall, and take a grip slightly wider than shoulder width.",
      "Lean back only slightly and pull your shoulder blades down before bending your elbows.",
      "Pull the bar toward your upper chest without swinging or pulling it behind your neck.",
      "Return the bar slowly until your arms are long and your shoulders remain controlled.",
    ],
    mechanics: "Compound",
    muscleGroups: ["Back", "Arms"],
    muscles: "Back \u2022 Biceps",
    name: "Lat Pulldown",
  },
  {
    description:
      "A lower-body compound lift that trains the quads and glutes while requiring stable bracing through the trunk.",
    difficulty: "Intermediate",
    equipment: "Barbell, Squat Rack",
    forceType: "Push",
    id: "barbell-squat",
    image: workoutImages.legs,
    instructions: [
      "Set the bar across your upper back, grip it securely, and stand with feet around shoulder width.",
      "Take a breath, brace your trunk, and sit your hips down while your knees track over your toes.",
      "Descend only as far as you can keep your feet planted and torso controlled.",
      "Drive through your whole foot to stand, keeping your knees aligned with your toes.",
    ],
    mechanics: "Compound",
    muscleGroups: ["Legs"],
    muscles: "Legs \u2022 Glutes",
    name: "Barbell Squat",
  },
  {
    description:
      "A hip-hinge movement that targets the hamstrings and glutes while strengthening controlled hip extension.",
    difficulty: "Intermediate",
    equipment: "Barbell",
    forceType: "Pull",
    id: "romanian-deadlift",
    image: workoutImages.legs,
    instructions: [
      "Hold the bar close to your thighs with soft knees, a tall chest, and a braced trunk.",
      "Push your hips backward while keeping the bar close to your legs and your spine controlled.",
      "Stop when you feel a strong hamstring stretch without losing your position.",
      "Drive your hips forward to stand tall without leaning backward at the top.",
    ],
    mechanics: "Compound",
    muscleGroups: ["Back", "Legs"],
    muscles: "Hamstrings \u2022 Glutes",
    name: "Romanian Deadlift",
  },
];

export function getExerciseById(id: string) {
  return exercises.find((exercise) => exercise.id === id);
}
