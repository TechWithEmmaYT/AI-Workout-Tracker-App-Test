import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import {
  onboardingPersistedStateSchema,
  type OnboardingValues,
} from "@/lib/validation/onboarding-schema";

const initialValues: OnboardingValues = {
  experience: "beginner",
  gender: "male",
  goal: "build-muscle",
};

type OnboardingStore = {
  currentStep: number;
  reset: () => void;
  setCurrentStep: (step: number) => void;
  setValue: <Field extends keyof OnboardingValues>(
    field: Field,
    value: OnboardingValues[Field],
  ) => void;
  values: OnboardingValues;
};

export const useOnboardingStore = create<OnboardingStore>()(
  persist(
    (set) => ({
      currentStep: 0,
      reset: () => set({ currentStep: 0, values: initialValues }),
      setCurrentStep: (currentStep) => set({ currentStep }),
      setValue: (field, value) =>
        set((state) => ({
          values: {
            ...state.values,
            [field]: value,
          },
        })),
      values: initialValues,
    }),
    {
      merge: (persistedState, currentState) => {
        const parsedState =
          onboardingPersistedStateSchema.safeParse(persistedState);

        if (!parsedState.success) {
          return currentState;
        }

        return {
          ...currentState,
          ...parsedState.data,
        };
      },
      name: "@myworkout-ai/onboarding",
      partialize: ({ currentStep, values }) => ({ currentStep, values }),
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
