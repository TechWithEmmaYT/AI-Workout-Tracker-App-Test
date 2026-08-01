import { Text, View } from "react-native";
import Svg, { Circle } from "react-native-svg";

import { useAppThemeColor } from "@/theme/app-theme";

type WorkoutProgressRingProps = {
  completed: number;
  total: number;
};

const SIZE = 148;
const STROKE_WIDTH = 10;
const RADIUS = (SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function WorkoutProgressRing({
  completed,
  total,
}: WorkoutProgressRingProps) {
  const border = useAppThemeColor("border");
  const primary = useAppThemeColor("primary");
  const progress = total === 0 ? 0 : Math.min(completed / total, 1);

  return (
    <View
      accessibilityLabel={`${completed} of ${total} workouts completed this week`}
      className="h-[148px] w-[148px] items-center justify-center"
    >
      <Svg
        accessibilityElementsHidden
        height={SIZE}
        importantForAccessibility="no-hide-descendants"
        width={SIZE}
      >
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          fill="none"
          r={RADIUS}
          stroke={border}
          strokeWidth={STROKE_WIDTH}
        />
        <Circle
          cx={SIZE / 2}
          cy={SIZE / 2}
          fill="none"
          origin={`${SIZE / 2}, ${SIZE / 2}`}
          r={RADIUS}
          rotation={-90}
          stroke={primary}
          strokeDasharray={`${CIRCUMFERENCE * progress} ${CIRCUMFERENCE}`}
          strokeLinecap="round"
          strokeWidth={STROKE_WIDTH}
        />
      </Svg>

      <View className="absolute inset-0 items-center justify-center">
        <Text className="font-inter-bold text-[22px] tracking-[-0.5px] text-foreground">
          {completed} / {total}
        </Text>
        <Text className="mt-1 text-center font-inter text-[10px] leading-[14px] text-muted-foreground">
          Workouts Completed{"\n"}This Week
        </Text>
      </View>
    </View>
  );
}
