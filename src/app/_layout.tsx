import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { Feather, FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useColorScheme } from "nativewind";
import { useEffect } from "react";
import { StatusBar, View } from "react-native";
import { KeyboardProvider } from "react-native-keyboard-controller";

import { appThemeColors, appThemes } from "@/theme/app-theme";

import "../global.css";

SplashScreen.preventAutoHideAsync();

const navigationThemes = {
  dark: {
    ...DarkTheme,
    colors: {
      ...DarkTheme.colors,
      background: appThemeColors.dark.background,
    },
  },
  light: {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: appThemeColors.light.muted,
    },
  },
};

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const scheme = colorScheme ?? "light";
  const background = appThemeColors[scheme].background;

  const [loaded, error] = useFonts({
    ...Feather.font,
    ...FontAwesome.font,
    ...FontAwesome6.font,
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (loaded || error) SplashScreen.hideAsync();
  }, [loaded, error]);

  if (!loaded && !error) return null;

  return (
    <KeyboardProvider>
      <ThemeProvider value={navigationThemes[scheme]}>
        <View style={[appThemes[scheme], { flex: 1 }]}>
          <StatusBar
            backgroundColor={background}
            translucent={true}
            barStyle={scheme === "dark" ? "light-content" : "dark-content"}
          />
          <Stack screenOptions={{ headerShown: false }} />
        </View>
      </ThemeProvider>
    </KeyboardProvider>
  );
}
