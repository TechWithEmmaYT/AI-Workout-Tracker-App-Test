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
import { authClient } from "@/lib/auth-client";

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
      background: appThemeColors.light.background,
    },
  },
};

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const scheme = colorScheme ?? "light";
  const backgroundColor = appThemeColors[scheme].background;
  const { data: session, isPending } = authClient.useSession();

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
    if ((loaded || error) && !isPending) SplashScreen.hideAsync();
  }, [error, isPending, loaded]);

  if ((!loaded && !error) || isPending) return null;

  return (
    <KeyboardProvider>
      {/* {ThemeProvider colors only the navigation and not the app theme colors. The app theme colors are used in the app itself.} */}
      <ThemeProvider value={navigationThemes[scheme]}>
        <View style={[appThemes[scheme], { flex: 1 }]}>
          <StatusBar
            backgroundColor={backgroundColor}
            barStyle={scheme === "dark" ? "light-content" : "dark-content"}
            translucent={true}
          />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Protected guard={!session}>
              <Stack.Screen name="(public)" />
            </Stack.Protected>
            <Stack.Protected guard={Boolean(session)}>
              <Stack.Screen name="(app)" />
            </Stack.Protected>
          </Stack>
        </View>
      </ThemeProvider>
    </KeyboardProvider>
  );
}
