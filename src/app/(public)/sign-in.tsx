import { Feather, FontAwesome } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "expo-router";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Image, Pressable, Text, TextInput, View } from "react-native";
import {
  KeyboardAwareScrollView,
  KeyboardToolbar,
} from "react-native-keyboard-controller";

import Button from "@/components/ui/button";
import SafeAreaScreen from "@/components/ui/safe-area-screen";
import { answers } from "@/constants/onboarding";
import { onboardingValuesSchema } from "@/lib/validation/onboarding-schema";
import {
  signInSchema,
  type SignInFormValues,
} from "@/lib/validation/sign-in-schema";
import { useAppThemeColor } from "@/theme/app-theme";

const googleImg = require("../../../assets/images/app-images/google-logo.png");

export default function SignInPage() {
  const foreground = useAppThemeColor("foreground");
  const iconColor = useAppThemeColor("mutedForeground");
  const hasCompletedOnboarding =
    onboardingValuesSchema.safeParse(answers).success;
  const signUpHref = hasCompletedOnboarding
    ? ("/sign-up" as const)
    : ({
        pathname: "/onboarding/[step]",
        params: { step: "gender" },
      } as const);
  const passwordInputRef = useRef<TextInput>(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onTouched",
    resolver: zodResolver(signInSchema),
    shouldFocusError: false,
  });

  const onSubmit = handleSubmit(async () => {
    Alert.alert(
      "Sign in form is ready",
      "Better Auth will be connected in the authentication integration step.",
    );
  });

  const showAuthIntegrationMessage = (
    provider: "Apple" | "Google" | "password reset",
  ) => {
    const title =
      provider === "password reset" ? "Password reset" : `${provider} sign in`;

    Alert.alert(
      `${title} is coming next`,
      "This action will be connected when the Better Auth client is added.",
    );
  };

  return (
    <SafeAreaScreen>
      <KeyboardAwareScrollView
        bottomOffset={24}
        contentContainerClassName="flex-grow"
        keyboardDismissMode="interactive"
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View className="min-h-full flex-1 px-5 pb-5 pt-12">
          <View>
            <Text
              accessibilityRole="header"
              className="font-inter-bold text-[28px] leading-9 tracking-[-0.6px] text-foreground"
            >
              Welcome back
            </Text>
            <Text className="mt-1 font-inter text-[14px] leading-5 text-muted-foreground">
              Sign in to continue
            </Text>
          </View>

          <View className="mt-10 gap-6">
            <Controller
              control={control}
              name="email"
              render={({ field: { onBlur, onChange, value } }) => (
                <View className="gap-2">
                  <Text className="font-inter-medium text-[14px] text-foreground">
                    Email
                  </Text>
                  <TextInput
                    autoCapitalize="none"
                    autoComplete="email"
                    className={`h-14 rounded-xl border bg-input px-4 font-inter text-[14px] text-foreground ${errors.email ? "border-destructive" : "border-input-border"}`}
                    inputMode="email"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    onSubmitEditing={() => passwordInputRef.current?.focus()}
                    placeholder="you@example.com"
                    placeholderTextColor={iconColor}
                    returnKeyType="next"
                    selectionColor={foreground}
                    textContentType="emailAddress"
                    value={value}
                  />
                  {errors.email && (
                    <Text className="font-inter text-[12px] text-destructive">
                      {errors.email.message}
                    </Text>
                  )}
                </View>
              )}
            />

            <View>
              <Controller
                control={control}
                name="password"
                render={({ field: { onBlur, onChange, value } }) => (
                  <View className="gap-2">
                    <Text className="font-inter-medium text-[14px] text-foreground">
                      Password
                    </Text>
                    <View
                      className={`h-14 flex-row items-center rounded-xl border bg-input px-4 ${errors.password ? "border-destructive" : "border-input-border"}`}
                    >
                      <TextInput
                        ref={passwordInputRef}
                        autoCapitalize="none"
                        autoComplete="current-password"
                        className="h-full flex-1 font-inter text-[14px] text-foreground"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        onSubmitEditing={onSubmit}
                        placeholder="Enter your password"
                        placeholderTextColor={iconColor}
                        returnKeyType="done"
                        secureTextEntry={!isPasswordVisible}
                        selectionColor={foreground}
                        textContentType="password"
                        value={value}
                      />
                      <Pressable
                        accessibilityLabel={
                          isPasswordVisible ? "Hide password" : "Show password"
                        }
                        accessibilityRole="button"
                        className="-mr-3 h-11 w-11 items-center justify-center"
                        hitSlop={4}
                        onPress={() =>
                          setIsPasswordVisible((current) => !current)
                        }
                      >
                        <Feather
                          color={iconColor}
                          name={isPasswordVisible ? "eye-off" : "eye"}
                          size={22}
                        />
                      </Pressable>
                    </View>
                    {errors.password && (
                      <Text className="font-inter text-[12px] text-destructive">
                        {errors.password.message}
                      </Text>
                    )}
                  </View>
                )}
              />

              <Pressable
                accessibilityLabel="Reset forgotten password"
                accessibilityRole="button"
                className="mt-3 min-h-11 self-end justify-center"
                onPress={() => showAuthIntegrationMessage("password reset")}
              >
                <Text className="font-inter-semibold text-[13px] text-primary">
                  Forgot Password?
                </Text>
              </Pressable>
            </View>
          </View>

          <Button
            accessibilityLabel="Sign in"
            className="mt-6"
            disabled={isSubmitting}
            onPress={onSubmit}
          >
            {isSubmitting ? "Signing In..." : "Sign In"}
          </Button>

          <View className="my-7 flex-row items-center gap-4">
            <View className="h-px flex-1 bg-border" />
            <Text className="font-inter text-[12px] text-muted-foreground">
              or continue with
            </Text>
            <View className="h-px flex-1 bg-border" />
          </View>

          <View className="gap-3">
            <Button
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
                    source={googleImg}
                  />
                </View>
              }
              onPress={() => showAuthIntegrationMessage("Google")}
              variant="outline"
            >
              Continue with Google
            </Button>

            <Button
              accessibilityLabel="Continue with Apple"
              className="shadow-sm"
              leftIcon={
                <View
                  accessibilityElementsHidden
                  className="absolute left-5 h-6 w-6 items-center justify-center"
                  importantForAccessibility="no-hide-descendants"
                >
                  <FontAwesome color={foreground} name="apple" size={22} />
                </View>
              }
              onPress={() => showAuthIntegrationMessage("Apple")}
              variant="outline"
            >
              Continue with Apple
            </Button>
          </View>

          <View className="mt-auto flex-row items-center justify-center pt-10">
            <Text className="font-inter text-[13px] text-muted-foreground">
              Don&apos;t have an account?{" "}
            </Text>
            <Link href={signUpHref} asChild replace>
              <Pressable
                accessibilityLabel="Create a new account"
                className="-my-3 min-h-11 justify-center px-1"
              >
                <Text className="font-inter-semibold text-[13px] text-primary">
                  Sign Up
                </Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </KeyboardAwareScrollView>
      <KeyboardToolbar />
    </SafeAreaScreen>
  );
}
