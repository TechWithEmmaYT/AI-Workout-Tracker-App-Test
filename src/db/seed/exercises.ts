import { exercises } from "../schema";

export const exerciseSeed: (typeof exercises.$inferInsert)[] = [
  {
    id: "barbell-bench-press",
    name: "Barbell Bench Press",
    muscles: "Chest • Triceps",
    description:
      "A compound pushing movement that trains the chest, shoulders and triceps.",
    equipment: "Barbell, Bench",
    difficulty: "Intermediate",
    forceType: "Push",
    mechanics: "Compound",
    instructions: [
      "Lie on the bench with your feet planted and shoulder blades pulled back.",
      "Lower the bar with control toward your mid-chest.",
      "Press the bar upward until your arms are straight.",
    ],
  },
  {
    id: "incline-dumbbell-press",
    name: "Incline Dumbbell Press",
    muscles: "Chest • Triceps",
    description:
      "An angled dumbbell press that emphasizes the upper chest and shoulders.",
    equipment: "Dumbbells, Incline Bench",
    difficulty: "Intermediate",
    forceType: "Push",
    mechanics: "Compound",
    instructions: [
      "Set the bench to a low incline and bring the dumbbells to shoulder level.",
      "Press the dumbbells upward and slightly inward.",
      "Lower them with control and repeat.",
    ],
  },
  {
    id: "lat-pulldown",
    name: "Lat Pulldown",
    muscles: "Back • Biceps",
    description:
      "A vertical pulling exercise that develops the back and biceps.",
    equipment: "Cable Machine, Lat Bar",
    difficulty: "Beginner",
    forceType: "Pull",
    mechanics: "Compound",
    instructions: [
      "Sit tall and grip the bar slightly wider than shoulder width.",
      "Pull the bar toward your upper chest without swinging.",
      "Return the bar slowly until your arms are straight.",
    ],
  },
  {
    id: "barbell-squat",
    name: "Barbell Squat",
    muscles: "Legs • Glutes",
    description:
      "A lower-body compound lift that trains the quads, glutes and trunk.",
    equipment: "Barbell, Squat Rack",
    difficulty: "Intermediate",
    forceType: "Push",
    mechanics: "Compound",
    instructions: [
      "Place the bar across your upper back and stand around shoulder width.",
      "Brace your trunk and lower while your knees track over your toes.",
      "Drive through your feet to stand.",
    ],
  },
  {
    id: "romanian-deadlift",
    name: "Romanian Deadlift",
    muscles: "Hamstrings • Glutes",
    description:
      "A hip-hinge movement that trains the hamstrings and glutes.",
    equipment: "Barbell",
    difficulty: "Intermediate",
    forceType: "Pull",
    mechanics: "Compound",
    instructions: [
      "Hold the bar close to your thighs with soft knees.",
      "Push your hips backward while keeping the bar close to your legs.",
      "Drive your hips forward to stand tall.",
    ],
  },
];
