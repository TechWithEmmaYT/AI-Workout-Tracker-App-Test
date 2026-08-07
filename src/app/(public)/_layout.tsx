import { Stack } from "expo-router";

import { useHasOnboarded } from "@/hooks/use-has-onboarded";

export default function PublicLayout() {
  const hasOnboarded = useHasOnboarded();
  return (
    <Stack
      initialRouteName={hasOnboarded ? "sign-in" : "welcome"}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="welcome" options={{ headerShown: false }} />
      <Stack.Screen name="sign-in" options={{ headerShown: false }} />
      <Stack.Screen name="sign-up" options={{ headerShown: false }} />
    </Stack>
  );
}
