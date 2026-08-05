import { useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";

import HomeStats from "@/components/home/home-stats";
import MyWorkouts from "@/components/home/my-workouts";
import RecentWorkout from "@/components/home/recent-workout";
import StreakBottomSheet from "@/components/home/streak-bottom-sheet";
import WorkoutTemplates from "@/components/home/workout-templates";
import SafeAreaScreen from "@/components/ui/safe-area-screen";
import WeekCalendar from "@/components/week-calendar";

const logo = require("../../../../assets/images/app-images/logo.png");
const streakIcon = require("../../../../assets/images/app-images/streak-icon.png");

export default function HomePage() {
  const [streakOpen, setStreakOpen] = useState(false);

  return (
    <SafeAreaScreen edges={["top"]}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pb-5 pt-2"
        showsVerticalScrollIndicator={false}
      >
        {/* {Header Section} */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View className="-ml-4 h-11 w-16 overflow-hidden">
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
          <Pressable
            accessibilityLabel="View workout streak, 0 days"
            accessibilityRole="button"
            className="h-11 flex-row items-center rounded-full border border-border bg-card px-4 active:bg-muted"
            onPress={() => setStreakOpen(true)}
          >
            <Image
              accessibilityIgnoresInvertColors
              className="h-5 w-5"
              resizeMode="contain"
              source={streakIcon}
            />
            <Text className="ml-1.5 font-inter-bold text-[14px] text-foreground">
              0
            </Text>
          </Pressable>
        </View>

        {/* {Week Calendar Section} */}
        <WeekCalendar />

        <HomeStats />

        <MyWorkouts />

        <RecentWorkout />

        <WorkoutTemplates />
      </ScrollView>

      <StreakBottomSheet
        onClose={() => setStreakOpen(false)}
        visible={streakOpen}
      />
    </SafeAreaScreen>
  );
}
