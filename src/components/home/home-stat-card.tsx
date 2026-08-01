import { Text, View } from "react-native";

type HomeStatCardProps = {
  label: string;
  value: string;
};

export default function HomeStatCard({ label, value }: HomeStatCardProps) {
  return (
    <View className="min-h-[64px] flex-1 items-center justify-center rounded-xl border border-border bg-background px-1.5 py-2">
      <Text className="text-center font-inter text-[12px] leading-[14px] text-muted-foreground">
        {label}
      </Text>
      <Text className="mt-1 text-center font-inter-bold text-[15px] tracking-[-0.3px] text-foreground">
        {value}
      </Text>
    </View>
  );
}
