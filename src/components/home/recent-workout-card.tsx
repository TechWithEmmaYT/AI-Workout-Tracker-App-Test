import { Feather } from "@expo/vector-icons";
import { Image, Pressable, Text, View } from "react-native";
import type { ImageSourcePropType } from "react-native";

import { useAppThemeColor } from "@/theme/app-theme";

type RecentWorkoutCardProps = {
  date: string;
  image: ImageSourcePropType;
  onPress: () => void;
  summary: string;
  title: string;
};

export default function RecentWorkoutCard({
  date,
  image,
  onPress,
  summary,
  title,
}: RecentWorkoutCardProps) {
  const mutedForeground = useAppThemeColor("mutedForeground");

  return (
    <Pressable
      accessibilityLabel={`${title}, completed ${date}`}
      accessibilityRole="button"
      className="min-h-[88px] flex-row items-center rounded-xl border border-border bg-background p-3 active:opacity-85"
      onPress={onPress}
    >
      <Image
        accessibilityLabel=""
        className="h-16 w-20 rounded-lg bg-muted"
        resizeMode="cover"
        source={image}
      />
      <View className="ml-3 flex-1">
        <Text className="font-inter-semibold text-[14px] text-foreground">
          {title}
        </Text>
        <Text className="mt-1 font-inter text-[12px] text-muted-foreground">
          {date}
        </Text>
        <Text className="mt-1 font-inter text-[12px] text-muted-foreground">
          {summary}
        </Text>
      </View>
      <Feather color={mutedForeground} name="chevron-right" size={22} />
    </Pressable>
  );
}
