import { Feather } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import {
  KeyboardAwareScrollView,
  KeyboardToolbar,
} from "react-native-keyboard-controller";

import Button from "@/components/ui/button";
import SafeAreaScreen from "@/components/ui/safe-area-screen";
import { answers } from "@/constants/onboarding";
import { authClient } from "@/lib/auth-client";
import { onboardingValuesSchema } from "@/lib/validation/onboarding-schema";
import {
  signUpSchema,
  type SignUpFormValues,
} from "@/lib/validation/sign-up-schema";
import { useAppThemeColor } from "@/theme/app-theme";

export default function SignUpPage() {
  const router = useRouter();
  const foreground = useAppThemeColor("foreground");
  const iconColor = useAppThemeColor("mutedForeground");
  const emailInputRef = useRef<TextInput>(null);
  const passwordInputRef = useRef<TextInput>(null);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
    mode: "onTouched",
    resolver: zodResolver(signUpSchema),
    shouldFocusError: false,
  });

  const onSubmit = handleSubmit(async ({ email, fullName, password }) => {
    const { success } = onboardingValuesSchema.safeParse(answers);

    if (!success) {
      router.replace("/welcome");
      return;
    }

    const { error } = await authClient.signUp.email({
      email,
      name: fullName,
      password,
    });

    if (error) {
      Alert.alert("Could not create account", error.message);
      return;
    }

    router.replace("/(app)/(tabs)");
  });

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
              Create account
            </Text>
            <Text className="mt-1 font-inter text-[14px] leading-5 text-muted-foreground">
              Sign up to get started
            </Text>
          </View>
          <View className="mt-9 gap-5">
            <Controller
              control={control}
              name="fullName"
              render={({ field: { onBlur, onChange, value } }) => (
                <View className="gap-2">
                  <Text className="font-inter-medium text-[14px] text-foreground">
                    Full Name
                  </Text>
                  <TextInput
                    autoCapitalize="words"
                    autoComplete="name"
                    className={`h-14 rounded-xl border bg-input px-4 font-inter text-[14px] text-foreground ${errors.fullName ? "border-destructive" : "border-input-border"}`}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    onSubmitEditing={() => emailInputRef.current?.focus()}
                    placeholder="John Doe"
                    placeholderTextColor={iconColor}
                    returnKeyType="next"
                    selectionColor={foreground}
                    textContentType="name"
                    value={value}
                  />
                  {errors.fullName && (
                    <Text className="font-inter text-[12px] text-destructive">
                      {errors.fullName.message}
                    </Text>
                  )}
                </View>
              )}
            />

            <Controller
              control={control}
              name="email"
              render={({ field: { onBlur, onChange, value } }) => (
                <View className="gap-2">
                  <Text className="font-inter-medium text-[14px] text-foreground">
                    Email
                  </Text>
                  <TextInput
                    ref={emailInputRef}
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
                      autoComplete="new-password"
                      className="h-full flex-1 font-inter text-[14px] text-foreground"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      onSubmitEditing={onSubmit}
                      placeholder="Create a password"
                      placeholderTextColor={iconColor}
                      returnKeyType="done"
                      secureTextEntry={!isPasswordVisible}
                      selectionColor={foreground}
                      textContentType="newPassword"
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
          </View>
          <Button
            accessibilityLabel="Create account"
            className="mt-10"
            disabled={isSubmitting}
            onPress={onSubmit}
          >
            {isSubmitting ? "Creating Account..." : "Sign Up"}
          </Button>
          <View className="mt-auto flex-row items-center justify-center pt-10">
            <Text className="font-inter text-[13px] text-muted-foreground">
              Already have an account?{" "}
            </Text>
            <Link href="/sign-in" asChild replace>
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
      </KeyboardAwareScrollView>
      <KeyboardToolbar />
    </SafeAreaScreen>
  );
}
