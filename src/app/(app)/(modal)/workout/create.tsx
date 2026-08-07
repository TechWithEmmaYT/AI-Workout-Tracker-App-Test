import { Feather } from "@expo/vector-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  Linking,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { z } from "zod";

import Button from "@/components/ui/button";
import LoadingDialog from "@/components/ui/loading-dialog";
import SafeAreaScreen from "@/components/ui/safe-area-screen";
import { useWorkoutDraft } from "@/contexts/workout-draft-context";
import { createWorkoutQueryFn } from "@/lib/api";
import { useAppThemeColor } from "@/theme/app-theme";

const formSchema = z.object({
  exercises: z.array(z.unknown()).min(1, "Add at least one exercise"),
  name: z.string().trim().min(1, "Enter a workout name"),
});

export default function CreateWorkoutModal() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const muted = useAppThemeColor("mutedForeground");
  const primary = useAppThemeColor("primary");

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState<{
    base64: string;
    uri: string;
  } | null>(null);

  const [selected, setSelected] = useWorkoutDraft();

  const coverSource = coverImage ? { uri: coverImage.uri } : null;

  const createWorkout = useMutation({
    mutationFn: () =>
      createWorkoutQueryFn({
        description: description.trim() || undefined,
        exercises: selected.map(({ id, reps, rest, sets }) => ({
          id,
          reps,
          rest,
          sets,
        })),
        image: coverImage?.base64,
        name: name.trim(),
      }),
    onError: () => Alert.alert("Could not create workout", "Please try again."),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["workouts"] });
      router.back();
    },
  });

  const updateExercise = (
    id: string,
    field: "reps" | "rest" | "sets",
    amount: number,
  ) =>
    setSelected((current) =>
      current.map((exercise) =>
        exercise.id === id
          ? {
              ...exercise,
              [field]: Math.max(1, exercise[field] + amount),
            }
          : exercise,
      ),
    );

  const saveWorkout = () => {
    const result = formSchema.safeParse({ exercises: selected, name });
    if (!result.success) {
      Alert.alert("Missing details", result.error.issues[0].message);
      return;
    }
    createWorkout.mutate();
  };

  const pickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Photo permission needed",
        "Allow photo access in Settings to choose a workout cover.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Open Settings", onPress: Linking.openSettings },
        ],
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      aspect: [16, 9],
      base64: true,
      mediaTypes: ["images"],
      quality: 0.6,
    });

    const image = result.assets?.[0];
    if (!result.canceled && image?.base64)
      setCoverImage({ base64: image.base64, uri: image.uri });
  };

  return (
    <SafeAreaScreen edges={["top"]}>
      <ScrollView
        contentContainerClassName="px-5 pt-3 pb-8"
        keyboardShouldPersistTaps="handled"
      >
        <View className="h-14 flex-row items-center justify-between">
          <Pressable onPress={router.back}>
            <Text className="font-inter-medium text-[13px] text-destructive">
              Cancel
            </Text>
          </Pressable>
          <Text className="font-inter-bold text-[16px] text-foreground">
            Create Workout
          </Text>
          <Pressable disabled={createWorkout.isPending} onPress={saveWorkout}>
            <Text className="font-inter-medium text-[13px] text-primary">
              Save
            </Text>
          </Pressable>
        </View>

        <View className="mt-4 gap-5">
          <Pressable
            className="h-44 items-center justify-center overflow-hidden rounded-xl border border-input-border bg-muted"
            onPress={pickImage}
          >
            {coverSource ? (
              <Image className="h-full w-full" source={coverSource} />
            ) : (
              <>
                <Feather color={muted} name="image" size={28} />
                <Text className="mt-2 font-inter-medium text-[13px] text-muted-foreground">
                  Choose Cover Image
                </Text>
              </>
            )}
            {coverSource && (
              <View className="absolute bottom-3 rounded-full bg-black/60 px-4 py-2">
                <Text className="font-inter-semibold text-[12px] text-white">
                  Change Image
                </Text>
              </View>
            )}
          </Pressable>

          <View className="gap-2">
            <Text className="font-inter-medium text-[14px] text-foreground">
              Workout Name
            </Text>
            <TextInput
              className="h-14 rounded-xl border border-input-border bg-input px-4 font-inter text-[14px] text-foreground"
              onChangeText={setName}
              maxLength={80}
              placeholder="e.g. Push Day"
              placeholderTextColor={muted}
              selectionColor={primary}
              value={name}
            />
          </View>

          <View className="gap-2">
            <Text className="font-inter-medium text-[14px] text-foreground">
              Description (Optional)
            </Text>
            <TextInput
              className="h-24 rounded-xl border border-input-border bg-input px-4 py-3 font-inter text-[14px] text-foreground"
              multiline
              onChangeText={setDescription}
              maxLength={500}
              placeholder="Add a description..."
              placeholderTextColor={muted}
              selectionColor={primary}
              textAlignVertical="top"
              value={description}
            />
          </View>

          <View>
            <Text className="font-inter-bold text-[16px] text-foreground">
              Exercises
            </Text>
            <Text className="mb-3 mt-1 font-inter text-[12px] text-muted-foreground">
              {selected.length} exercises added
            </Text>

            {selected.map((exercise) => (
              <View
                className="mb-3 rounded-xl border border-border bg-card p-3"
                key={exercise.id}
              >
                <View className="flex-row items-center">
                  {exercise.image ? (
                    <Image
                      className="h-11 w-12 rounded-lg bg-muted"
                      source={{ uri: exercise.image }}
                    />
                  ) : (
                    <View className="h-11 w-12 items-center justify-center rounded-lg bg-muted">
                      <Feather color={muted} name="image" size={17} />
                    </View>
                  )}
                  <View className="ml-3 flex-1">
                    <Text className="font-inter-semibold text-[13px] text-foreground">
                      {exercise.name}
                    </Text>
                    <Text className="mt-1 font-inter text-[11px] text-muted-foreground">
                      {exercise.muscles}
                    </Text>
                  </View>
                  <Pressable
                    onPress={() =>
                      setSelected((current) =>
                        current.filter(({ id }) => id !== exercise.id),
                      )
                    }
                  >
                    <Feather color={muted} name="x" size={20} />
                  </Pressable>
                </View>

                {(
                  [
                    ["Sets", "sets", exercise.sets, 1],
                    ["Reps", "reps", exercise.reps, 1],
                    ["Rest Time", "rest", `${exercise.rest} sec`, 15],
                  ] as const
                ).map(([label, field, value, step]) => (
                  <View
                    className="mt-3 flex-row items-center justify-between"
                    key={field}
                  >
                    <Text className="font-inter text-[12px] text-muted-foreground">
                      {label}
                    </Text>
                    <View className="flex-row items-center gap-3">
                      <Pressable
                        className="h-8 w-8 items-center justify-center rounded-lg bg-muted"
                        onPress={() =>
                          updateExercise(exercise.id, field, -step)
                        }
                      >
                        <Feather color={muted} name="minus" size={15} />
                      </Pressable>
                      <Text className="w-14 text-center font-inter-semibold text-[12px] text-foreground">
                        {value}
                      </Text>
                      <Pressable
                        className="h-8 w-8 items-center justify-center rounded-lg bg-muted"
                        onPress={() => updateExercise(exercise.id, field, step)}
                      >
                        <Feather color={muted} name="plus" size={15} />
                      </Pressable>
                    </View>
                  </View>
                ))}
              </View>
            ))}

            <Button
              leftIcon={<Feather color={primary} name="plus" size={18} />}
              onPress={() => router.push("/workout/exercises")}
              size="sm"
              variant="outline"
            >
              Add Exercise
            </Button>
          </View>
        </View>
      </ScrollView>

      <LoadingDialog
        message="Saving workout..."
        visible={createWorkout.isPending}
      />
    </SafeAreaScreen>
  );
}
