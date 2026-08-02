import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

import Screen from "@/components/ui/screen";
import { useAppThemeColor } from "@/theme/app-theme";

const images = {
  legs: require("../../../../assets/images/workouts/leg-day.png"),
  pull: require("../../../../assets/images/workouts/pull-day.png"),
  push: require("../../../../assets/images/workouts/push-day.png"),
};

const workouts = [
  {
    id: "push-day",
    title: "Push Day",
    muscles: "Chest • Shoulders • Triceps",
    details: "6 exercises • 18 sets • 50 min",
    image: images.push,
  },
  {
    id: "pull-day",
    title: "Pull Day",
    muscles: "Back • Biceps",
    details: "6 exercises • 18 sets • 55 min",
    image: images.pull,
  },
  {
    id: "leg-day",
    title: "Leg Day",
    muscles: "Quads • Hamstrings • Calves",
    details: "7 exercises • 18 sets • 60 min",
    image: images.legs,
  },
  {
    id: "pull-day2",
    title: "Pull Day",
    muscles: "Back • Biceps",
    details: "6 exercises • 18 sets • 55 min",
    image: images.pull,
  },
  {
    id: "leg-day2",
    title: "Leg Day",
    muscles: "Quads • Hamstrings • Calves",
    details: "7 exercises • 18 sets • 60 min",
    image: images.legs,
  },
  {
    id: "push-day2",
    title: "Push Day",
    muscles: "Chest • Shoulders • Triceps",
    details: "6 exercises • 18 sets • 50 min",
    image: images.push,
  },
  {
    id: "pull-day3",
    title: "Pull Day",
    muscles: "Back • Biceps",
    details: "6 exercises • 18 sets • 55 min",
    image: images.pull,
  },
] as const;

export default function WorkoutsPage() {
  const router = useRouter();
  const mutedForeground = useAppThemeColor("mutedForeground");
  const primary = useAppThemeColor("primary");
  const [query, setQuery] = useState("");

  const filteredWorkouts = useMemo(() => {
    const search = query.trim().toLowerCase();
    return workouts.filter(
      ({ muscles, title }) =>
        title.toLowerCase().includes(search) ||
        muscles.toLowerCase().includes(search),
    );
  }, [query]);

  return (
    <Screen edges={["top"]}>
      <FlatList
        contentContainerClassName="px-5 pb-6"
        data={filteredWorkouts}
        ItemSeparatorComponent={() => <View className="h-3" />}
        keyboardDismissMode="on-drag"
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View className="items-center py-16">
            <Feather color={mutedForeground} name="search" size={28} />
            <Text className="mt-3 font-inter-semibold text-foreground">
              No workouts found
            </Text>
          </View>
        }
        ListHeaderComponent={
          <View className="pb-5 pt-3">
            <View className="flex-row items-center justify-between">
              <Text className="font-inter-bold text-[24px] tracking-[-0.5px] text-foreground">
                My Workouts
              </Text>
              <Pressable
                accessibilityLabel="Create workout"
                accessibilityRole="button"
                className="h-11 w-11 items-center justify-center rounded-full bg-primary active:opacity-80"
                onPress={() => router.push("/(app)/workout/create")}
              >
                <Feather color="white" name="plus" size={24} />
              </Pressable>
            </View>

            <View className="mt-5 h-12 flex-row items-center rounded-xl bg-muted px-4
            border border-input-border
            ">
              <Feather color={mutedForeground} name="search" size={19} />
              <TextInput
                accessibilityLabel="Search workouts"
                className="ml-3 flex-1 font-inter text-[13px] text-foreground "
                onChangeText={setQuery}
                placeholder="Search workouts..."
                placeholderTextColor={mutedForeground}
                returnKeyType="search"
                selectionColor={primary}
                value={query}
              />
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            accessibilityLabel={`${item.title}, ${item.details}`}
            accessibilityRole="button"
            className="flex-row items-center rounded-xl border border-border bg-background p-3 active:bg-muted"
            onPress={() =>
              router.push({
                pathname: "/(app)/workout/[id]",
                params: { id: item.id },
              })
            }
          >
            <Image
              accessibilityLabel=""
              className="h-[72px] w-[82px] rounded-lg bg-muted"
              resizeMode="cover"
              source={item.image}
            />
            <View className="ml-3 flex-1">
              <Text
                className="font-inter-semibold text-[15px] text-foreground"
                numberOfLines={1}
              >
                {item.title}
              </Text>
              <Text
                className="mt-1 font-inter text-[12px] text-muted-foreground"
                numberOfLines={1}
              >
                {item.muscles}
              </Text>
              <Text
                className="mt-2 font-inter text-[11px] text-muted-foreground"
                numberOfLines={1}
              >
                {item.details}
              </Text>
            </View>
            <Feather color={mutedForeground} name="chevron-right" size={20} />
          </Pressable>
        )}
        showsVerticalScrollIndicator={false}
      />
    </Screen>
  );
}
