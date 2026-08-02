const images = {
  legs: require("../../assets/images/workouts/leg-day.png"),
  pull: require("../../assets/images/workouts/pull-day.png"),
  push: require("../../assets/images/workouts/push-day.png"),
};

const exercise = (name: string, sets = 3, reps = 10, rest = 90) => ({
  name,
  reps,
  rest,
  sets,
});

export const workoutData = {
  push: {
    title: "Push Day",
    muscles: "Chest • Shoulders • Triceps",
    sets: 18,
    duration: "50 min",
    image: images.push,
    exercises: [
      exercise("Barbell Bench Press", 4, 8, 120),
      exercise("Incline Dumbbell Press", 3, 10),
      exercise("Overhead Press", 3, 8),
      exercise("Cable Fly", 3, 12, 60),
      exercise("Tricep Pushdown", 3, 12, 60),
      exercise("Lateral Raise", 2, 15, 60),
    ],
  },
  pull: {
    title: "Pull Day",
    muscles: "Back • Biceps",
    sets: 18,
    duration: "55 min",
    image: images.pull,
    exercises: [
      exercise("Lat Pulldown"),
      exercise("Barbell Row", 4, 8, 120),
      exercise("Seated Cable Row", 3, 12),
      exercise("Face Pull", 3, 15, 60),
      exercise("Dumbbell Curl", 3, 12, 60),
      exercise("Hammer Curl", 2, 12, 60),
    ],
  },
  legs: {
    title: "Leg Day",
    muscles: "Quads • Hamstrings • Calves",
    sets: 18,
    duration: "60 min",
    image: images.legs,
    exercises: [
      exercise("Barbell Squat", 4, 8, 120),
      exercise("Romanian Deadlift", 4, 10, 120),
      exercise("Leg Press", 4, 12, 120),
      exercise("Leg Curl", 3, 12),
      exercise("Leg Extension", 3, 12),
      exercise("Calf Raise", 3, 15, 60),
    ],
  },
} as const;

export function getWorkout(id: string) {
  return id.startsWith("pull")
    ? workoutData.pull
    : id.startsWith("leg")
      ? workoutData.legs
      : workoutData.push;
}
