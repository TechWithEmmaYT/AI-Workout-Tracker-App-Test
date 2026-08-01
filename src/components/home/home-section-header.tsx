import { Pressable, Text, View } from "react-native";

type HomeSectionHeaderProps = {
  onViewAll: () => void;
  title: string;
};

export default function HomeSectionHeader({
  onViewAll,
  title,
}: HomeSectionHeaderProps) {
  return (
    <View className="mb-2 flex-row items-center justify-between">
      <Text className="font-inter-bold text-[16px] tracking-[-0.2px] text-foreground">
        {title}
      </Text>
      <Pressable
        accessibilityLabel={`View all ${title.toLowerCase()}`}
        accessibilityRole="button"
        className="h-7 justify-center px-1"
        hitSlop={8}
        onPress={onViewAll}
      >
        <Text className="font-inter-semibold text-[11px] text-primary">
          View All
        </Text>
      </Pressable>
    </View>
  );
}
