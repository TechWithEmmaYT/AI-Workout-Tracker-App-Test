import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";

import EmptyState from "@/components/ui/empty-state";
import { useAppThemeColor } from "@/theme/app-theme";
import HomeSectionHeader from "./home-section-header";

const image = require("../../../assets/images/workouts/push-day.png");
const recentWorkouts = [];

export default function RecentWorkout() {
  const router = useRouter();
  const muted = useAppThemeColor("mutedForeground");
  const openHistory = () => router.push("/history");

  return (
    <View className="mt-5">
      <HomeSectionHeader onViewAll={openHistory} title="Recent Workout" />

      {recentWorkouts.length === 0 ? (
        <EmptyState icon="clock" message="No recent workouts yet." />
      ) : (
        <Pressable
          className="min-h-[88px] flex-row items-center rounded-xl border border-border bg-card p-3 active:opacity-85"
          onPress={openHistory}
        >
          <Image className="h-16 w-20 rounded-lg bg-muted" source={image} />
          <View className="ml-3 flex-1">
            <Text className="font-inter-semibold text-[14px] text-foreground">
              Push Day
            </Text>
            <Text className="mt-1 font-inter text-[12px] text-muted-foreground">
              Mar 10, 2026 • 6 Exercises
            </Text>
            <Text className="mt-1 font-inter text-[12px] text-muted-foreground">
              18 Sets • 12,450 kg
            </Text>
          </View>
          <Feather color={muted} name="chevron-right" size={22} />
        </Pressable>
      )}
    </View>
  );
}
