import { Feather } from "@expo/vector-icons";
import type { ReactNode } from "react";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeInRight } from "react-native-reanimated";

import { cn } from "@/lib/utils";
import { useAppThemeColor } from "@/theme/app-theme";

type OnboardingOptionCardProps = {
  delay?: number;
  description?: string;
  icon: ReactNode;
  label: string;
  onPress: () => void;
  selected: boolean;
};

export default function OnboardingOptionCard({
  delay = 0,
  description,
  icon,
  label,
  onPress,
  selected,
}: OnboardingOptionCardProps) {
  const primaryForeground = useAppThemeColor("primaryForeground");

  return (
    <Animated.View entering={FadeInRight.delay(delay).duration(250)}>
      <Pressable
        accessibilityLabel={description ? `${label}, ${description}` : label}
        accessibilityRole="radio"
        accessibilityState={{ checked: selected }}
        className={cn(
          "min-h-20 flex-row items-center rounded-xl border bg-card px-5 py-4",
          selected ? "border-primary" : "border-border",
        )}
        onPress={onPress}
      >
        <View
          accessibilityElementsHidden
          className="h-10 w-10 items-center justify-center"
          importantForAccessibility="no-hide-descendants"
        >
          {icon}
        </View>

        <View className="ml-4 flex-1">
          <Text
            className={cn(
              "font-inter-semibold text-[15px] leading-5",
              selected ? "text-primary" : "text-foreground",
            )}
          >
            {label}
          </Text>
          {description ? (
            <Text className="mt-1 font-inter text-[13px] leading-5 text-muted-foreground">
              {description}
            </Text>
          ) : null}
        </View>

        {selected ? (
          <View className="h-6 w-6 items-center justify-center rounded-full bg-primary">
            <Feather color={primaryForeground} name="check" size={15} />
          </View>
        ) : (
          <View className="h-6 w-6 rounded-full border-2 border-input-border" />
        )}
      </Pressable>
    </Animated.View>
  );
}
