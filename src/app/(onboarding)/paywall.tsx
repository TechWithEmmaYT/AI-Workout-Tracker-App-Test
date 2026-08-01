import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import PaywallPlanCard from "@/components/onboarding/paywall-plan-card";
import Button from "@/components/ui/button";

const plans = {
  monthly: {
    billingPeriod: "/ month",
    features: ["Unlimited workouts", "Basic analytics", "Email support"],
    label: "Monthly",
    price: "$9.99",
  },
  yearly: {
    badge: "Most Popular",
    billingPeriod: "/ year",
    features: [
      "Unlimited workouts",
      "Advanced analytics",
      "Custom programs",
      "Priority support",
    ],
    label: "Yearly",
    price: "$49.99",
    savings: "Save 50%",
  },
} as const;

type PlanId = keyof typeof plans;

export default function PaywallPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<PlanId>("yearly");

  const continueWithPro = () => {
    const plan = plans[selectedPlan];

    Alert.alert(
      `${plan.label} plan selected`,
      "Subscription checkout will be connected when billing is added.",
    );
  };

  const continueFree = () => {
    router.replace("/(app)/(tabs)");
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView
        contentContainerClassName="flex-grow px-6 pb-4 pt-5"
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        <View className="pt-2">
          <Text
            accessibilityRole="header"
            className="max-w-72 font-inter-bold text-[29px] leading-[32px] tracking-[-0.7px] text-foreground"
          >
            Unlock Your{"\n"}Full Potential
          </Text>
          <Text className="mt-3 max-w-72 font-inter text-[14px] leading-5 text-muted-foreground">
            Go Pro and get access to all premium features.
          </Text>
        </View>

        <View accessibilityRole="radiogroup" className="mt-7 gap-4">
          <PaywallPlanCard
            {...plans.yearly}
            onPress={() => setSelectedPlan("yearly")}
            selected={selectedPlan === "yearly"}
          />
          <PaywallPlanCard
            {...plans.monthly}
            onPress={() => setSelectedPlan("monthly")}
            selected={selectedPlan === "monthly"}
          />
        </View>

        <View className="mt-auto gap-3 pt-4">
          <Button
            accessibilityLabel={`Continue with ${plans[selectedPlan].label}`}
            onPress={continueWithPro}
          >
            Continue with {plans[selectedPlan].label}
          </Button>
          <Button
            accessibilityLabel="Continue with free plan"
            onPress={continueFree}
            variant="outline"
          >
            Continue Free
          </Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
