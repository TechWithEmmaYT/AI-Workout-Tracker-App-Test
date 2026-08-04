import { Feather } from "@expo/vector-icons";
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

import Button from "@/components/ui/button";
import SafeAreaScreen from "@/components/ui/safe-area-screen";
import { useWorkoutDraft } from "@/contexts/workout-draft-context";
import { exercises } from "@/lib/exercises";
import { useAppThemeColor } from "@/theme/app-theme";

export default function CreateWorkoutModal() {
  const router = useRouter();
  const muted = useAppThemeColor("mutedForeground");
  const primary = useAppThemeColor("primary");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const { selected, toggleExercise, updateExercise } = useWorkoutDraft();

  const selectedExercises = selected.map((settings) => ({
    ...exercises.find(({ id }) => id === settings.id)!,
    ...settings,
  }));
  const coverSource = coverImage
    ? { uri: coverImage }
    : selectedExercises[0]?.image;

  const saveWorkout = () => {
    if (!name.trim() || selected.length === 0) {
      Alert.alert("Missing details", "Add a name and at least one exercise.");
      return;
    }
    Alert.alert("Workout created", name, [{ text: "Done", onPress: router.back }]);
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
      mediaTypes: ["images"],
      quality: 0.8,
    });

    if (!result.canceled) setCoverImage(result.assets[0].uri);
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
          <Pressable onPress={saveWorkout}>
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

            {selectedExercises.map((exercise) => (
              <View
                className="mb-3 rounded-xl border border-border bg-card p-3"
                key={exercise.id}
              >
                <View className="flex-row items-center">
                  <Image
                    className="h-11 w-12 rounded-lg bg-muted"
                    source={exercise.image}
                  />
                  <View className="ml-3 flex-1">
                    <Text className="font-inter-semibold text-[13px] text-foreground">
                      {exercise.name}
                    </Text>
                    <Text className="mt-1 font-inter text-[11px] text-muted-foreground">
                      {exercise.muscles}
                    </Text>
                  </View>
                  <Pressable onPress={() => toggleExercise(exercise.id)}>
                    <Feather color={muted} name="x" size={20} />
                  </Pressable>
                </View>

                {([
                  ["Sets", "sets", exercise.sets, 1],
                  ["Reps", "reps", exercise.reps, 1],
                  ["Rest Time", "rest", `${exercise.rest} sec`, 15],
                ] as const).map(([label, field, value, step]) => (
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
                        onPress={() => updateExercise(exercise.id, field, -step)}
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
    </SafeAreaScreen>
  );
}
