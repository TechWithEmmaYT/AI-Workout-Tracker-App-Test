import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import HomeSectionHeader from "@/components/home/home-section-header";
import HomeStatCard from "@/components/home/home-stat-card";
import RecentWorkoutCard from "@/components/home/recent-workout-card";
import WorkoutCard, {
  type WorkoutCardData,
} from "@/components/home/workout-card";
import WorkoutProgressRing from "@/components/home/workout-progress-ring";
import WorkoutTemplateCard from "@/components/home/workout-template-card";
import Button from "@/components/ui/button";
import { useAppThemeColor } from "@/theme/app-theme";

const workoutImages = {
  legs: require("../../../../assets/images/workouts/leg-day.png"),
  pull: require("../../../../assets/images/workouts/pull-day.png"),
  push: require("../../../../assets/images/workouts/push-day.png"),
};

const workouts: WorkoutCardData[] = [
  {
    duration: "50m",
    exercises: 6,
    image: workoutImages.push,
    muscles: "Chest • Shoulders • Triceps",
    sets: 18,
    title: "Push Day",
  },
  {
    duration: "60m",
    exercises: 7,
    image: workoutImages.legs,
    muscles: "Quads • Hamstrings • Calves",
    sets: 21,
    title: "Leg Day",
  },
  {
    duration: "55m",
    exercises: 6,
    image: workoutImages.pull,
    muscles: "Back • Biceps",
    sets: 18,
    title: "Pull Day",
  },
];

const templates = [
  {
    image: workoutImages.pull,
    title: "Upper Body",
    workouts: 12,
  },
  {
    image: workoutImages.legs,
    title: "Lower Body",
    workouts: 10,
  },
  {
    image: workoutImages.push,
    title: "Full Body",
    workouts: 14,
  },
] as const;

export default function HomePage() {
  const router = useRouter();
  const foreground = useAppThemeColor("foreground");
  const primaryForeground = useAppThemeColor("primaryForeground");

  const openWorkouts = () => router.push("/(app)/(tabs)/workouts");
  const openDiscover = () => router.push("/(app)/(tabs)/discover");

  return (
    <SafeAreaView className="flex-1 bg-background" edges={["top"]}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pb-5 pt-3"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center">
          <View className="flex-1">
            <Text
              accessibilityRole="header"
              className="font-inter-bold text-[18px] tracking-[-0.4px] text-foreground"
            >
              Good morning, John
            </Text>
            <Text className="mt-1 font-inter text-[13px] text-muted-foreground">
              Let&apos;s get stronger today.
            </Text>
          </View>
          <Pressable
            accessibilityLabel="Notifications"
            accessibilityRole="button"
            className="h-11 w-11 items-center justify-center rounded-full active:bg-muted"
            onPress={() =>
              Alert.alert("Notifications", "You have no new notifications.")
            }
          >
            <Feather color={foreground} name="bell" size={23} />
          </Pressable>
        </View>

        <View className="mt-4 flex-row gap-2">
          <HomeStatCard label="My Workouts" value="5" />
          <HomeStatCard label="Total Training" value="25h 30m" />
          <HomeStatCard label="Avg. Workout" value="75 min" />
        </View>

        <View className="pb-3 pt-7 items-center">
          <WorkoutProgressRing completed={3} total={5} />
        </View>

        <View className="mt-2">
          <HomeSectionHeader onViewAll={openWorkouts} title="My Workouts" />
          <ScrollView
            className="-mx-5"
            contentContainerClassName="gap-2 px-5"
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {workouts.map((workout) => (
              <WorkoutCard
                key={workout.title}
                {...workout}
                onPress={openWorkouts}
              />
            ))}
          </ScrollView>
        </View>

        <Button
          accessibilityLabel="Start a workout"
          className="mt-5 mb-2"
          leftIcon={
            <Feather color={primaryForeground} name="activity" size={21} />
          }
          onPress={openWorkouts}
          size="default"
        >
          Start Workout
        </Button>

        <View className="mt-3">
          <HomeSectionHeader onViewAll={openWorkouts} title="Recent Workout" />
          <RecentWorkoutCard
            date="Mar 10, 2026"
            image={workoutImages.push}
            onPress={openWorkouts}
            summary="18 Sets  •  12,450 kg"
            title="Push Day"
          />
        </View>

        <View className="mt-3">
          <HomeSectionHeader
            onViewAll={openDiscover}
            title="Workout Templates"
          />
          <ScrollView
            className="-mx-5"
            contentContainerClassName="gap-2 px-5"
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {templates.map((template) => (
              <WorkoutTemplateCard
                key={template.title}
                {...template}
                onPress={openDiscover}
              />
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
