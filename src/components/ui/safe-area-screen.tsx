import type { ComponentProps } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { cn } from "@/lib/utils";

type SafeAreaScreenProps = ComponentProps<typeof SafeAreaView>;

export default function SafeAreaScreen({
  className,
  ...props
}: SafeAreaScreenProps) {
  return <SafeAreaView className={cn("flex-1 ", className)} {...props} />;
}
