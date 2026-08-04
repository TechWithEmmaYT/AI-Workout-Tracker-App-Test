import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { FlatList, Image, Pressable, Text, View } from "react-native";

import WeekCalendar from "@/components/home/week-calendar";
import SafeAreaScreen from "@/components/ui/safe-area-screen";
import { workoutHistory } from "@/constants/workout-history";
import { useAppThemeColor } from "@/theme/app-theme";

export default function HistoryPage() {
  const router = useRouter();
  const muted = useAppThemeColor("mutedForeground");

  return (
    <SafeAreaScreen edges={["top"]}>
      <FlatList
        contentContainerClassName="px-5 pb-6"
        data={workoutHistory}
        ItemSeparatorComponent={() => <View className="h-3" />}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View>
            <Text className="pt-3 font-inter-bold text-[24px] text-foreground">
              History
            </Text>
            <View>
              <WeekCalendar />
            </View>

            <View className="my-5 flex-row gap-3">
              <View className="flex-1 rounded-xl border border-border bg-card p-4">
                <Text className="font-inter text-[12px] text-muted-foreground">
                  Workouts
                </Text>
                <Text className="mt-2 font-inter-bold text-[20px] text-foreground">
                  3
                </Text>
              </View>
              <View className="flex-1 rounded-xl border border-border bg-card p-4">
                <Text className="font-inter text-[12px] text-muted-foreground">
                  Total Time
                </Text>
                <Text className="mt-2 font-inter-bold text-[20px] text-foreground">
                  2h 43m
                </Text>
              </View>
            </View>

            <Text className="mb-3 font-inter-bold text-[16px] text-foreground">
              Recent Workouts
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            className="flex-row items-center rounded-xl border border-border bg-card p-3 active:bg-muted"
            onPress={() =>
              router.push({
                pathname: "/history/[id]",
                params: { id: item.id },
              })
            }
          >
            <Image
              className="h-16 w-20 rounded-lg bg-muted"
              source={item.image}
            />
            <View className="ml-3 flex-1">
              <Text className="font-inter-semibold text-[14px] text-foreground">
                {item.title}
              </Text>
              <Text className="mt-1 font-inter text-[11.5px] text-muted-foreground">
                {item.date}
              </Text>
              <Text className="mt-1 font-inter text-[11.5px] text-muted-foreground">
                {item.exercises.length} exercises • {item.sets} sets •{" "}
                {item.duration}
              </Text>
            </View>
            <Feather color={muted} name="chevron-right" size={20} />
          </Pressable>
        )}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaScreen>
  );
}
