import { Stack } from "expo-router";

export default function OnboardingLayout() {
  return (
    <Stack
      initialRouteName="onboarding"
      screenOptions={{
        animation: "none",
        gestureEnabled: false,
        headerShown: false,
      }}
    >
      <Stack.Screen name="onboarding" />
      <Stack.Screen name="paywall" />
    </Stack>
  );
}
