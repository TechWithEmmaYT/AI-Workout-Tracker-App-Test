import { forwardRef, useState } from "react";
import type { ComponentRef, ReactNode } from "react";
import { Text, TextInput, View } from "react-native";
import type { TextInputProps } from "react-native";

import { cn } from "@/lib/utils";
import { useAppThemeColor } from "@/theme/app-theme";

type InputProps = TextInputProps & {
  errorMessage?: string;
  label: string;
  rightIcon?: ReactNode;
};

const Input = forwardRef<ComponentRef<typeof TextInput>, InputProps>(
  (
    {
      accessibilityLabel,
      className,
      editable = true,
      errorMessage,
      label,
      onBlur,
      onFocus,
      placeholder,
      placeholderTextColor,
      rightIcon,
      ...props
    },
    ref,
  ) => {
    const [focused, setFocused] = useState(false);
    const muted = useAppThemeColor("mutedForeground");
    const primary = useAppThemeColor("primary");

    return (
      <View className="gap-2">
        <Text className="font-inter-medium text-[14px] text-foreground">
          {label}
        </Text>

        <View
          className={cn(
            "h-14 flex-row items-center rounded-xl border bg-input px-4",
            errorMessage
              ? "border-destructive"
              : focused
                ? "border-ring"
                : "border-input-border",
            !editable && "opacity-50",
          )}
        >
          <TextInput
            ref={ref}
            accessibilityLabel={accessibilityLabel ?? label}
            aria-invalid={Boolean(errorMessage)}
            className={cn(
              "h-full flex-1 font-inter text-[14px] text-foreground",
              className,
            )}
            editable={editable}
            onBlur={(event) => {
              setFocused(false);
              onBlur?.(event);
            }}
            onFocus={(event) => {
              setFocused(true);
              onFocus?.(event);
            }}
            placeholder={placeholder}
            placeholderTextColor={placeholderTextColor ?? muted}
            selectionColor={primary}
            {...props}
          />
          {rightIcon}
        </View>

        {errorMessage && (
          <Text
            accessibilityLiveRegion="polite"
            className="font-inter text-[12px] text-destructive"
            role="alert"
          >
            {errorMessage}
          </Text>
        )}
      </View>
    );
  },
);

Input.displayName = "Input";

export default Input;
