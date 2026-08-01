import { Pressable, Text } from "react-native";

type MuscleFilterChipProps = {
  isSelected: boolean;
  label: string;
  onPress: () => void;
};

export default function MuscleFilterChip({
  isSelected,
  label,
  onPress,
}: MuscleFilterChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: isSelected }}
      className={
        isSelected
          ? "min-h-11 justify-center rounded-full bg-primary px-4 active:bg-primary-hover"
          : "min-h-11 justify-center rounded-full border border-border bg-background px-4 active:bg-muted"
      }
      onPress={onPress}
    >
      <Text
        className={
          isSelected
            ? "font-inter-semibold text-[12px] text-primary-foreground"
            : "font-inter-medium text-[12px] text-muted-foreground"
        }
      >
        {label}
      </Text>
    </Pressable>
  );
}
