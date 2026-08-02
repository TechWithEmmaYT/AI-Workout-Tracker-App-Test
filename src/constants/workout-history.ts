const images = {
  legs: require("../../assets/images/workouts/leg-day.png"),
  pull: require("../../assets/images/workouts/pull-day.png"),
  push: require("../../assets/images/workouts/push-day.png"),
};

export const workoutHistory = [
  {
    id: "push-day-1",
    title: "Push Day",
    date: "Today, 8:45 AM",
    duration: "52 min",
    sets: 18,
    volume: "12,450 kg",
    image: images.push,
    exercises: [
      ["Barbell Bench Press", "4 sets • 8 reps", "80 kg"],
      ["Incline Dumbbell Press", "3 sets • 10 reps", "24 kg"],
      ["Overhead Press", "3 sets • 8 reps", "40 kg"],
      ["Cable Fly", "3 sets • 12 reps", "20 kg"],
      ["Tricep Pushdown", "3 sets • 12 reps", "25 kg"],
      ["Lateral Raise", "2 sets • 15 reps", "8 kg"],
    ],
  },
  {
    id: "leg-day-1",
    title: "Leg Day",
    date: "Yesterday, 6:20 PM",
    duration: "61 min",
    sets: 18,
    volume: "14,320 kg",
    image: images.legs,
    exercises: [
      ["Barbell Squat", "4 sets • 8 reps", "90 kg"],
      ["Romanian Deadlift", "4 sets • 10 reps", "70 kg"],
      ["Leg Press", "4 sets • 12 reps", "140 kg"],
      ["Leg Curl", "3 sets • 12 reps", "35 kg"],
      ["Calf Raise", "3 sets • 15 reps", "50 kg"],
    ],
  },
  {
    id: "pull-day-1",
    title: "Pull Day",
    date: "Jul 30, 7:10 AM",
    duration: "50 min",
    sets: 16,
    volume: "11,240 kg",
    image: images.pull,
    exercises: [
      ["Lat Pulldown", "4 sets • 10 reps", "55 kg"],
      ["Barbell Row", "4 sets • 8 reps", "60 kg"],
      ["Seated Cable Row", "3 sets • 12 reps", "50 kg"],
      ["Face Pull", "3 sets • 15 reps", "20 kg"],
      ["Dumbbell Curl", "2 sets • 12 reps", "12 kg"],
    ],
  },
   {
    id: "leg-day-2",
    title: "Leg Day",
    date: "Yesterday, 6:20 PM",
    duration: "61 min",
    sets: 18,
    volume: "14,320 kg",
    image: images.legs,
    exercises: [
      ["Barbell Squat", "4 sets • 8 reps", "90 kg"],
      ["Romanian Deadlift", "4 sets • 10 reps", "70 kg"],
      ["Leg Press", "4 sets • 12 reps", "140 kg"],
      ["Leg Curl", "3 sets • 12 reps", "35 kg"],
      ["Calf Raise", "3 sets • 15 reps", "50 kg"],
    ],
  },
   {
    id: "pull-day-2",
    title: "Pull Day",
    date: "Jul 30, 7:10 AM",
    duration: "50 min",
    sets: 16,
    volume: "11,240 kg",
    image: images.pull,
    exercises: [
      ["Lat Pulldown", "4 sets • 10 reps", "55 kg"],
      ["Barbell Row", "4 sets • 8 reps", "60 kg"],
      ["Seated Cable Row", "3 sets • 12 reps", "50 kg"],
      ["Face Pull", "3 sets • 15 reps", "20 kg"],
      ["Dumbbell Curl", "2 sets • 12 reps", "12 kg"],
    ],
  },
] as const;

export const getWorkoutHistory = (id: string) =>
  workoutHistory.find((workout) => workout.id === id);
