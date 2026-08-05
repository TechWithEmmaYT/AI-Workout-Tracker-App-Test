import { Feather, FontAwesome6 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  Image,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import EmptyState from "@/components/ui/empty-state";
import { useAppThemeColor } from "@/theme/app-theme";
import HomeSectionHeader from "./home-section-header";

const images = {
  legs: require("../../../assets/images/workouts/leg-day.png"),
  pull: require("../../../assets/images/workouts/pull-day.png"),
  push: require("../../../assets/images/workouts/push-day.png"),
};

const previewEmptyState = true;
const workouts = previewEmptyState
  ? []
  : [
      {
        duration: "50 min",
        exercises: 6,
        image: images.push,
        muscles: "Chest • Shoulders • Triceps",
        title: "Push Day",
      },
      {
        duration: "60 min",
        exercises: 7,
        image: images.legs,
        muscles: "Quads • Hamstrings • Calves",
        title: "Leg Day",
      },
      {
        duration: "50 min",
        exercises: 6,
        image: images.pull,
        muscles: "Back • Biceps",
        title: "Pull Day",
      },
    ];

export default function MyWorkouts() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const muted = useAppThemeColor("mutedForeground");
  const openWorkouts = () => router.push("/workouts");
  const createWorkout = () => router.push("/workout/create");

  return (
    <View className="mt-5">
      <HomeSectionHeader title="My Workouts" onViewAll={openWorkouts} />
      {workouts.length === 0 ? (
        <EmptyState
          icon="activity"
          message="Tap + to create your first workout."
          onPress={createWorkout}
        />
      ) : (
        <ScrollView
          className="-mx-5"
          contentContainerClassName="gap-2 px-5"
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {workouts.map((workout) => (
            <Pressable
              className="overflow-hidden rounded-xl border border-border bg-card active:opacity-80"
              key={workout.title}
              onPress={openWorkouts}
              style={{ width: Math.max(108, (width - 56) / 3) }}
            >
              <Image className="h-24 w-full bg-muted" source={workout.image} />
              <View className="px-3 pb-3 pt-2.5">
                <Text className="font-inter-semibold text-[14px] text-foreground">
                  {workout.title}
                </Text>
                <Text
                  className="mt-1 font-inter text-[12px] text-muted-foreground"
                  numberOfLines={1}
                >
                  {workout.muscles}
                </Text>
                <View className="mt-2 flex-row justify-between">
                  <View className="flex-row items-center gap-1">
                    <FontAwesome6 color={muted} name="dumbbell" size={11} />
                    <Text className="font-inter text-[11px] text-muted-foreground">
                      {workout.exercises}
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-1">
                    <Feather color={muted} name="clock" size={12} />
                    <Text className="font-inter text-[11px] text-muted-foreground">
                      {workout.duration}
                    </Text>
                  </View>
                </View>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      )}

      <Pressable
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
  );
}
