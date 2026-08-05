import type { OnboardingValues } from "@/lib/validation/onboarding-schema";

export const answers: Partial<OnboardingValues> = {};

export const steps = [
  { field: "gender", key: "gender" },
  { field: "goal", key: "goal" },
  { field: "experience", key: "experience" },
] as const;

export const resetOnboardingAnswers = () => {
  for (const step of steps) delete answers[step.field];
};

export const stepIndex = (key: string) =>
  steps.findIndex((step) => step.key === key);
