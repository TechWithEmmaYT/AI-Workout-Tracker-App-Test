import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { Alert, FlatList, Text, TextInput, View } from "react-native";

import ExerciseRow from "@/components/discover/exercise-row";
import MuscleFilterChip from "@/components/discover/muscle-filter-chip";
import HomeSectionHeader from "@/components/home/home-section-header";
import WorkoutTemplateCard from "@/components/home/workout-template-card";
import Screen from "@/components/ui/screen";
import { exercises } from "@/lib/exercises";
import type { Exercise } from "@/lib/exercises";
import { useAppThemeColor } from "@/theme/app-theme";

const workoutImages = {
  legs: require("../../../../assets/images/workouts/leg-day.png"),
  pull: require("../../../../assets/images/workouts/pull-day.png"),
  push: require("../../../../assets/images/workouts/push-day.png"),
};

const templates = [
  { image: workoutImages.pull, title: "Upper Body", workouts: 12 },
  { image: workoutImages.legs, title: "Lower Body", workouts: 10 },
  { image: workoutImages.push, title: "Full Body", workouts: 14 },
] as const;

const muscleFilters = [
  "All",
  "Chest",
  "Back",
  "Legs",
  "Shoulders",
  "Arms",
] as const;

type MuscleFilter = (typeof muscleFilters)[number];

export default function DiscoverPage() {
  const router = useRouter();
  const foreground = useAppThemeColor("foreground");
  const mutedForeground = useAppThemeColor("mutedForeground");
  const [query, setQuery] = useState("");
  const [selectedMuscle, setSelectedMuscle] = useState<MuscleFilter>("All");

  const filteredExercises = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();

    return exercises.filter((exercise) => {
      const matchesMuscle =
        selectedMuscle === "All" ||
        exercise.muscleGroups.includes(selectedMuscle);
      const matchesQuery =
        normalizedQuery.length === 0 ||
        exercise.name.toLowerCase().includes(normalizedQuery) ||
        exercise.muscles.toLowerCase().includes(normalizedQuery);

      return matchesMuscle && matchesQuery;
    });
  }, [query, selectedMuscle]);

  const openExercise = (exercise: Exercise) => {
    router.push({
      pathname: "/(app)/exercise/[id]",
      params: { id: exercise.id },
    });
  };

  const showAllTemplates = () => {
    Alert.alert(
      "Workout templates",
      "The full template library will be connected next.",
    );
  };

  return (
    <Screen edges={["top"]}>
      <FlatList
        contentContainerClassName="px-5 pb-6"
        data={filteredExercises}
        ItemSeparatorComponent={() => <View className="h-px bg-border" />}
        keyboardDismissMode="on-drag"
        keyboardShouldPersistTaps="handled"
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <View className="items-center px-6 py-12">
            <View className="h-14 w-14 items-center justify-center rounded-full bg-muted">
              <Feather color={mutedForeground} name="search" size={24} />
            </View>
            <Text className="mt-4 font-inter-semibold text-[15px] text-foreground">
              No exercises found
            </Text>
            <Text className="mt-1 text-center font-inter text-[12px] leading-5 text-muted-foreground">
              Try another search or muscle group.
            </Text>
          </View>
        }
        ListHeaderComponent={
          <View>
            <Text
              accessibilityRole="header"
              className="pb-4 pt-3 font-inter-bold text-[24px] tracking-[-0.5px] text-foreground"
            >
              Discover
            </Text>

            <View className="h-12 flex-row items-center rounded-xl bg-muted px-4">
              <Feather color={mutedForeground} name="search" size={19} />
              <TextInput
                accessibilityLabel="Search templates and exercises"
                className="ml-3 flex-1 font-inter text-[13px] text-foreground"
                onChangeText={setQuery}
                placeholder="Search templates, exercises..."
                placeholderTextColor={mutedForeground}
                returnKeyType="search"
                selectionColor={foreground}
                value={query}
              />
            </View>

            <View className="mt-5">
              <HomeSectionHeader
                onViewAll={showAllTemplates}
                title="Workout Templates"
              />
              <FlatList
                className="-mx-5"
                contentContainerClassName="gap-3 px-5"
                data={templates}
                horizontal
                keyExtractor={(item) => item.title}
                renderItem={({ item }) => (
                  <WorkoutTemplateCard {...item} onPress={showAllTemplates} />
                )}
                showsHorizontalScrollIndicator={false}
              />
            </View>

            <View className="mt-5">
              <Text className="mb-3 font-inter-bold text-[16px] text-foreground">
                Muscle Groups
              </Text>
              <FlatList
                className="-mx-5"
                contentContainerClassName="gap-2 px-5"
                data={muscleFilters}
                extraData={selectedMuscle}
                horizontal
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <MuscleFilterChip
                    isSelected={selectedMuscle === item}
                    label={item}
                    onPress={() => setSelectedMuscle(item)}
                  />
                )}
                showsHorizontalScrollIndicator={false}
              />
            </View>

            <Text className="mb-3 mt-5 font-inter-bold text-[16px] text-foreground">
              Exercises
            </Text>
          </View>
        }
        renderItem={({ index, item }) => (
          <ExerciseRow
            exercise={item}
            isFirst={index === 0}
            isLast={index === filteredExercises.length - 1}
            onPress={() => openExercise(item)}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </Screen>
  );
}
