import { Feather } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

import { cn } from "@/lib/utils";
import { useAppThemeColor } from "@/theme/app-theme";

type PaywallPlanCardProps = {
  badge?: string;
  billingPeriod: string;
  features: readonly string[];
  label: string;
  onPress: () => void;
  price: string;
  savings?: string;
  selected: boolean;
};

export default function PaywallPlanCard({
  badge,
  billingPeriod,
  features,
  label,
  onPress,
  price,
  savings,
  selected,
}: PaywallPlanCardProps) {
  const primary = useAppThemeColor("primary");

  return (
    <Pressable
      accessibilityLabel={`${label} plan, ${price} ${billingPeriod}`}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      className={cn(
        "relative rounded-xl border bg-background px-5 pb-5 pt-5",
        selected ? "border-primary" : "border-border",
      )}
      onPress={onPress}
    >
      {badge ? (
        <View className="absolute -top-3 right-5 rounded-md border border-primary bg-background px-3 py-1">
          <Text className="font-inter-semibold text-[10px] uppercase tracking-[0.3px] text-primary">
            {badge}
          </Text>
        </View>
      ) : null}

      <View className="flex-row items-end justify-between gap-4">
        <View className="flex-1">
          <Text className="font-inter-semibold text-[14px] text-foreground">
            {label}
          </Text>
          <View className="mt-1 flex-row items-baseline">
            <Text className="font-inter-bold text-[25px] tracking-[-0.5px] text-foreground">
              {price}
            </Text>
            <Text className="ml-1 font-inter-medium text-[13px] text-foreground">
              {billingPeriod}
            </Text>
          </View>
        </View>

        {savings ? (
          <View className="rounded-lg bg-primary px-3 py-2">
            <Text className="font-inter-semibold text-[11px] text-primary-foreground">
              {savings}
            </Text>
          </View>
        ) : null}
      </View>

      <View className="mt-5 gap-3">
        {features.map((feature) => (
          <View key={feature} className="flex-row items-center">
            <Feather color={primary} name="check" size={20} />
            <Text className="ml-3 flex-1 font-inter text-[13px] leading-5 text-muted-foreground">
              {feature}
            </Text>
          </View>
        ))}
      </View>
    </Pressable>
  );
}
