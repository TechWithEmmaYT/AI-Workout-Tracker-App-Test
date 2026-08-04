import { FontAwesome6 } from "@expo/vector-icons";
import { Text, View } from "react-native";

import OnboardingOptionCard from "@/components/onboarding/onboarding-option-card";
import type { OnboardingGender } from "@/lib/validation/onboarding-schema";
import { useAppThemeColor } from "@/theme/app-theme";

type GenderStepProps = {
  onChange: (value: OnboardingGender) => void;
  value?: OnboardingGender;
};

const genderOptions = [
  {
    icon: "mars",
    label: "Male",
    value: "male",
  },
  {
    icon: "venus",
    label: "Female",
    value: "female",
  },
] as const;

export default function GenderStep({ onChange, value }: GenderStepProps) {
  const foreground = useAppThemeColor("foreground");
  const primary = useAppThemeColor("primary");

  return (
    <View className="flex-1">
      <View>
        <Text
          accessibilityRole="header"
          className="mt-6 max-w-72 font-inter-bold text-[28px] leading-9 tracking-[-0.6px] text-foreground"
        >
          What&apos;s your gender?
        </Text>
        <Text className="mt-2 max-w-72 font-inter text-[15px] leading-6 text-muted-foreground">
          This helps us personalize your experience.
        </Text>
      </View>

      <View accessibilityRole="radiogroup" className="mt-8 gap-4">
        {genderOptions.map((option, index) => {
          const selected = value === option.value;

          return (
            <OnboardingOptionCard
              key={option.value}
              delay={(index + 1) * 80}
              icon={
                <FontAwesome6
                  color={selected ? primary : foreground}
                  name={option.icon}
                  size={31}
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
