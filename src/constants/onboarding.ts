import type { OnboardingValues } from "@/lib/validation/onboarding-schema";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const KEYS = {
  ANSWERS: "myworkout_onboarding_answers",
  DONE: "myworkout_has_onboarded",
};

export const answers: Partial<OnboardingValues> = {};
export const steps = [
  { field: "gender", key: "gender" },
  { field: "goal", key: "goal" },
  { field: "experience", key: "experience" },
] as const;

const isClient = Platform.OS !== "web" || typeof window !== "undefined";

// // Restore draft onboarding answers from AsyncStorage on startup (client-only)
if (isClient) {
  AsyncStorage.getItem(KEYS.ANSWERS)
    .then((data) => data && Object.assign(answers, JSON.parse(data)))
    .catch(() => {});
}

// // Saves a specific onboarding answer to in-memory draft and persists it to AsyncStorage
export const saveOnboardingAnswer = (
  field: keyof OnboardingValues,
  value: any,
) => {
  answers[field] = value;
  if (isClient)
    AsyncStorage.setItem(KEYS.ANSWERS, JSON.stringify(answers)).catch(() => {});
};

// // Clears all draft onboarding answers
// from memory and deletes saved draft from AsyncStorage
export const resetOnboardingAnswers = () => {
  steps.forEach((s) => delete answers[s.field]);
  if (isClient) AsyncStorage.removeItem(KEYS.ANSWERS).catch(() => {});
};

// // Stores whether the user has completed onboarding
//  / signed up in persistent AsyncStorage
export const setHasOnboarded = (value: boolean) => {
  if (isClient) AsyncStorage.setItem(KEYS.DONE, String(value)).catch(() => {});
};

// // Reads whether the user has completed onboarding from AsyncStorage (client-only)
export const getHasOnboardedAsync = async (): Promise<boolean> => {
  if (!isClient) return false;
  return (await AsyncStorage.getItem(KEYS.DONE).catch(() => null)) === "true";
};

// // Returns the array index of a given onboarding step key
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
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { Platform } from "react-native";

// import type { OnboardingValues } from "@/lib/validation/onboarding-schema";

// const ONBOARDING_KEY = "myworkout_onboarding_answers";
// const HAS_ONBOARDED_KEY = "myworkout_has_onboarded";

// export const answers: Partial<OnboardingValues> = {};
// export const steps = [
//   { field: "gender", key: "gender" },
//   { field: "goal", key: "goal" },
//   { field: "experience", key: "experience" },
// ] as const;

// // Helper to check if running in Node.js / SSR server environment where window is undefined
// const isServer = Platform.OS === "web" && typeof window === "undefined";

// // Restore draft onboarding answers from AsyncStorage on startup (client-only)
// if (!isServer) {
//   AsyncStorage.getItem(ONBOARDING_KEY).then((data) => {
//     if (data) {
//       try {
//         Object.assign(answers, JSON.parse(data));
//       } catch {}
//     }
//   });
// }

// // Saves a specific onboarding answer to in-memory draft and persists it to AsyncStorage
// export const saveOnboardingAnswer = (
//   field: keyof OnboardingValues,
//   value: OnboardingValues[keyof OnboardingValues],
// ) => {
//   (answers as Record<string, unknown>)[field] = value;
//   if (!isServer) {
//     AsyncStorage.setItem(ONBOARDING_KEY, JSON.stringify(answers)).catch(
//       () => {},
//     );
//   }
// };

// // Clears all draft onboarding answers from memory and deletes saved draft from AsyncStorage
// export const resetOnboardingAnswers = () => {
//   for (const step of steps) delete answers[step.field];
//   if (!isServer) {
//     AsyncStorage.removeItem(ONBOARDING_KEY).catch(() => {});
//   }
// };

// // Stores whether the user has completed onboarding / signed up in persistent AsyncStorage
// export const setHasOnboarded = (value: boolean) => {
//   if (!isServer) {
//     AsyncStorage.setItem(HAS_ONBOARDED_KEY, value ? "true" : "false").catch(
//       () => {},
//     );
//   }
// };

// // Reads whether the user has completed onboarding from AsyncStorage (client-only)
// export const getHasOnboardedAsync = async (): Promise<boolean> => {
//   if (isServer) return false;
//   try {
//     const value = await AsyncStorage.getItem(HAS_ONBOARDED_KEY);
//     return value === "true";
//   } catch {
//     return false;
//   }
// };

// // Returns the array index of a given onboarding step key
// export const stepIndex = (key: string) =>
//   steps.findIndex((step) => step.key === key);
