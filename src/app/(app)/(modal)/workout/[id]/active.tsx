import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import Button from "@/components/ui/button";
import SafeAreaScreen from "@/components/ui/safe-area-screen";
import { getWorkout } from "@/constants/workouts";
import { useWorkoutTimer } from "@/hooks/use-workout-timer";
import { cn } from "@/lib/utils";
import { useAppThemeColor } from "@/theme/app-theme";

const formatTime = (seconds: number) =>
  new Date(seconds * 1000).toISOString().slice(11, 19);

export default function ActiveWorkoutModal() {
  const { id = "push-day" } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const muted = useAppThemeColor("mutedForeground");
  const primary = useAppThemeColor("primary");
  const workout = getWorkout(id);
  const {
    elapsed,
    isPaused,
    rest,
    skipRest,
    startRest,
    togglePause,
  } = useWorkoutTimer();
  const [expanded, setExpanded] = useState<string>(
    workout.exercises[0].name,
  );
  const [completed, setCompleted] = useState<string[]>([]);

  const toggleSet = (key: string, restSeconds: number) => {
    const isDone = completed.includes(key);
    setCompleted((current) =>
      isDone ? current.filter((item) => item !== key) : [...current, key],
    );
    if (!isDone) startRest(restSeconds);
  };

  const completedExercises = workout.exercises.filter((exercise) =>
    Array.from({ length: exercise.sets }, (_, index) => index + 1).every(
      (set) => completed.includes(`${exercise.name}-${set}`),
    ),
  ).length;

  const leaveWorkout = () =>
    Alert.alert("Leave workout?", "Your progress will not be saved.", [
      { text: "Cancel", style: "cancel" },
      { text: "Leave", style: "destructive", onPress: router.back },
    ]);

  const finishWorkout = () =>
    Alert.alert("Finish workout?", "Your completed sets will be saved.", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Finish",
        onPress: () => router.replace("/history"),
      },
    ]);

  return (
    <SafeAreaScreen edges={["top", "bottom"]}>
      <ScrollView
        contentContainerClassName="px-5 pb-32"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-start justify-between pt-4">
          <View>
            <Text className="font-inter-bold text-[24px] text-foreground">
              {workout.title}
            </Text>
            <Text className="mt-1 font-inter text-[12px] text-muted-foreground">
              {completedExercises}/{workout.exercises.length} exercises
            </Text>
          </View>
          <Pressable onPress={leaveWorkout}>
            <Text className="font-inter-semibold text-[13px] text-primary">
              Leave
            </Text>
          </Pressable>
        </View>

        <View className="my-7 flex-row items-center justify-between">
          <View>
            <Text className="font-inter-bold text-[38px] tracking-[-1px] text-foreground">
              {formatTime(elapsed)}
            </Text>
            <Text className="mt-1 font-inter text-[12px] text-muted-foreground">
              Elapsed Time
            </Text>
          </View>
          <Pressable
            accessibilityLabel={isPaused ? "Resume workout" : "Pause workout"}
            className="h-16 w-16 items-center justify-center rounded-full bg-primary"
            onPress={togglePause}
          >
            <Feather
              color="white"
              name={isPaused ? "play" : "pause"}
              size={26}
            />
          </Pressable>
        </View>

        <View className="gap-3">
          {workout.exercises.map((exercise) => {
            const isExpanded = expanded === exercise.name;
            return (
              <View
                className="overflow-hidden rounded-xl border border-border bg-card"
                key={exercise.name}
              >
                <Pressable
                  className="flex-row items-center px-4 py-4"
                  onPress={() => setExpanded(isExpanded ? "" : exercise.name)}
                >
                  <View className="flex-1">
                    <Text className="font-inter-bold text-[14px] text-foreground">
                      {exercise.name}
                    </Text>
                    <Text className="mt-1 font-inter text-[12px] text-muted-foreground">
                      {exercise.sets} sets • {exercise.reps} reps • {exercise.rest}s rest
                    </Text>
                  </View>
                  <Feather
                    color={muted}
                    name={isExpanded ? "chevron-up" : "chevron-down"}
                    size={20}
                  />
                </Pressable>

                {isExpanded && (
                  <View className="border-t border-border">
                    <View className="h-10 flex-row items-center px-4">
                      {[
                        ["SET", "w-12"],
                        ["WEIGHT", "flex-1"],
                        ["REPS", "flex-1"],
                        ["STATUS", "w-14"],
                      ].map(([label, width]) => (
                        <Text
                          className={`${width} text-center font-inter-semibold text-[10px] text-muted-foreground`}
                          key={label}
                        >
                          {label}
                        </Text>
                      ))}
                    </View>

                    {Array.from(
                      { length: exercise.sets },
                      (_, index) => index + 1,
                    ).map((set) => {
                      const key = `${exercise.name}-${set}`;
                      const isDone = completed.includes(key);
                      return (
                        <View
                          className={cn(
                            "h-14 flex-row items-center border-t border-border px-4",
                            isDone && "bg-accent",
                          )}
                          key={key}
                        >
                          <Text className="w-12 text-center font-inter-semibold text-[13px] text-foreground">
                            {set}
                          </Text>
                          <TextInput
                            className="mx-1 h-10 flex-1 rounded-lg bg-muted 
                            text-center font-inter text-[13px] text-foreground"
                            keyboardType="decimal-pad"
                            placeholder="kg"
                            placeholderTextColor={muted}
                            selectionColor={primary}
                          />
                          <TextInput
                            className="mx-1 h-10 flex-1 rounded-lg bg-muted 
                            text-center font-inter text-[13px] text-foreground"
                            keyboardType="number-pad"
                            defaultValue={String(exercise.reps)}
                            placeholder="reps"
                            placeholderTextColor={muted}
                            selectionColor={primary}
                          />
                          <Pressable
                            accessibilityLabel={`Complete set ${set}`}
                            className="w-14 items-center"
                            onPress={() => toggleSet(key, exercise.rest)}
                          >
                            <Feather
                              color={isDone ? primary : muted}
                              name={isDone ? "check-circle" : "circle"}
                              size={22}
                            />
                          </Pressable>
                        </View>
                      );
                    })}
                  </View>
                )}
              </View>
            );
          })}
        </View>

        <Button className="mt-5" onPress={finishWorkout} size="sm">
          Finish Workout
        </Button>
      </ScrollView>

      {rest > 0 && (
        <View className="absolute bottom-5 right-5 h-28 w-28 items-center justify-center rounded-full border-4 border-slate-700 bg-slate-950 p-3 shadow-lg">
          <Text className="font-inter text-[10px] text-white">Rest Timer</Text>
          <Text className="mt-1 font-inter-bold text-[20px] text-blue-400">
            {Math.floor(rest / 60)}:{String(rest % 60).padStart(2, "0")}
          </Text>
          <Pressable onPress={skipRest}>
            <Text className="mt-1 font-inter-semibold text-[10px] text-blue-400">
              Skip
            </Text>
          </Pressable>
        </View>
      )}
    </SafeAreaScreen>
  );
}
