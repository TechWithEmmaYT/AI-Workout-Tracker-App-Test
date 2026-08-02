import { Feather, FontAwesome6 } from "@expo/vector-icons";
import type { ImageSourcePropType } from "react-native";
import {
  Image,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import { useAppThemeColor } from "@/theme/app-theme";

export type WorkoutCardData = {
  duration: string;
  exercises: number;
  image: ImageSourcePropType;
  muscles: string;
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
  title,
}: WorkoutCardProps) {
  const { width } = useWindowDimensions();
  const mutedForeground = useAppThemeColor("mutedForeground");

  return (
    <Pressable
      accessibilityLabel={`${title}, ${exercises} exercises, ${duration}`}
      accessibilityRole="button"
      className="overflow-hidden rounded-xl border border-border bg-background active:opacity-80"
      onPress={onPress}
      style={{ width: Math.max(108, (width - 56) / 3) }}
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
        <View className="mt-2 flex-row items-center justify-between gap-1">
          <View className="flex-row items-center gap-1">
            <FontAwesome6 color={mutedForeground} name="dumbbell" size={11} />
            <Text className="font-inter text-[11px] text-muted-foreground">
              {exercises}
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
