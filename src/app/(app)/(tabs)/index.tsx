import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Alert, Pressable, ScrollView, Text, View } from "react-native";

import HomeSectionHeader from "@/components/home/home-section-header";
import HomeStatCard from "@/components/home/home-stat-card";
import RecentWorkoutCard from "@/components/home/recent-workout-card";
import WeekCalendar from "@/components/home/week-calendar";
import WorkoutCard, {
  type WorkoutCardData,
} from "@/components/home/workout-card";
import WorkoutTemplateCard from "@/components/home/workout-template-card";
import Button from "@/components/ui/button";
import Screen from "@/components/ui/screen";
import { useAppThemeColor } from "@/theme/app-theme";

const workoutImages = {
  legs: require("../../../../assets/images/workouts/leg-day.png"),
  pull: require("../../../../assets/images/workouts/pull-day.png"),
  push: require("../../../../assets/images/workouts/push-day.png"),
};

const workouts: WorkoutCardData[] = [
  {
    duration: "50 min",
    exercises: 6,
    image: workoutImages.push,
    muscles: "Chest • Shoulders • Triceps",
    title: "Push Day",
  },
  {
    duration: "60 min",
    exercises: 7,
    image: workoutImages.legs,
    muscles: "Quads • Hamstrings • Calves",
    title: "Leg Day",
  },
  {
    duration: "50 min",
    exercises: 6,
    image: workoutImages.pull,
    muscles: "Back • Biceps",
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
    <Screen edges={["top"]}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pb-5 pt-3"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center">
          <Text
            accessibilityRole="header"
            className="flex-1 font-inter-bold text-[24px] tracking-[-0.6px] text-foreground"
          >
            Good morning, John 👋
          </Text>
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

        <View>
          <WeekCalendar />
        </View>

        <View className="mt-6 flex-row gap-2">
          <HomeStatCard icon="activity" label="Workouts" value="5" />
          <HomeStatCard icon="clock" label="Time" value="25h 30m" />
          <HomeStatCard icon="bar-chart-2" label="Avg Time" value="75 min" />
        </View>

        <View className="mt-7">
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
            date="Mar 10, 2026 • 6 Exercises"
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
    </Screen>
  );
}
