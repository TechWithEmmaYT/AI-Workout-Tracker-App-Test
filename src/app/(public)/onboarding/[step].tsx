import { Feather } from "@expo/vector-icons";
import { Redirect, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, View } from "react-native";

import ExperienceStep from "@/components/onboarding/experience-step";
import GenderStep from "@/components/onboarding/gender-step";
import GoalStep from "@/components/onboarding/goal-step";
import Button from "@/components/ui/button";
import Screen from "@/components/ui/screen";
import { answers, stepIndex, steps } from "@/constants/onboarding";
import type { OnboardingValues } from "@/lib/validation/onboarding-schema";
import { useAppThemeColor } from "@/theme/app-theme";

export default function OnboardingStepPage() {
  const { step: key = "" } = useLocalSearchParams<{ step: string }>();
  const router = useRouter();
  const foreground = useAppThemeColor("foreground");
  const index = stepIndex(key);
  const step = steps[index];
  const [values, setValues] = useState<Partial<OnboardingValues>>(() => ({
    ...answers,
  }));

  if (!step) return <Redirect href="/welcome" />;

  const select = (nextValue: OnboardingValues[typeof step.field]) => {
    const nextValues = { ...values, [step.field]: nextValue };
    Object.assign(answers, nextValues);
    setValues(nextValues);
  };

  const next = steps[index + 1];
  const goNext = () => {
    if (next) {
      router.push({
        pathname: "/onboarding/[step]",
        params: { step: next.key },
      });
    } else {
      router.push("/sign-up");
    }
  };

  return (
    <Screen>
      <View className="flex-1 px-6 pb-5 pt-4">
        <View className="flex-row items-center gap-2">
          <Pressable
            accessibilityLabel="Go back"
            accessibilityRole="button"
            className="-ml-3 h-11 w-11 items-center justify-center rounded-full active:bg-muted"
            onPress={() => router.back()}
          >
            <Feather color={foreground} name="arrow-left" size={23} />
          </Pressable>
          <View className="h-2 flex-1 overflow-hidden rounded-full bg-border">
            <View
              className="h-full rounded-full bg-primary"
              style={{
                width: `${((index + 1) / steps.length) * 100}%`,
              }}
            />
          </View>
        </View>

        {step.key === "gender" && (
          <GenderStep onChange={select} value={values.gender} />
        )}
        {step.key === "goal" && (
          <GoalStep onChange={select} value={values.goal} />
        )}
        {step.key === "experience" && (
          <ExperienceStep onChange={select} value={values.experience} />
        )}

        <Button disabled={!values[step.field]} onPress={goNext}>
          {next ? "Next" : "Continue to Sign Up"}
        </Button>
      </View>
    </Screen>
  );
}
