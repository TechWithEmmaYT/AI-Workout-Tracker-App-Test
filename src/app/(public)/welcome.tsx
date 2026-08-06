import { Feather } from "@expo/vector-icons";
import { Link, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";

import Button from "@/components/ui/button";
import { useAppThemeColor } from "@/theme/app-theme";
import { SafeAreaView } from "react-native-safe-area-context";

const background = require("../../../assets/images/app-images/welcome-background.png");
const logo = require("../../../assets/images/app-images/logo.png");
const mockup = require("../../../assets/images/app-images/app-mockup.png");

export default function WelcomePage() {
  const primaryForeground = useAppThemeColor("primaryForeground");

  useFocusEffect(
    useCallback(() => {
      const entry = StatusBar.pushStackEntry({
        backgroundColor: "#020817",
        barStyle: "light-content",
        translucent: false,
      });

      return () => StatusBar.popStackEntry(entry);
    }, []),
  );

  return (
    <ImageBackground className="flex-1" resizeMode="cover" source={background}>
      <View className="absolute inset-0 bg-black/20" />

      <SafeAreaView className="flex-1">
        <ScrollView
          contentContainerClassName="min-h-full flex-grow px-5 pb-4 pt-2"
          showsVerticalScrollIndicator={false}
        >
          <View className="items-center">
            <View className="h-20 w-36 overflow-hidden">
              <Image
                accessibilityLabel="MyWorkout logo"
                className="h-full w-full"
                resizeMode="cover"
                source={logo}
              />
            </View>
            <Text className="-mt-2 font-inter-bold text-[30px] tracking-[-0.8px] text-white">
              MyWorkout
            </Text>
            <Text className="mt-1 font-inter text-[13px] text-white/70">
              Track. Train. Transform.
            </Text>
          </View>

          <View className="min-h-[320px] -mt-2 flex-1 items-center overflow-hidden">
            <Image
              accessibilityLabel="MyWorkout app preview"
              className="h-full w-full scale-100"
              resizeMode="contain"
              source={mockup}
            />
          </View>

          <View className="items-center">
            <Text
              accessibilityRole="header"
              className="text-center font-inter-bold text-[30px] leading-9 tracking-[-0.8px] text-white"
            >
              Stronger Every Workout.
            </Text>
            <Text className="mt-2 text-center font-inter text-[15px] text-white/70">
              Build muscle. Track every rep.
            </Text>
          </View>

          <Link
            href={{
              pathname: "/onboarding/[step]",
              params: { step: "gender" },
            }}
            asChild
          >
            <Button
              accessibilityHint="Starts the onboarding questions"
              accessibilityLabel="Get Started"
              className="mt-6 rounded-2xl"
              rightIcon={
                <View className="absolute right-5">
                  <Feather
                    color={primaryForeground}
                    name="arrow-right"
                    size={23}
                  />
                </View>
              }
            >
              Get Started
            </Button>
          </Link>

          <View className="mt-3 flex-row items-center justify-center">
            <Text className="font-inter text-[13px] text-white/70">
              Already have an account?{" "}
            </Text>
            <Link href="/sign-in" asChild>
              <Pressable
                accessibilityLabel="Sign in to your account"
                className="min-h-11 justify-center px-1"
              >
                <Text className="font-inter-semibold text-[13px] text-primary">
                  Sign In
                </Text>
              </Pressable>
            </Link>
          </View>
        </ScrollView>
      </SafeAreaView>
    </ImageBackground>
  );
}
