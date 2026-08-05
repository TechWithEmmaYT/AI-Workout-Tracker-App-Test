import { Feather } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { Text, View } from "react-native";

import { useAppThemeColor } from "@/theme/app-theme";

type EmptyStateProps = {
  icon: ComponentProps<typeof Feather>["name"];
  message: string;
  onPress?: () => void;
};

export default function EmptyState({
  icon,
  message,
  onPress,
}: EmptyStateProps) {
  const muted = useAppThemeColor("mutedForeground");

  return (
    <View className="min-h-36 items-center justify-center rounded-2xl border border-border bg-card px-5 active:opacity-80">
      <View className="rounded-full">
        <Feather color={muted} name={icon} size={28} />
      </View>
      <Text className="mt-3 text-center font-inter text-[13px] text-muted-foreground">
        {message}
      </Text>
    </View>
  );
}
