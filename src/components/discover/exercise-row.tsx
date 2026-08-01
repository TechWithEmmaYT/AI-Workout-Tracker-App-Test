import { Feather } from "@expo/vector-icons";
import { Image, Pressable, Text, View } from "react-native";

import type { Exercise } from "@/lib/exercises";
import { cn } from "@/lib/utils";
import { useAppThemeColor } from "@/theme/app-theme";

type ExerciseRowProps = {
  exercise: Exercise;
  isFirst: boolean;
  isLast: boolean;
  onPress: () => void;
};

export default function ExerciseRow({
  exercise,
  isFirst,
  isLast,
  onPress,
}: ExerciseRowProps) {
  const mutedForeground = useAppThemeColor("mutedForeground");

  return (
    <Pressable
      accessibilityLabel={`${exercise.name}, ${exercise.muscles}`}
      accessibilityRole="button"
      className={cn(
        "min-h-[76px] flex-row items-center border-x border-border bg-background px-3 py-2.5 active:bg-muted",
        isFirst && "rounded-t-xl border-t",
        isLast && "rounded-b-xl border-b",
      )}
      onPress={onPress}
    >
      <Image
        accessibilityLabel=""
        className="h-14 w-16 rounded-lg bg-muted"
        resizeMode="cover"
        source={exercise.image}
      />

      <View className="ml-3 flex-1">
        <Text
          className="font-inter-semibold text-[14px] text-foreground"
          numberOfLines={1}
        >
          {exercise.name}
        </Text>
        <Text className="mt-1 font-inter text-[12px] text-muted-foreground">
          {exercise.muscles}
        </Text>
      </View>

      <View className="h-11 w-11 items-center justify-center">
        <Feather color={mutedForeground} name="chevron-right" size={21} />
      </View>
    </Pressable>
  );
}
