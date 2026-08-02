import { Feather } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  Alert,
  Image,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Screen from "@/components/ui/screen";
import { exercises } from "@/lib/exercises";
import { useAppThemeColor } from "@/theme/app-theme";

type WorkoutExercise = {
  id: string;
  reps: number;
  rest: number;
  sets: number;
};

export default function CreateWorkoutPage() {
  const router = useRouter();
  const muted = useAppThemeColor("mutedForeground");
  const primary = useAppThemeColor("primary");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selected, setSelected] = useState<WorkoutExercise[]>([]);

  const selectedExercises = selected.map((settings) => ({
    ...exercises.find(({ id }) => id === settings.id)!,
    ...settings,
  }));
  const coverSource = coverImage
    ? { uri: coverImage }
    : selectedExercises[0]?.image;
  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();
    return exercises.filter(({ muscles, name }) =>
      `${name} ${muscles}`.toLowerCase().includes(search),
    );
  }, [query]);

  const toggleExercise = (id: string) =>
    setSelected((current) =>
      current.some((exercise) => exercise.id === id)
        ? current.filter((exercise) => exercise.id !== id)
        : [...current, { id, reps: 10, rest: 90, sets: 3 }],
    );

  const updateExercise = (
    id: string,
    field: "reps" | "rest" | "sets",
    amount: number,
  ) =>
    setSelected((current) =>
      current.map((exercise) =>
        exercise.id === id
          ? { ...exercise, [field]: Math.max(1, exercise[field] + amount) }
          : exercise,
      ),
    );

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
    <Screen edges={["top"]}>
      <ScrollView
        contentContainerClassName="px-5 pt-3 pb-8"
        keyboardShouldPersistTaps="handled"
      >
        <View className="h-14 flex-row items-center justify-between">
          <Pressable onPress={router.back}>
            <Text className="font-inter-medium text-[13px] text-primary">
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

          <Input
            label="Workout Name"
            onChangeText={setName}
            placeholder="e.g. Push Day"
            value={name}
          />

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
                className="mb-3 rounded-xl border border-border bg-background p-3"
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
              onPress={() => setSheetOpen(true)}
              size="sm"
              variant="outline"
            >
              Add Exercise
            </Button>
          </View>
        </View>
      </ScrollView>

      <Modal
        animationType="slide"
        onRequestClose={() => setSheetOpen(false)}
        statusBarTranslucent
        transparent
        visible={sheetOpen}
      >
        <Pressable
          className="flex-1 justify-end bg-black/40"
          onPress={() => setSheetOpen(false)}
        >
          <Pressable
            className="max-h-[75%] rounded-t-3xl bg-background px-5 pb-8 pt-3"
            onPress={() => {}}
          >
            <View className="mb-4 h-1 w-10 self-center rounded-full bg-border" />
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="font-inter-bold text-[18px] text-foreground">
                Add Exercise
              </Text>
              <Pressable onPress={() => setSheetOpen(false)}>
                <Text className="font-inter-semibold text-[13px] text-primary">
                  Done
                </Text>
              </Pressable>
            </View>

            <View className="mb-3 h-11 flex-row items-center rounded-xl bg-muted px-4">
              <Feather color={muted} name="search" size={18} />
              <TextInput
                className="ml-3 flex-1 font-inter text-[13px] text-foreground"
                onChangeText={setQuery}
                placeholder="Search exercises..."
                placeholderTextColor={muted}
                selectionColor={primary}
                value={query}
              />
            </View>

            <ScrollView keyboardShouldPersistTaps="handled">
              {filtered.map((exercise) => {
                const isSelected = selected.some(
                  ({ id }) => id === exercise.id,
                );
                return (
                  <Pressable
                    className="h-16 flex-row items-center border-b border-border"
                    key={exercise.id}
                    onPress={() => toggleExercise(exercise.id)}
                  >
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
                    <Feather
                      color={isSelected ? primary : muted}
                      name={isSelected ? "check-circle" : "circle"}
                      size={21}
                    />
                  </Pressable>
                );
              })}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </Screen>
  );
}
