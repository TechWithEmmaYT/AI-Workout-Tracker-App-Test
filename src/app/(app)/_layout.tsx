import { Stack } from "expo-router";

import { StreakProvider } from "@/contexts/streak-context";

export default function AppLayout() {
  return (
    <StreakProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(modal)/workout" />
        <Stack.Screen
          name="(modal)/history/[id]"
          options={{ animation: "slide_from_right" }}
        />
      </Stack>
    </StreakProvider>
  );
}
