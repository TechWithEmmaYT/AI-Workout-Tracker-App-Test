import { FontAwesome6 } from "@expo/vector-icons";
import { Text, View } from "react-native";

import OnboardingOptionCard from "@/components/onboarding/onboarding-option-card";
import type { OnboardingGoal } from "@/lib/validation/onboarding-schema";
import { useAppThemeColor } from "@/theme/app-theme";

type GoalStepProps = {
  onChange: (value: OnboardingGoal) => void;
  value: OnboardingGoal;
};

const goalOptions = [
  {
    icon: "dumbbell",
    label: "Build Muscle",
    value: "build-muscle",
  },
  {
    icon: "fire-flame-simple",
    label: "Lose Fat",
    value: "lose-fat",
  },
  {
    icon: "scale-balanced",
    label: "Maintain",
    value: "maintain",
  },
] as const;

export default function GoalStep({ onChange, value }: GoalStepProps) {
  const foreground = useAppThemeColor("foreground");
  const primary = useAppThemeColor("primary");

  return (
    <View className="flex-1">
      <Text
        accessibilityRole="header"
        className="mt-6 max-w-72 font-inter-bold text-[28px] leading-9 tracking-[-0.6px] text-foreground"
      >
        What&apos;s your goal?
      </Text>
      <Text className="mt-2 max-w-72 font-inter text-[15px] leading-6 text-muted-foreground">
        Choose the goal that matters most to you.
      </Text>

      <View accessibilityRole="radiogroup" className="mt-8 gap-4">
        {goalOptions.map((option) => {
          const selected = value === option.value;

          return (
            <OnboardingOptionCard
              key={option.value}
              icon={
                <FontAwesome6
                  color={selected ? primary : foreground}
                  name={option.icon}
                  size={27}
                />
              }
              label={option.label}
              onPress={() => onChange(option.value)}
              selected={selected}
            />
          );
        })}
      </View>
    </View>
  );
}
