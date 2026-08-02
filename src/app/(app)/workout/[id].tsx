import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Alert, Image, Pressable, ScrollView, Text, View } from "react-native";

import Screen from "@/components/ui/screen";
import { useAppThemeColor } from "@/theme/app-theme";

const images = {
  legs: require("../../../../assets/images/workouts/leg-day.png"),
  pull: require("../../../../assets/images/workouts/pull-day.png"),
  push: require("../../../../assets/images/workouts/push-day.png"),
};

const workoutData = {
  push: {
    title: "Push Day",
    muscles: "Chest • Shoulders • Triceps",
    sets: 18,
    duration: "50 min",
    image: images.push,
    exercises: [
      "Barbell Bench Press",
      "Incline Dumbbell Press",
      "Overhead Press",
      "Cable Fly",
      "Tricep Pushdown",
      "Lateral Raise",
    ],
  },
  pull: {
    title: "Pull Day",
    muscles: "Back • Biceps",
    sets: 18,
    duration: "55 min",
    image: images.pull,
    exercises: [
      "Lat Pulldown",
      "Barbell Row",
      "Seated Cable Row",
      "Face Pull",
      "Dumbbell Curl",
      "Hammer Curl",
    ],
  },
  legs: {
    title: "Leg Day",
    muscles: "Quads • Hamstrings • Calves",
    sets: 18,
    duration: "60 min",
    image: images.legs,
    exercises: [
      "Barbell Squat",
      "Romanian Deadlift",
      "Leg Press",
      "Leg Curl",
      "Leg Extension",
      "Calf Raise",
    ],
  },
} as const;

export default function WorkoutDetailPage() {
  const { id = "push-day" } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const muted = useAppThemeColor("mutedForeground");
  const workout = id.startsWith("pull")
    ? workoutData.pull
    : id.startsWith("leg")
      ? workoutData.legs
      : workoutData.push;
  const stats = [
    { icon: "list", label: `${workout.exercises.length} Exercises` },
    { icon: "layers", label: `${workout.sets} Sets` },
    { icon: "clock", label: workout.duration },
  ] as const;

  return (
    <Screen edges={["top"]}>
      <ScrollView
        contentContainerClassName="px-5 pb-8"
        showsVerticalScrollIndicator={false}
      >
        <View className="h-14 flex-row items-center justify-between">
          <Pressable
            accessibilityLabel="Go back"
            className="h-11 w-11 items-center justify-center"
            onPress={router.back}
          >
            <Feather color={muted} name="arrow-left" size={23} />
          </Pressable>
          <Feather color={muted} name="more-horizontal" size={23} />
        </View>

        <Image
          className="h-48 w-full rounded-xl bg-muted"
          resizeMode="cover"
          source={workout.image}
        />
        <Text className="mt-4 font-inter-bold text-[24px] text-foreground">
          {workout.title}
        </Text>
        <Text className="mt-1 font-inter text-[13px] text-muted-foreground">
          {workout.muscles}
        </Text>
        <View className="mt-4 flex-row gap-5">
          {stats.map((stat) => (
            <View className="flex-row items-center gap-1.5" key={stat.label}>
              <Feather color={muted} name={stat.icon} size={14} />
              <Text className="font-inter text-[12px] text-muted-foreground">
                {stat.label}
              </Text>
            </View>
          ))}
        </View>

        <Pressable
          className="mt-5 h-12 flex-row items-center justify-center rounded-xl bg-primary active:opacity-80"
          onPress={() => Alert.alert("Workout started", workout.title)}
        >
          <Feather color="white" name="play" size={17} />
          <Text className="ml-2 font-inter-semibold text-[14px] text-primary-foreground">
            Start Workout
          </Text>
        </Pressable>

        <Text className="mb-3 mt-6 font-inter-bold text-[16px] text-foreground">
          Exercises
        </Text>
        <View className="overflow-hidden rounded-xl border border-border bg-background">
          {workout.exercises.map((exercise, index) => (
            <View
              className="h-16 flex-row items-center border-b border-border px-4 last:border-b-0"
              key={exercise}
            >
              <View className="h-9 w-9 items-center justify-center rounded-lg bg-muted">
                <Text className="font-inter-semibold text-[12px] text-muted-foreground">
                  {index + 1}
                </Text>
              </View>
              <View className="ml-3 flex-1">
                <Text className="font-inter-semibold text-[13px] text-foreground">
                  {exercise}
                </Text>
                <Text className="mt-1 font-inter text-[11px] text-muted-foreground">
                  3 sets • 8–12 reps
                </Text>
              </View>
              <Feather color={muted} name="menu" size={17} />
            </View>
          ))}
        </View>
      </ScrollView>
    </Screen>
  );
}
