import { Stack } from "expo-router";

import { WorkoutDraftProvider } from "@/contexts/workout-draft-context";

export default function WorkoutFlowLayout() {
  return (
    <WorkoutDraftProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="create" />
        <Stack.Screen
          name="exercises/index"
          options={{ animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="exercises/[id]"
          options={{ animation: "slide_from_right" }}
        />
        <Stack.Screen name="[id]/active" />
      </Stack>
    </WorkoutDraftProvider>
  );
}
