import { Feather } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useDeferredValue, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  Text,
  TextInput,
  View,
} from "react-native";

import SafeAreaScreen from "@/components/ui/safe-area-screen";
import Skeleton from "@/components/ui/skeleton";
import { useWorkoutDraft } from "@/contexts/workout-draft-context";
import { apiURL, authClient } from "@/lib/auth-client";
import { useAppThemeColor } from "@/theme/app-theme";

type Exercise = {
  id: string;
  image: string | null;
  muscles: string;
  name: string;
};

const getExercises = async (search: string): Promise<Exercise[]> => {
  const query = search ? `?search=${encodeURIComponent(search)}` : "";
  const response = await fetch(`${apiURL}/api/exercises${query}`, {
    credentials: "omit",
    headers: { Cookie: authClient.getCookie() },
  });
  if (!response.ok) throw new Error("Could not load exercises");
  return response.json();
};

export default function ExerciseListPage() {
  const router = useRouter();
  const muted = useAppThemeColor("mutedForeground");
  const primary = useAppThemeColor("primary");

  const [query, setQuery] = useState("");

  const search = useDeferredValue(query.trim());
  const [selected, setSelected] = useWorkoutDraft();
  const {
    data: exercises = [],
    isError,
    isPending,
    isRefetching,
    refetch,
  } = useQuery({
    queryFn: () => getExercises(search),
    queryKey: ["exercises", search],
    staleTime: Infinity,
  });
  const toggleExercise = (exercise: Exercise) =>
    setSelected((current) =>
      current.some(({ id }) => id === exercise.id)
        ? current.filter(({ id }) => id !== exercise.id)
        : [...current, { ...exercise, reps: 10, rest: 90, sets: 3 }],
    );

  return (
    <SafeAreaScreen>
      <FlatList
        contentContainerClassName="px-5 pb-8"
        data={exercises}
        keyboardShouldPersistTaps="handled"
        keyExtractor={({ id }) => id}
        ListEmptyComponent={
          isPending ? (
            <View>
              {Array.from({ length: 4 }).map((_, index) => (
                <View
                  className="h-[72px] flex-row items-center border-b border-border"
                  key={index}
                >
                  <Skeleton className="h-12 w-14 rounded-lg" />
                  <View className="ml-3 flex-1 gap-2">
                    <Skeleton className="h-3.5 w-2/3" />
                    <Skeleton className="h-3 w-1/2" />
                  </View>
                  <Skeleton className="h-5 w-5 rounded-full" />
                </View>
              ))}
            </View>
          ) : (
            <View className="items-center py-16">
              <Feather
                color={muted}
                name={isError ? "wifi-off" : "activity"}
                size={27}
              />
              <Text className="mt-3 font-inter text-[13px] text-muted-foreground">
                {isError ? "Could not load exercises" : "No exercises found"}
              </Text>
              {isError && (
                <Pressable className="mt-3" onPress={() => refetch()}>
                  <Text className="font-inter-semibold text-[13px] text-primary">
                    Try Again
                  </Text>
                </Pressable>
              )}
            </View>
          )
        }
        ListHeaderComponent={
          <View>
            <View className="h-14 flex-row items-center justify-between">
              <Pressable
                accessibilityLabel="Go back"
                className="h-11 w-11 items-center justify-center"
                onPress={router.back}
              >
                <Feather color={muted} name="arrow-left" size={23} />
              </Pressable>
              <Text className="font-inter-bold text-[17px] text-foreground">
                Add Exercises
              </Text>
              <Pressable className="h-11 justify-center" onPress={router.back}>
                <Text className="font-inter-semibold text-[13px] text-primary">
                  Done
                </Text>
              </Pressable>
            </View>

            <View className="mb-3 mt-3 h-12 flex-row items-center rounded-xl bg-muted px-4">
              <Feather color={muted} name="search" size={18} />
              <TextInput
                accessibilityLabel="Search exercises"
                className="ml-3 flex-1 font-inter text-[13px] text-foreground"
                onChangeText={setQuery}
                placeholder="Search exercises..."
                placeholderTextColor={muted}
                selectionColor={primary}
                value={query}
              />
            </View>

            <Text className="mb-2 font-inter text-[12px] text-muted-foreground">
              {selected.length} selected
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const isSelected = selected.some(({ id }) => id === item.id);

          return (
            <View className="h-[72px] flex-row items-center border-b border-border">
              <Pressable
                accessibilityLabel={`View ${item.name} details`}
                className="flex-1 flex-row items-center"
                onPress={() =>
                  router.push({
                    pathname: "/workout/exercises/[id]",
                    params: { id: item.id },
                  })
                }
              >
                {item.image ? (
                  <View className="h-[60px] w-[70px] rounded-lg bg-muted">
                    <Image
                      className="size-full rounded-lg"
                      source={{ uri: item.image }}
                    />
                  </View>
                ) : (
                  <View className="h-12 w-14 items-center justify-center rounded-lg bg-muted">
                    <Feather color={muted} name="image" size={18} />
                  </View>
                )}
                <View className="ml-3 flex-1">
                  <Text className="font-inter-semibold text-[13px] text-foreground">
                    {item.name}
                  </Text>
                  <Text className="mt-1 font-inter text-[11.5px] capitalize text-muted-foreground">
                    {item.muscles} • View details
                  </Text>
                </View>
              </Pressable>
              <Pressable
                accessibilityRole="checkbox"
                accessibilityState={{ checked: isSelected }}
                className="h-11 w-11 items-end justify-center"
                onPress={() => toggleExercise(item)}
              >
                <Feather
                  color={isSelected ? primary : muted}
                  name={isSelected ? "check-circle" : "circle"}
                  size={22}
                />
              </Pressable>
            </View>
          );
        }}
        refreshControl={
          <RefreshControl
            colors={[primary]}
            onRefresh={() => refetch()}
            refreshing={isRefetching}
            tintColor={primary}
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaScreen>
  );
}
