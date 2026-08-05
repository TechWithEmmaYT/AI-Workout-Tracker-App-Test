import { Image, StatusBar, StyleSheet, View } from "react-native";

import { appThemeColors } from "@/theme/app-theme";

const logo = require("../../assets/images/splash-logo-white.png");

export default function AuthLoadingScreen() {
  return (
    <View
      style={[
        StyleSheet.absoluteFill,
        {
          alignItems: "center",
          backgroundColor: appThemeColors.light.primary,
          justifyContent: "center",
        },
      ]}
    >
      <StatusBar backgroundColor="#2563EB" barStyle="light-content" />
      <Image
        resizeMode="contain"
        source={logo}
        style={{ height: 330, width: 220 }}
      />
    </View>
  );
}
