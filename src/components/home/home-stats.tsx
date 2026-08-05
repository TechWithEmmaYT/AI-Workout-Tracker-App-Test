import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { useAppThemeColor } from "@/theme/app-theme";

const stats = [
  { icon: "activity", label: "Workouts", value: "5" },
  { icon: "clock", label: "Time", value: "25h 30m" },
  { icon: "bar-chart-2", label: "Avg Time", value: "75 min" },
] as const;

export default function HomeStats() {
  const primary = useAppThemeColor("primary");

  return (
    <View className="mt-3 flex-row gap-2">
      {stats.map((stat) => (
        <View
          className="min-h-[112px] flex-1 rounded-2xl border border-border bg-card px-3 py-4 shadow-sm"
          key={stat.label}
        >
          <Text
            adjustsFontSizeToFit
            className="font-inter-bold text-[19px] tracking-[-0.4px] text-foreground"
            numberOfLines={1}
          >
            {stat.value}
          </Text>
          <Text className="mt-1 font-inter text-[11px] text-muted-foreground">
            {stat.label}
          </Text>
          <View className="mt-auto h-8 w-8 items-center justify-center rounded-full bg-accent dark:bg-accent/20">
            <Feather color={primary} name={stat.icon} size={16} />
          </View>
        </View>
      ))}
    </View>
  );
}
