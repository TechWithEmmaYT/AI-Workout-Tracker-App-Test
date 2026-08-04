import { Feather } from "@expo/vector-icons";
import { Redirect, useLocalSearchParams, useRouter } from "expo-router";
import { Alert, Image, Pressable, ScrollView, Text, View } from "react-native";

import Button from "@/components/ui/button";
import SafeAreaScreen from "@/components/ui/safe-area-screen";
import { getWorkoutHistory } from "@/constants/workout-history";
import { useAppThemeColor } from "@/theme/app-theme";

export default function HistoryDetailModal() {
  const { id = "" } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const muted = useAppThemeColor("mutedForeground");
  const workout = getWorkoutHistory(id);

  if (!workout) return <Redirect href="/history" />;

  return (
    <SafeAreaScreen edges={["top"]}>
      <ScrollView contentContainerClassName="px-5 pb-8">
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

        <Text className="font-inter-bold text-[24px] text-foreground">
          {workout.title}
        </Text>
        <Text className="mt-1 font-inter text-[12px] text-muted-foreground">
          {workout.date}
        </Text>

        <View className="my-5 flex-row gap-2">
          {[
            ["Duration", workout.duration],
            ["Sets", workout.sets],
            ["Volume", workout.volume],
          ].map(([label, value]) => (
            <View
              className="flex-1 items-center rounded-xl border border-border bg-background px-2 py-4"
              key={label}
            >
              <Text className="font-inter text-[11px] text-muted-foreground">
                {label}
              </Text>
              <Text className="mt-2 font-inter-bold text-[14px] text-foreground">
                {value}
              </Text>
            </View>
          ))}
        </View>

        <Text className="mb-3 font-inter-bold text-[16px] text-foreground">
          Exercises
        </Text>
        <View className="overflow-hidden rounded-xl border border-border bg-background">
          {workout.exercises.map(([name, summary, weight]) => (
            <View
              className="min-h-20 flex-row items-center border-b border-border px-3 py-2 last:border-b-0"
              key={name}
            >
              <Image className="h-11 w-12 rounded-lg" source={workout.image} />
              <View className="ml-3 flex-1">
                <Text className="font-inter-semibold text-[13px] text-foreground">
                  {name}
                </Text>
                <Text className="mt-1 font-inter text-[11px] text-muted-foreground">
                  {summary}
                </Text>
              </View>
              <Text className="font-inter-medium text-[11px] text-muted-foreground">
                {weight}
              </Text>
            </View>
          ))}
        </View>

        <Button
          className="mt-6"
          leftIcon={<Feather color="white" name="repeat" size={17} />}
          onPress={() => Alert.alert("Workout ready", workout.title)}
          size="sm"
        >
          Repeat Workout
        </Button>
      </ScrollView>
    </SafeAreaScreen>
  );
}
