import {
  onboardingValuesSchema,
  type OnboardingValues,
} from "@/lib/validation/onboarding-schema";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";
import { ZodSafeParseResult } from "zod";

const ONBOARDING_KEYS = "myworkout_onboarding_answers";
export const answers: Partial<OnboardingValues> = {};

export const steps = [
  { field: "gender", key: "gender" },
  { field: "goal", key: "goal" },
  { field: "experience", key: "experience" },
] as const;

const isClient = Platform.OS !== "web" || typeof window !== "undefined";

if (isClient) {
  AsyncStorage.getItem(ONBOARDING_KEYS)
    .then((data) => data && Object.assign(answers, JSON.parse(data)))
    .catch(() => {});
}
export const saveOnboardingAnswer = (
  field: keyof OnboardingValues,
  value: any,
) => {
  answers[field] = value;
  if (isClient)
    AsyncStorage.setItem(ONBOARDING_KEYS, JSON.stringify(answers)).catch(
      () => {},
    );
};

export const isOnboardingCompleted = (): boolean => {
  return onboardingValuesSchema.safeParse(answers).success;
};

export const getOnboardingAnswers =
  (): ZodSafeParseResult<OnboardingValues> => {
    return onboardingValuesSchema.safeParse(answers);
  };

export const resetOnboardingAnswers = () => {
  steps.forEach((s) => delete answers[s.field]);
  if (isClient) AsyncStorage.removeItem(ONBOARDING_KEYS).catch(() => {});
};

export const stepIndex = (key: string) => steps.findIndex((s) => s.key === key);

//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Platform } from "react-native";

// import type { OnboardingValues } from "@/lib/validation/onboarding-schema";
// import { onboardingValuesSchema } from "@/lib/validation/onboarding-schema";

// const DRAFT_KEY = "myworkout_onboarding_answers";
// const isClient = Platform.OS !== "web" || typeof window !== "undefined";

// export const answers: Partial<OnboardingValues> = {};

// export const steps = [
//   { field: "gender", key: "gender" },
//   { field: "goal", key: "goal" },
//   { field: "experience", key: "experience" },
// ] as const;

// // Helper to check if all onboarding steps are complete
// export const isOnboardingCompleted = (): boolean => {
//   return onboardingValuesSchema.safeParse(answers).success;
// };

// // Restore saved onboarding draft answers from AsyncStorage on startup
// if (isClient) {
//   AsyncStorage.getItem(DRAFT_KEY)
//     .then((data) => {
//       if (data) {
//         try {
//           Object.assign(answers, JSON.parse(data));
//         } catch {}
//       }
//     })
//     .catch(() => {});
// }

// // Saves a specific onboarding answer to memory and persists to AsyncStorage
// export const saveOnboardingAnswer = (
//   field: keyof OnboardingValues,
//   value: OnboardingValues[keyof OnboardingValues],
// ) => {
//   (answers as Record<string, unknown>)[field] = value;
//   if (isClient) {
//     AsyncStorage.setItem(DRAFT_KEY, JSON.stringify(answers)).catch(() => {});
//   }
// };

// // Resets in-memory onboarding draft answers and removes saved draft from AsyncStorage
// export const resetOnboardingAnswers = () => {
//   for (const step of steps) delete answers[step.field];
//   if (isClient) {
//     AsyncStorage.removeItem(DRAFT_KEY).catch(() => {});
//   }
// };

// // Returns the index of a given onboarding step key
// export const stepIndex = (key: string) =>
//   steps.findIndex((step) => step.key === key);
