import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { Feather, FontAwesome, FontAwesome6 } from "@expo/vector-icons";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from "expo-router";
import * as SplashScreen from "expo-splash-screen";

import { useColorScheme } from "nativewind";
import { useEffect, useState } from "react";
import { StatusBar, View } from "react-native";
import { KeyboardProvider } from "react-native-keyboard-controller";

import AuthLoadingScreen from "@/components/auth-loading-screen";
import { authClient } from "@/lib/auth-client";
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
      background: appThemeColors.light.background,
    },
  },
};

export default function RootLayout() {
  const [queryClient] = useState(() => new QueryClient());
  const [appReady, setAppReady] = useState(false);

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
  const fontsReady = loaded || !!error;

  useEffect(() => {
    if (!appReady && fontsReady && !isPending) {
      SplashScreen.hideAsync().then(() => setAppReady(true));
    }
  }, [appReady, fontsReady, isPending]);

  if (!fontsReady || !appReady) return null;

  return (
    <QueryClientProvider client={queryClient}>
      <KeyboardProvider>
        <ThemeProvider value={navigationThemes[scheme]}>
          <View style={[appThemes[scheme], { backgroundColor, flex: 1 }]}>
            <StatusBar
              backgroundColor={backgroundColor}
              barStyle={scheme === "dark" ? "light-content" : "dark-content"}
              translucent={true}
            />
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Protected guard={!session}>
                <Stack.Screen name="(public)" />
              </Stack.Protected>
              <Stack.Protected guard={!!session}>
                <Stack.Screen name="(app)" />
              </Stack.Protected>
            </Stack>

            {isPending && <AuthLoadingScreen />}
          </View>
        </ThemeProvider>
      </KeyboardProvider>
    </QueryClientProvider>
  );
}
