import { useColorScheme } from "nativewind";
import type { ComponentProps } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { cn } from "@/lib/utils";

type ScreenProps = ComponentProps<typeof SafeAreaView>;

export default function Screen({ className, ...props }: ScreenProps) {
  const { colorScheme } = useColorScheme();

  return (
    <SafeAreaView
      className={cn(
        "flex-1 bg-background",
        className,

      )}
      {...props}
    />
  );
}
