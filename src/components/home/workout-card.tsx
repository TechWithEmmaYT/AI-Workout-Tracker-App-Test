import { Feather } from "@expo/vector-icons";
import type { ImageSourcePropType } from "react-native";
import { Image, Pressable, Text, View } from "react-native";

import { useAppThemeColor } from "@/theme/app-theme";

export type WorkoutCardData = {
  duration: string;
  exercises: number;
  image: ImageSourcePropType;
  muscles: string;
  sets: number;
  title: string;
};

type WorkoutCardProps = WorkoutCardData & {
  onPress: () => void;
};

export default function WorkoutCard({
  duration,
  exercises,
  image,
  muscles,
  onPress,
  sets,
  title,
}: WorkoutCardProps) {
  const mutedForeground = useAppThemeColor("mutedForeground");

  return (
    <Pressable
      accessibilityLabel={`${title}, ${exercises} exercises, ${duration}`}
      accessibilityRole="button"
      className="w-36 overflow-hidden rounded-xl border border-border bg-background active:opacity-85"
      onPress={onPress}
    >
      <Image
        accessibilityLabel=""
        className="h-24 w-full bg-muted"
        resizeMode="cover"
        source={image}
      />
      <View className="px-3 pb-3 pt-2.5">
        <Text className="font-inter-semibold text-[14px] text-foreground">
          {title}
        </Text>
        <Text
          className="mt-1 font-inter text-[12px] leading-4 text-muted-foreground"
          numberOfLines={1}
        >
          {muscles}
        </Text>
        <View className="mt-2 flex-row items-center gap-1.5 justify-between">
          <View className="flex-row items-center gap-1">
            <Feather color={mutedForeground} name="activity" size={12} />
            <Text className="font-inter text-[11px] text-muted-foreground">
              {exercises}
            </Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Feather color={mutedForeground} name="layers" size={12} />
            <Text className="font-inter text-[11px] text-muted-foreground">
              {sets}
            </Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Feather color={mutedForeground} name="clock" size={12} />
            <Text className="font-inter text-[11px] text-muted-foreground">
              {duration}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}
