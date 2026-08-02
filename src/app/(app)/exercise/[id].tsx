import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Image, Pressable, ScrollView, Text, View } from "react-native";
import { z } from "zod";

import AiCoachModal from "@/components/exercise/ai-coach-modal";
import Button from "@/components/ui/button";
import Screen from "@/components/ui/screen";
import { getExerciseById } from "@/lib/exercises";
import { useAppThemeColor } from "@/theme/app-theme";

const exerciseParamsSchema = z.object({ id: z.string().min(1) });

function ExerciseInfoRow({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: string;
}) {
  const primary = useAppThemeColor("primary");

  return (
    <View className="min-h-[68px] flex-row items-center border-b border-border py-3 last:border-b-0">
      <View className="h-10 w-10 items-center justify-center rounded-xl bg-accent">
        <Feather color={primary} name={icon} size={19} />
      </View>
      <View className="ml-3 flex-1">
        <Text className="font-inter text-[11px] text-muted-foreground">
          {label}
        </Text>
        <Text className="mt-1 font-inter-semibold text-[13px] text-foreground">
          {value}
        </Text>
      </View>
    </View>
  );
}

export default function ExerciseDetailPage() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const result = exerciseParamsSchema.safeParse({
    id: Array.isArray(params.id) ? params.id[0] : params.id,
  });
  const exercise = result.success ? getExerciseById(result.data.id) : undefined;
  const router = useRouter();
  const foreground = useAppThemeColor("foreground");
  const primary = useAppThemeColor("primary");
  const [isCoachOpen, setIsCoachOpen] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  if (!exercise) {
    return (
      <Screen className="px-5" edges={["top"]}>
        <Pressable
          accessibilityLabel="Go back"
          accessibilityRole="button"
          className="h-11 w-11 items-center justify-center"
          onPress={() => router.back()}
        >
          <Feather color={foreground} name="arrow-left" size={23} />
        </Pressable>
        <View className="flex-1 items-center justify-center pb-16">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-muted">
            <Feather color={foreground} name="alert-circle" size={28} />
          </View>
          <Text className="mt-5 font-inter-bold text-[20px] text-foreground">
            Exercise not found
          </Text>
          <Text className="mt-2 text-center font-inter text-[13px] text-muted-foreground">
            This exercise may no longer be available.
          </Text>
          <Button className="mt-6" onPress={() => router.back()} size="sm">
            Back to Discover
          </Button>
        </View>
      </Screen>
    );
  }

  return (
    <Screen edges={["top"]}>
      <View className="h-14 flex-row items-center justify-between px-4">
        <Pressable
          accessibilityLabel="Go back"
          accessibilityRole="button"
          className="h-11 w-11 items-center justify-center rounded-full active:bg-muted"
          onPress={() => router.back()}
        >
          <Feather color={foreground} name="arrow-left" size={23} />
        </Pressable>
        <Pressable
          accessibilityLabel={
            isSaved ? "Remove saved exercise" : "Save exercise"
          }
          accessibilityRole="button"
          accessibilityState={{ selected: isSaved }}
          className="h-11 w-11 items-center justify-center rounded-full active:bg-muted"
          onPress={() => setIsSaved((current) => !current)}
        >
          <Feather
            color={isSaved ? primary : foreground}
            name="bookmark"
            size={22}
          />
        </Pressable>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-5 pb-6"
        showsVerticalScrollIndicator={false}
      >
        <Image
          accessibilityLabel={`${exercise.name} demonstration`}
          className="h-64 w-full rounded-2xl bg-muted"
          resizeMode="cover"
          source={exercise.image}
        />
        <Text
          accessibilityRole="header"
          className="mt-5 font-inter-bold text-[24px] tracking-[-0.5px] text-foreground"
        >
          {exercise.name}
        </Text>
        <Text className="mt-1 font-inter-medium text-[13px] text-primary">
          {exercise.muscles}
        </Text>

        <View className="mt-6">
          <Text className="font-inter-bold text-[17px] text-foreground">
            Description
          </Text>
          <Text className="mt-2 font-inter text-[14px] leading-6 text-muted-foreground">
            {exercise.description}
          </Text>
        </View>

        <Pressable
          accessibilityLabel={`Ask AI Coach how to perform ${exercise.name}`}
          accessibilityRole="button"
          className="mt-5 min-h-14 flex-row items-center rounded-xl border border-primary bg-accent px-4 active:opacity-80"
          onPress={() => setIsCoachOpen(true)}
        >
          <Feather color={primary} name="message-circle" size={21} />
          <Text className="ml-3 flex-1 font-inter-semibold text-[14px] text-primary">
            Ask AI Coach
          </Text>
          <Feather color={primary} name="chevron-right" size={21} />
        </Pressable>

        <View className="mt-6 overflow-hidden rounded-2xl border border-border px-4">
          <ExerciseInfoRow
            icon="tool"
            label="Equipment"
            value={exercise.equipment}
          />
          <ExerciseInfoRow
            icon="bar-chart-2"
            label="Difficulty"
            value={exercise.difficulty}
          />
          <ExerciseInfoRow
            icon="target"
            label="Force Type"
            value={exercise.forceType}
          />
          <ExerciseInfoRow
            icon="activity"
            label="Mechanics"
            value={exercise.mechanics}
          />
        </View>
      </ScrollView>

      <View className="border-t border-border bg-background px-5 pb-3 pt-3">
        <Button
          accessibilityLabel={`Add ${exercise.name} to workout`}
          onPress={() =>
            Alert.alert(
              "Added to workout",
              `${exercise.name} has been added to your workout draft.`,
            )
          }
        >
          Add to Workout
        </Button>
      </View>

      <AiCoachModal
        exercise={exercise}
        onClose={() => setIsCoachOpen(false)}
        visible={isCoachOpen}
      />
    </Screen>
  );
}
