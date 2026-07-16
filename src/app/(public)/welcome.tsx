import { Link } from "expo-router";
import { Image, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import Button from "@/components/ui/button";

export default function WelcomePage() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-1 px-5 pb-4 pt-5">
        <View className="z-10 max-w-[310px]">
          <Text
            accessibilityRole="header"
            className="font-inter-bold text-[32px] leading-[35px] tracking-[-0.8px] text-foreground"
          >
            Stronger{"\n"}Every Workout.
          </Text>
          <Text className="mt-3 max-w-[285px] font-inter text-[13px] leading-5 text-muted-foreground">
            Track every workout, monitor your progress and become stronger every
            session.
          </Text>
        </View>

        <View className="min-h-[250px] flex-1 overflow-hidden">
          <Image
            accessibilityLabel="Athlete preparing for a workout"
            className="h-[550px] w-[145%] -mx-32"
            resizeMode="cover"
            source={require("@/assets/images/app-images/welcome-person.png")}
          />
        </View>

        <View className="gap-3">
          <Link href="/(public)/sign-in" asChild>
            <Button
              accessibilityHint="Opens the sign in screen"
              accessibilityLabel="Continue with Google"
              className="shadow-sm"
              leftIcon={
                <View
                  accessibilityElementsHidden
                  className="absolute left-5 h-6 w-6 items-center justify-center"
                  importantForAccessibility="no-hide-descendants"
                >
                  <Image
                    className="h-5 w-5"
                    resizeMode="contain"
                    source={require("../../../assets/images/app-images/google-logo.png")}
                  />
                </View>
              }
              variant="outline"
            >
              Continue with Google
            </Button>
          </Link>

          <Link href="/(public)/sign-up" asChild>
            <Button
              accessibilityHint="Opens the account creation screen"
              accessibilityLabel="Continue with Email"
              className="shadow-sm"
              leftIcon={
                <View
                  accessibilityElementsHidden
                  className="absolute left-5 h-6 w-6 items-center justify-center"
                  importantForAccessibility="no-hide-descendants"
                >
                  <Image
                    className="h-[18px] w-[18px]"
                    resizeMode="contain"
                    source={require("../../../assets/images/app-images/email.png")}
                  />
                </View>
              }
              variant="outline"
            >
              Continue with Email
            </Button>
          </Link>

          <View className="mt-3 flex-row items-center justify-center">
            <Text className="font-inter text-[13px] text-muted-foreground">
              Already have an account?{" "}
            </Text>
            <Link href="/(public)/sign-in" asChild>
              <Pressable
                accessibilityLabel="Sign in to your account"
                className="-my-3 min-h-11 justify-center px-1"
              >
                <Text className="font-inter-semibold text-[13px] text-primary">
                  Sign In
                </Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
