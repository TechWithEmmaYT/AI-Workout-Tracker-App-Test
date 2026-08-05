import { Feather } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useState } from "react";
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
import { getWorkoutsQueryFn } from "@/lib/api";
import { useAppThemeColor } from "@/theme/app-theme";

export default function WorkoutsPage() {
  const router = useRouter();
  const mutedForeground = useAppThemeColor("mutedForeground");
  const primary = useAppThemeColor("primary");
  const [query, setQuery] = useState("");
  const {
    data: workouts = [],
    isError,
    isPending,
    isRefetching,
    refetch,
  } = useQuery({
    queryFn: () => getWorkoutsQueryFn(),
    queryKey: ["workouts"],
  });

  const search = query.trim().toLowerCase();
  const filteredWorkouts = workouts.filter(
    ({ muscles, name }) =>
      name.toLowerCase().includes(search) ||
      muscles.toLowerCase().includes(search),
  );

  return (
    <SafeAreaScreen edges={["top"]}>
      <FlatList
        contentContainerClassName="px-5 pb-24"
        data={filteredWorkouts}
        ItemSeparatorComponent={() => <View className="h-3" />}
        keyboardDismissMode="on-drag"
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          isPending ? (
            <View className="gap-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton className="h-24 rounded-xl" key={index} />
              ))}
            </View>
          ) : (
            <View className="items-center py-16">
              <Feather
                color={mutedForeground}
                name={isError ? "wifi-off" : "activity"}
                size={28}
              />
              <Text className="mt-3 font-inter-semibold text-foreground">
                {isError ? "Could not load workouts" : "No workouts found"}
              </Text>
            </View>
          )
        }
        ListHeaderComponent={
          <View className="pb-5 pt-3">
            <Text className="font-inter-bold text-[24px] tracking-[-0.5px] text-foreground">
              My Workouts
            </Text>

            <View className="mt-5 h-12 flex-row items-center rounded-xl border border-input-border bg-muted px-4">
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
            accessibilityLabel={`${item.name}, ${item.exerciseCount} exercises`}
            accessibilityRole="button"
            className="flex-row items-center rounded-xl border border-border bg-card p-3 active:bg-muted"
            onPress={() =>
              router.push({
                pathname: "/workouts/[id]",
                params: { id: item.id },
              })
            }
          >
            {item.image ? (
              <Image
                className="h-[72px] w-[82px] rounded-lg bg-muted"
                resizeMode="cover"
                source={{ uri: item.image }}
              />
            ) : (
              <View className="h-[72px] w-[82px] items-center justify-center rounded-lg bg-muted">
                <Feather color={mutedForeground} name="image" size={22} />
              </View>
            )}
            <View className="ml-3 flex-1">
              <Text
                className="font-inter-semibold text-[15px] text-foreground"
                numberOfLines={1}
              >
                {item.name}
              </Text>
              <Text
                className="mt-1 font-inter capitalize text-[11.5px] text-muted-foreground"
                numberOfLines={1}
              >
                {item.muscles}
              </Text>
              <Text
                className="mt-2 font-inter text-[11.5px] text-muted-foreground"
                numberOfLines={1}
              >
                {item.exerciseCount} exercises • {item.totalSets} sets
              </Text>
            </View>
            <Feather color={mutedForeground} name="chevron-right" size={20} />
          </Pressable>
        )}
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
      <Pressable
        accessibilityLabel="Create workout"
        accessibilityRole="button"
        className="absolute bottom-5 right-5 h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg active:opacity-80"
        onPress={() => router.push("/workout/create")}
      >
        <Feather color="white" name="plus" size={27} />
      </Pressable>
    </SafeAreaScreen>
  );
}
