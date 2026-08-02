import { Feather } from "@expo/vector-icons";
import { Text, View } from "react-native";

import { useAppThemeColor } from "@/theme/app-theme";

type HomeStatCardProps = {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: string;
};

export default function HomeStatCard({
  icon,
  label,
  value,
}: HomeStatCardProps) {
  const primary = useAppThemeColor("primary");

  return (
    <View className="min-h-[112px] flex-1 rounded-2xl border border-border bg-background px-3 py-4 shadow-sm">
      <Text
        adjustsFontSizeToFit
        className="font-inter-bold text-[19px] tracking-[-0.4px] text-foreground"
        numberOfLines={1}
      >
        {value}
      </Text>
      <Text className="mt-1 font-inter text-[11px] text-muted-foreground">
        {label}
      </Text>
      <View className="mt-auto h-8 w-8 items-center justify-center rounded-full bg-accent">
        <Feather color={primary} name={icon} size={16} />
      </View>
    </View>
  );
}
