import { Feather } from "@expo/vector-icons";
import { Tabs } from "expo-router";

import { useAppThemeColor } from "@/theme/app-theme";

export default function TabLayout() {
  const background = useAppThemeColor("background");
  const border = useAppThemeColor("border");
  const mutedForeground = useAppThemeColor("mutedForeground");
  const primary = useAppThemeColor("primary");

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        sceneStyle: {
          backgroundColor: background,
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
          borderTopColor: border,
          borderTopWidth: 1,
          height: 66,
          paddingBottom: 7,
          paddingTop: 6,
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
        name="discover"
        options={{
          tabBarAccessibilityLabel: "Discover tab",
          tabBarIcon: ({ color }) => (
            <Feather color={color} name="search" size={21} />
          ),
          title: "Discover",
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
