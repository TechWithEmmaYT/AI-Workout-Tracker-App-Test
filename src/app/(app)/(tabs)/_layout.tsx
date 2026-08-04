import { Feather } from "@expo/vector-icons";
import { Tabs, useRouter } from "expo-router";
import { Pressable, View } from "react-native";

import { useAppThemeColor } from "@/theme/app-theme";

export default function TabLayout() {
  const router = useRouter();
  const background = useAppThemeColor("background");
  const mutedForeground = useAppThemeColor("mutedForeground");
  const primary = useAppThemeColor("primary");

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        sceneStyle: {
          backgroundColor: "transparent",
          paddingTop: 10,
        },
        tabBarActiveTintColor: primary,
        tabBarInactiveTintColor: mutedForeground,
        tabBarLabelStyle: {
          fontFamily: "Inter_500Medium",
          fontSize: 10,
        },
        tabBarStyle: {
          backgroundColor: background,
          borderTopWidth: 0,
          bottom: 10,
          height: 66,
          left: 13,
          paddingBottom: 7,
          paddingTop: 6,
          position: "relative",
          borderRadius: 50,
          marginHorizontal: 10,
          shadowColor: "#333",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarAccessibilityLabel: "Home tab",
          tabBarIcon: ({ color }) => (
            <Feather color={color} name="home" size={21} />
          ),
          title: "Home",
        }}
      />
      <Tabs.Screen
        name="workouts"
        options={{
          tabBarAccessibilityLabel: "Workouts tab",
          tabBarIcon: ({ color }) => (
            <Feather color={color} name="activity" size={21} />
          ),
          title: "Workouts",
        }}
      />
      <Tabs.Screen
        listeners={{
          tabPress: (event) => {
            event.preventDefault();
            router.push("/workout/create");
          },
        }}
        name="create"
        options={{
          tabBarAccessibilityLabel: "Create workout",
          tabBarButton: ({ onPress }) => (
            <Pressable
              accessibilityLabel="Create workout"
              accessibilityRole="button"
              className="flex-1 items-center justify-center"
              onPress={onPress}
            >
              <View className="-mt-5 h-14 w-14 items-center justify-center rounded-full bg-primary shadow-lg">
                <Feather color="white" name="plus" size={27} />
              </View>
            </Pressable>
          ),
          tabBarLabel: () => null,
          title: "Create",
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          tabBarAccessibilityLabel: "History tab",
          tabBarIcon: ({ color }) => (
            <Feather color={color} name="calendar" size={21} />
          ),
          title: "History",
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarAccessibilityLabel: "Profile tab",
          tabBarIcon: ({ color }) => (
            <Feather color={color} name="user" size={21} />
          ),
          title: "Profile",
        }}
      />
    </Tabs>
  );
}
