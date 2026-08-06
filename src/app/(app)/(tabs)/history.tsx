import { Feather } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { isSameDay, startOfDay } from "date-fns";
import { useRouter } from "expo-router";
import { useState } from "react";
import { FlatList, Image, Pressable, Text, View } from "react-native";

import EmptyState from "@/components/ui/empty-state";
import ErrorState from "@/components/ui/error-state";
import SafeAreaScreen from "@/components/ui/safe-area-screen";
import Skeleton from "@/components/ui/skeleton";
import WeekCalendar from "@/components/week-calendar";
import type { HistoryItem } from "@/lib/api";
import { getHistoryQueryFn } from "@/lib/api";
import { formatDuration, formatSessionDate } from "@/lib/format";
import { useAppThemeColor } from "@/theme/app-theme";

export default function HistoryPage() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const {
    data = [],
    isError,
    isPending,
    refetch,
  } = useQuery({
    queryKey: ["history"],
    queryFn: getHistoryQueryFn,
  });

  // Show everything by default; filter to the picked day when one is selected
  const filtered = selectedDate
    ? data.filter((item) => isSameDay(new Date(item.completedAt), selectedDate))
    : data;

  const totalSeconds = filtered.reduce(
    (sum, item) => sum + item.durationSeconds,
    0,
  );

  return (
    <SafeAreaScreen edges={["top"]}>
      <FlatList
        contentContainerClassName="px-5 pb-6"
        data={isPending ? [] : filtered}
        ItemSeparatorComponent={() => <View className="h-3" />}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          isPending ? (
            <HistorySkeleton />
          ) : isError ? (
            <ErrorState message="Could not load history" onRetry={refetch} />
          ) : (
            <EmptyState
              icon="calendar"
              message={
                selectedDate
                  ? "No workouts on this day."
                  : "No workouts yet. Complete a workout to see it here."
              }
            />
          )
        }
        ListHeaderComponent={
          <View>
            <Text className="pt-3 font-inter-bold text-[24px] text-foreground">
              History
            </Text>
            <View>
              <WeekCalendar
                onChange={setSelectedDate}
                value={selectedDate ?? startOfDay(new Date())}
              />
            </View>

            <View className="my-5 flex-row gap-3">
              {isPending ? (
                <>
                  <Skeleton className="h-20 flex-1 rounded-xl" />
                  <Skeleton className="h-20 flex-1 rounded-xl" />
                </>
              ) : (
                <>
                  <SummaryCard
                    label="Workouts"
                    value={String(filtered.length)}
                  />
                  <SummaryCard
                    label="Total Time"
                    value={formatDuration(totalSeconds)}
                  />
                </>
              )}
            </View>

            <View className="mb-3 flex-row items-center justify-between">
              <Text className="font-inter-bold text-[16px] text-foreground">
                Recent Workouts
              </Text>
              {selectedDate && (
                <Pressable
                  accessibilityRole="button"
                  className="rounded-full border border-border bg-card px-3 py-1.5 active:bg-muted"
                  onPress={() => setSelectedDate(null)}
                >
                  <Text className="font-inter-medium text-[11px] text-primary">
                    All Workouts
                  </Text>
                </Pressable>
              )}
            </View>
          </View>
        }
        renderItem={({ item }) => (
          <HistoryCard
            item={item}
            onPress={() =>
              router.push({
                pathname: "/(app)/(modal)/history/[id]",
                params: { id: item.id },
              })
            }
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaScreen>
  );
}

function SummaryCard({ label, value }: { label: string; value: string }) {
  return (
    <View className="flex-1 rounded-xl border border-border bg-card p-4">
      <Text className="font-inter text-[12px] text-muted-foreground">
        {label}
      </Text>
      <Text className="mt-2 font-inter-bold text-[20px] text-foreground">
        {value}
      </Text>
    </View>
  );
}

function HistoryCard({
  item,
  onPress,
}: {
  item: HistoryItem;
  onPress: () => void;
}) {
  const muted = useAppThemeColor("mutedForeground");

  return (
    <Pressable
      className="flex-row items-center rounded-xl border border-border bg-card p-3 active:bg-muted"
      onPress={onPress}
    >
      {item.image ? (
        <Image
          className="h-16 w-20 rounded-lg bg-muted"
          resizeMode="cover"
          source={{ uri: item.image }}
        />
      ) : (
        <View className="h-16 w-20 items-center justify-center rounded-lg bg-muted">
          <Feather color={muted} name="image" size={20} />
        </View>
      )}
      <View className="ml-3 flex-1">
        <Text className="font-inter-semibold text-[14px] text-foreground">
          {item.workoutName}
        </Text>
        <Text className="mt-1 font-inter text-[11.5px] text-muted-foreground">
          {formatSessionDate(item.completedAt)}
        </Text>
        <Text className="mt-1 font-inter text-[11.5px] text-muted-foreground">
          {item.exerciseCount} exercises • {item.setCount} sets •{" "}
          {formatDuration(item.durationSeconds)}
        </Text>
      </View>
      <Feather color={muted} name="chevron-right" size={20} />
    </Pressable>
  );
}

function HistorySkeleton() {
  return (
    <View>
      {Array.from({ length: 4 }).map((_, index) => (
        <Skeleton className="mb-3 h-24 w-full rounded-xl" key={index} />
      ))}
    </View>
  );
}
