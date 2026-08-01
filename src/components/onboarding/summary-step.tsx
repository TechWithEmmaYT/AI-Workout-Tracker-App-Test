import { Feather, FontAwesome6 } from "@expo/vector-icons";
import type { ReactNode } from "react";
import { Text, View } from "react-native";

import type { OnboardingValues } from "@/lib/validation/onboarding-schema";
import { useAppThemeColor } from "@/theme/app-theme";

type SummaryStepProps = {
  values: OnboardingValues;
};

type SummaryRowProps = {
  bordered?: boolean;
  icon: ReactNode;
  label: string;
  value: string;
};

const genderLabels: Record<OnboardingValues["gender"], string> = {
  female: "Female",
  male: "Male",
};

const goalLabels: Record<OnboardingValues["goal"], string> = {
  "build-muscle": "Build Muscle",
  "lose-fat": "Lose Fat",
  maintain: "Maintain",
};

const experienceLabels: Record<OnboardingValues["experience"], string> = {
  advanced: "Advanced",
  beginner: "Beginner",
  intermediate: "Intermediate",
};

const genderIcons: Record<OnboardingValues["gender"], "mars" | "venus"> = {
  female: "venus",
  male: "mars",
};

const goalIcons: Record<
  OnboardingValues["goal"],
  "dumbbell" | "fire-flame-simple" | "scale-balanced"
> = {
  "build-muscle": "dumbbell",
  "lose-fat": "fire-flame-simple",
  maintain: "scale-balanced",
};

function SummaryRow({ bordered = true, icon, label, value }: SummaryRowProps) {
  return (
    <View
      className={`min-h-[72px] flex-row items-center ${
        bordered ? "border-b border-border" : ""
      }`}
    >
      <View className="h-10 w-10 items-center justify-center">{icon}</View>
      <Text className="ml-3 flex-1 font-inter-semibold text-[15px] text-foreground">
        {label}
      </Text>
      <Text className="font-inter-medium text-[14px] text-muted-foreground">
        {value}
      </Text>
    </View>
  );
}

export default function SummaryStep({ values }: SummaryStepProps) {
  const primary = useAppThemeColor("primary");
  const warning = useAppThemeColor("warning");

  return (
    <View className="flex-1">
      <Text
        accessibilityRole="header"
        className="mt-6 font-inter-bold text-[28px] leading-9 tracking-[-0.6px] text-foreground"
      >
        Almost there!
      </Text>
      <Text className="mt-2 font-inter text-[15px] leading-6 text-muted-foreground">
        Here&apos;s your summary
      </Text>

      <View className="mt-7 rounded-xl border border-border bg-background px-4">
        <SummaryRow
          icon={
            <FontAwesome6
              color={primary}
              name={genderIcons[values.gender]}
              size={27}
            />
          }
          label="Gender"
          value={genderLabels[values.gender]}
        />
        <SummaryRow
          icon={
            <FontAwesome6
              color={warning}
              name={goalIcons[values.goal]}
              size={25}
            />
          }
          label="Goal"
          value={goalLabels[values.goal]}
        />
        <SummaryRow
          bordered={false}
          icon={<Feather color={primary} name="star" size={28} />}
          label="Experience"
          value={experienceLabels[values.experience]}
        />
      </View>

      <View className="mt-7 flex-row items-center rounded-xl bg-accent px-5 py-5">
        <Feather color={primary} name="zap" size={28} />
        <Text className="ml-4 flex-1 font-inter-medium text-[14px] leading-6 text-accent-foreground">
          We&apos;ll use this information to personalize your experience and
          recommendations.
        </Text>
      </View>
    </View>
  );
}
