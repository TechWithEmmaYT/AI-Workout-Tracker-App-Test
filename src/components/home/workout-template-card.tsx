import type { ImageSourcePropType } from "react-native";
import { Image, Pressable, Text, View } from "react-native";

type WorkoutTemplateCardProps = {
  image: ImageSourcePropType;
  onPress: () => void;
  title: string;
  workouts: number;
};

export default function WorkoutTemplateCard({
  image,
  onPress,
  title,
  workouts,
}: WorkoutTemplateCardProps) {
  return (
    <Pressable
      accessibilityLabel={`${title}, ${workouts} workouts`}
      accessibilityRole="button"
      className="h-[116px] w-[104px] overflow-hidden rounded-xl 
      bg-muted active:opacity-85"
      onPress={onPress}
    >
      <Image
        accessibilityLabel=""
        className="absolute inset-0 h-full w-full"
        resizeMode="cover"
        source={image}
      />
      <View className="absolute inset-x-0 bottom-0 bg-overlay/70 px-2.5 pb-2.5 pt-6">
        <Text className="font-inter-semibold text-[12px] text-white">
          {title}
        </Text>
        <Text className="mt-0.5 font-inter text-[10px] text-white/80">
          {workouts} Workouts
        </Text>
      </View>
    </Pressable>
  );
}
