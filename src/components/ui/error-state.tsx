import { Feather } from "@expo/vector-icons";
import type { ComponentProps } from "react";
import { Text, View } from "react-native";

import Button from "@/components/ui/button";
import { useAppThemeColor } from "@/theme/app-theme";

type ErrorStateProps = {
  icon?: ComponentProps<typeof Feather>["name"];
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
};

export default function ErrorState({
  icon = "wifi-off",
  message,
  onRetry,
  retryLabel = "Try Again",
}: ErrorStateProps) {
  const muted = useAppThemeColor("mutedForeground");

  return (
    <View className="items-center py-16">
      <Feather color={muted} name={icon} size={28} />
      <Text className="mt-3 font-inter-semibold text-foreground">{message}</Text>
      {onRetry ? (
        <Button className="mt-5" onPress={onRetry} variant="outline">
          {retryLabel}
        </Button>
      ) : null}
    </View>
  );
}
