import { forwardRef, useState } from "react";
import type { ComponentRef, ReactNode } from "react";
import { Text, TextInput, View } from "react-native";
import type { TextInputProps } from "react-native";
import { useColorScheme } from "nativewind";

import { cn } from "@/lib/utils";

export interface InputProps extends TextInputProps {
  containerClassName?: string;
  errorMessage?: string;
  hint?: string;
  inputClassName?: string;
  label?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

const Input = forwardRef<ComponentRef<typeof TextInput>, InputProps>(
  (
    {
      accessibilityLabel,
      className,
      containerClassName,
      editable = true,
      errorMessage,
      hint,
      inputClassName,
      label,
      leftIcon,
      onBlur,
      onFocus,
      placeholder,
      placeholderTextColor,
      rightIcon,
      ...props
    },
    ref,
  ) => {
    const { colorScheme } = useColorScheme();
    const [isFocused, setIsFocused] = useState(false);
    const hasError = Boolean(errorMessage);
    const supportingText = errorMessage ?? hint;

    return (
      <View className={cn("gap-2", className)}>
        {label ? (
          <Text className="font-inter-medium text-[14px] text-foreground">
            {label}
          </Text>
        ) : null}

        <View
          className={cn(
            "h-14 flex-row items-center gap-3 rounded-xl border bg-input px-4",
            hasError
              ? "border-destructive"
              : isFocused
                ? "border-ring"
                : "border-input-border",
            !editable && "opacity-50",
            containerClassName,
          )}
        >
          {leftIcon}
          <TextInput
            ref={ref}
            accessibilityLabel={accessibilityLabel ?? label ?? placeholder}
            aria-invalid={hasError}
            className={cn(
              "h-full flex-1 font-inter text-[14px] text-foreground",
              inputClassName,
            )}
            editable={editable}
            onBlur={(event) => {
              setIsFocused(false);
              onBlur?.(event);
            }}
            onFocus={(event) => {
              setIsFocused(true);
              onFocus?.(event);
            }}
            placeholder={placeholder}
            placeholderTextColor={
              placeholderTextColor ??
              (colorScheme === "dark" ? "#94A3B8" : "#64748B")
            }
            selectionColor="#2563EB"
            {...props}
          />
          {rightIcon}
        </View>

        {supportingText ? (
          <Text
            accessibilityLiveRegion={hasError ? "polite" : "none"}
            className={cn(
              "font-inter text-[12px] leading-4",
              hasError ? "text-destructive" : "text-muted-foreground",
            )}
            role={hasError ? "alert" : undefined}
          >
            {supportingText}
          </Text>
        ) : null}
      </View>
    );
  },
);

Input.displayName = "Input";

export default Input;
