import { Feather, FontAwesome } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "expo-router";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Alert, Image, Pressable, Text, TextInput, View } from "react-native";
import {
  KeyboardAwareScrollView,
  KeyboardToolbar,
} from "react-native-keyboard-controller";

import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Screen from "@/components/ui/screen";
import { answers } from "@/constants/onboarding";
import { onboardingValuesSchema } from "@/lib/validation/onboarding-schema";
import {
  signUpSchema,
  type SignUpFormValues,
} from "@/lib/validation/sign-up-schema";
import { useAppThemeColor } from "@/theme/app-theme";

const googleImg = require("../../../assets/images/app-images/google-logo.png");

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

  const onSubmit = handleSubmit(() => {
    const { success } = onboardingValuesSchema.safeParse(answers);

    router.replace(success ? "/(app)/(tabs)" : "/(public)/welcome");
  });

  const showSocialIntegrationMessage = (provider: "Apple" | "Google") => {
    Alert.alert(
      `${provider} sign up is coming next`,
      "This action will be connected when the Better Auth client is added.",
    );
  };

  return (
    <Screen>
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
                <Input
                  autoCapitalize="words"
                  autoComplete="name"
                  errorMessage={errors.fullName?.message}
                  label="Full Name"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  onSubmitEditing={() => emailInputRef.current?.focus()}
                  placeholder="John Doe"
                  returnKeyType="next"
                  textContentType="name"
                  value={value}
                />
              )}
            />

            <Controller
              control={control}
              name="email"
              render={({ field: { onBlur, onChange, value } }) => (
                <Input
                  ref={emailInputRef}
                  autoCapitalize="none"
                  autoComplete="email"
                  errorMessage={errors.email?.message}
                  inputMode="email"
                  label="Email"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  onSubmitEditing={() => passwordInputRef.current?.focus()}
                  placeholder="you@example.com"
                  returnKeyType="next"
                  textContentType="emailAddress"
                  value={value}
                />
              )}
            />

            <Controller
              control={control}
              name="password"
              render={({ field: { onBlur, onChange, value } }) => (
                <>
                  {/* Start with a normal password input:
                  <TextInput
                    ref={passwordInputRef}
                    className="h-14 rounded-xl border border-input-border px-4"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    placeholder="Create a password"
                    secureTextEntry={!isPasswordVisible}
                    value={value}
                  />

                  Then replace it with the reusable Input below to get the
                  label, error message, theme colors, focus style and icon. */}
                  <Input
                    ref={passwordInputRef}
                    autoCapitalize="none"
                    autoComplete="new-password"
                    errorMessage={errors.password?.message}
                    label="Password"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    onSubmitEditing={onSubmit}
                    placeholder="Create a password"
                    returnKeyType="done"
                    rightIcon={
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
                    }
                    secureTextEntry={!isPasswordVisible}
                    textContentType="newPassword"
                    value={value}
                  />
                </>
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
              onPress={() => showSocialIntegrationMessage("Google")}
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
              onPress={() => showSocialIntegrationMessage("Apple")}
              variant="outline"
            >
              Continue with Apple
            </Button>
          </View>
          <View className="mt-auto flex-row items-center justify-center pt-10">
            <Text className="font-inter text-[13px] text-muted-foreground">
              Already have an account?{" "}
            </Text>
            <Link href="/(public)/sign-in" asChild replace>
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
    </Screen>
  );
}
