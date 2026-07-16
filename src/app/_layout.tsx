import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useColorScheme } from "nativewind";
import { useEffect } from "react";
import { View } from "react-native";
import { KeyboardProvider } from "react-native-keyboard-controller";

import { appThemes } from "@/theme/app-theme";

import "../global.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const scheme = colorScheme ?? "light";
  const [loaded, error] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <KeyboardProvider>
      <ThemeProvider value={scheme === "dark" ? DarkTheme : DefaultTheme}>
        <View className="flex-1 bg-background" style={appThemes[scheme]}>
          <StatusBar style={scheme === "dark" ? "light" : "dark"} />
          <Stack screenOptions={{ headerShown: false }} />
        </View>
      </ThemeProvider>
    </KeyboardProvider>
  );
}
