import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, Pressable, ScrollView, Text, View } from "react-native";

import HomeSectionHeader from "@/components/home/home-section-header";
import HomeStatCard from "@/components/home/home-stat-card";
import RecentWorkoutCard from "@/components/home/recent-workout-card";
import WeekCalendar from "@/components/home/week-calendar";
import WorkoutCard, {
  type WorkoutCardData,
} from "@/components/home/workout-card";
import WorkoutTemplateCard from "@/components/home/workout-template-card";
import SafeAreaScreen from "@/components/ui/safe-area-screen";

const logo = require("../../../../assets/images/app-images/logo.png");

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

  const openWorkouts = () => router.push("/workouts");
  const createWorkout = () => router.push("/workout/create");

  return (
    <SafeAreaScreen edges={["top"]}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pb-5 pt-3"
        showsVerticalScrollIndicator={false}
      >
        {/* {Header Section} */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className="h-11 w-16 overflow-hidden">
              <Image
                accessibilityLabel="MyWorkout logo"
                className="h-full w-full"
                resizeMode="cover"
                source={logo}
              />
            </View>
            <Text
              accessibilityRole="header"
              className="font-inter-bold text-[22px] tracking-[-0.5px] text-foreground"
            >
              MyWorkout
            </Text>
          </View>
          <View className="h-10 flex-row items-center rounded-full border border-border bg-background px-4">
            <Text className="text-[16px]">🔥</Text>
            <Text className="ml-1.5 font-inter-bold text-[14px] text-foreground">
              0
            </Text>
          </View>
        </View>

        {/* {Week Calendar Section} */}
        <View>
          <WeekCalendar />
        </View>

        {/* {Stats Section} */}
        <View className="mt-3 flex-row gap-2">
          <HomeStatCard icon="activity" label="Workouts" value="5" />
          <HomeStatCard icon="clock" label="Time" value="25h 30m" />
          <HomeStatCard icon="bar-chart-2" label="Avg Time" value="75 min" />
        </View>

        {/* {My Workouts Section} */}
        <View className="mt-4">
          <View className="mb-2">
            <Text className="font-inter-bold text-[16px] tracking-[-0.2px] text-foreground">
              My Workouts
            </Text>
          </View>
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

          {/* {Create Your Own Workout Section} */}
          <Pressable
            accessibilityLabel="Create your own workout"
            accessibilityRole="button"
            className="mt-3 flex-row items-center overflow-hidden rounded-2xl p-5 active:opacity-90"
            onPress={createWorkout}
            style={{
              experimental_backgroundImage:
                "linear-gradient(110deg, #0EA5E9 0%, #2563EB 55%, #1D4ED8 100%)",
            }}
          >
            <View className="flex-1">
              <Text className="font-inter-bold text-[22px] text-primary-foreground">
                Create your own
              </Text>
              <Text className="mt-1 font-inter text-[12px] text-primary-foreground/80">
                Pick exercises, sets and reps
              </Text>
              <View className="mt-4 self-start rounded-full bg-white px-5 py-2">
                <Text className="font-inter-semibold text-[12px] text-primary">
                  Create
                </Text>
              </View>
            </View>
            <View className="h-16 w-16 items-center justify-center rounded-2xl bg-white/20">
              <Feather color="white" name="edit-3" size={29} />
            </View>
          </Pressable>
        </View>

        {/* {Recent Workout Section} */}
        <View className="mt-5">
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
            onViewAll={openWorkouts}
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
                onPress={openWorkouts}
              />
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaScreen>
  );
}
