import { forwardRef } from "react";
import type { ComponentRef, ReactNode } from "react";
import { Pressable, Text } from "react-native";
import type { PressableProps } from "react-native";

import { cn } from "@/lib/utils";

const buttonVariants = {
  default: {
    container: "border-primary bg-primary active:bg-primary-hover",
    text: "text-primary-foreground",
  },
  secondary: {
    container: "border-secondary bg-secondary active:bg-muted",
    text: "text-secondary-foreground",
  },
  outline: {
    container: "border-border bg-background active:bg-muted",
    text: "text-foreground",
  },
  ghost: {
    container: "border-transparent bg-transparent active:bg-muted",
    text: "text-foreground",
  },
  link: {
    container: "border-transparent bg-transparent",
    text: "text-primary underline",
  },
  destructive: {
    container: "border-destructive bg-destructive active:opacity-90",
    text: "text-destructive-foreground",
  },
} as const;

const buttonSizes = {
  sm: {
    container: "h-11 rounded-lg px-4",
    text: "text-[13px]",
  },
  default: {
    container: "h-14 rounded-xl px-5",
    text: "text-[14px]",
  },
  lg: {
    container: "h-16 rounded-xl px-6",
    text: "text-[15px]",
  },
  icon: {
    container: "h-12 w-12 rounded-xl px-0",
    text: "text-[14px]",
  },
} as const;

export type ButtonVariant = keyof typeof buttonVariants;
export type ButtonSize = keyof typeof buttonSizes;

export interface ButtonProps extends PressableProps {
  children: ReactNode;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  size?: ButtonSize;
  textClassName?: string;
  variant?: ButtonVariant;
}

const Button = forwardRef<ComponentRef<typeof Pressable>, ButtonProps>(
  (
    {
      children,
      className,
      disabled,
      leftIcon,
      rightIcon,
      size = "default",
      textClassName,
      variant = "default",
      ...props
    },
    ref,
  ) => {
    const variantStyles = buttonVariants[variant];
    const sizeStyles = buttonSizes[size];

    return (
      <Pressable
        ref={ref}
        accessibilityRole="button"
        className={cn(
          "relative flex-row items-center justify-center gap-3 border",
          variantStyles.container,
          sizeStyles.container,
          disabled && "opacity-50",
          className,
        )}
        disabled={disabled}
        {...props}
      >
        {leftIcon}
        <Text
          className={cn(
            "font-inter-semibold text-center",
            variantStyles.text,
            sizeStyles.text,
            textClassName,
          )}
        >
          {children}
        </Text>
        {rightIcon}
      </Pressable>
    );
  },
);

Button.displayName = "Button";

export default Button;
