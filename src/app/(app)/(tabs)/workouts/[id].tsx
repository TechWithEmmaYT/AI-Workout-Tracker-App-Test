import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import SafeAreaScreen from "@/components/ui/safe-area-screen";
import { getWorkout } from "@/constants/workouts";
import { useAppThemeColor } from "@/theme/app-theme";

export default function WorkoutDetailScreen() {
  const { id = "push-day" } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const muted = useAppThemeColor("mutedForeground");
  const workout = getWorkout(id);
  const stats = [
    { icon: "list", label: `${workout.exercises.length} Exercises` },
    { icon: "layers", label: `${workout.sets} Sets` },
    { icon: "clock", label: workout.duration },
  ] as const;

  return (
    <SafeAreaScreen>
      <ScrollView
        className="flex-1"
        contentInsetAdjustmentBehavior="never"
        contentContainerClassName="pb-8"
        showsVerticalScrollIndicator={false}
      >
        <View className="h-64 bg-muted">
          <Image
            accessibilityLabel={`${workout.title} workout cover`}
            className="h-full w-full"
            resizeMode="cover"
            source={workout.image}
          />
          <View className="absolute inset-0 bg-black/20" />

          <SafeAreaView className="absolute inset-x-0 top-0" edges={["top"]}>
            <View className="h-14 flex-row items-center justify-between px-4">
              <Pressable
                accessibilityLabel="Go back"
                accessibilityRole="button"
                className="h-11 w-11 items-center justify-center rounded-full bg-black/40 active:opacity-70"
                onPress={router.back}
              >
                <Feather color="white" name="arrow-left" size={23} />
              </Pressable>
              <View className="h-11 w-11 items-center justify-center rounded-full bg-black/40">
                <Feather color="white" name="more-horizontal" size={23} />
              </View>
            </View>
          </SafeAreaView>
        </View>

        <View className="px-5">
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
            onPress={() =>
              router.push({
                pathname: "/workout/[id]/active",
                params: { id },
              })
            }
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
                key={exercise.name}
              >
                <View className="h-9 w-9 items-center justify-center rounded-lg bg-muted">
                  <Text className="font-inter-semibold text-[12px] text-muted-foreground">
                    {index + 1}
                  </Text>
                </View>
                <View className="ml-3 flex-1">
                  <Text className="font-inter-semibold text-[13px] text-foreground">
                    {exercise.name}
                  </Text>
                  <Text className="mt-1 font-inter text-[12px] text-muted-foreground">
                    {exercise.sets} sets • {exercise.reps} reps •{" "}
                    {exercise.rest}s rest
                  </Text>
                </View>
                <Feather color={muted} name="menu" size={17} />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaScreen>
  );
}
