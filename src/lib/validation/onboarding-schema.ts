import { z } from "zod";

export const onboardingValuesSchema = z.object({
  experience: z.enum(["beginner", "intermediate", "advanced"]),
  gender: z.enum(["male", "female"]),
  goal: z.enum(["build-muscle", "lose-fat", "maintain"]),
});

export const onboardingPersistedStateSchema = z.object({
  currentStep: z.number().int().min(0).max(3),
  values: onboardingValuesSchema,
});

export type OnboardingValues = z.infer<typeof onboardingValuesSchema>;
export type OnboardingExperience = OnboardingValues["experience"];
export type OnboardingGender = OnboardingValues["gender"];
export type OnboardingGoal = OnboardingValues["goal"];
