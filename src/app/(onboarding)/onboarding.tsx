import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { BackHandler, Pressable, View } from "react-native";
import Animated, { SlideInLeft, SlideInRight } from "react-native-reanimated";
import { SafeAreaView } from "react-native-safe-area-context";

import ExperienceStep from "@/components/onboarding/experience-step";
import GenderStep from "@/components/onboarding/gender-step";
import GoalStep from "@/components/onboarding/goal-step";
import SummaryStep from "@/components/onboarding/summary-step";
import Button from "@/components/ui/button";
import { useOnboardingStore } from "@/stores/onboarding-store";
import { useAppThemeColor } from "@/theme/app-theme";

const TOTAL_STEPS = 4;

export default function OnboardingPage() {
  const router = useRouter();
  const [direction, setDirection] = useState<"back" | "forward">("forward");
  const currentStep = useOnboardingStore((state) => state.currentStep);
  const setCurrentStep = useOnboardingStore((state) => state.setCurrentStep);
  const setValue = useOnboardingStore((state) => state.setValue);
  const values = useOnboardingStore((state) => state.values);
  const foreground = useAppThemeColor("foreground");

  const goBack = useCallback(() => {
    if (currentStep === 0) {
      router.back();
      return true;
    }

    setDirection("back");
    setCurrentStep(currentStep - 1);
    return true;
  }, [currentStep, router, setCurrentStep]);

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      goBack,
    );

    return () => subscription.remove();
  }, [goBack]);

  const goNext = () => {
    if (currentStep === TOTAL_STEPS - 1) {
      router.push("/(onboarding)/paywall");
      return;
    }

    setDirection("forward");
    setCurrentStep(currentStep + 1);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <GenderStep
            onChange={(gender) => setValue("gender", gender)}
            value={values.gender}
          />
        );
      case 1:
        return (
          <GoalStep
            onChange={(goal) => setValue("goal", goal)}
            value={values.goal}
          />
        );
      case 2:
        return (
          <ExperienceStep
            onChange={(experience) => setValue("experience", experience)}
            value={values.experience}
          />
        );
      case 3:
        return <SummaryStep values={values} />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 overflow-hidden px-6 pb-5 pt-2">
        <Pressable
          accessibilityLabel="Go back"
          accessibilityRole="button"
          className="-ml-3 h-11 w-11 items-center justify-center rounded-full active:bg-muted"
          hitSlop={4}
          onPress={goBack}
        >
          <Feather color={foreground} name="arrow-left" size={23} />
        </Pressable>

        <Animated.View
          key={currentStep}
          className="flex-1"
          entering={
            direction === "forward"
              ? SlideInRight.duration(260)
              : SlideInLeft.duration(260)
          }
        >
          {renderCurrentStep()}
        </Animated.View>

        <Button
          accessibilityLabel={currentStep === 3 ? "Continue" : "Next"}
          onPress={goNext}
        >
          {currentStep === 3 ? "Continue" : "Next"}
        </Button>
      </View>
    </SafeAreaView>
  );
}
