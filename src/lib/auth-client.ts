import { expoClient } from "@better-auth/expo/client";
import type { BetterAuthClientPlugin } from "better-auth";
import { createAuthClient } from "better-auth/react";
import * as SecureStore from "expo-secure-store";

import type { auth } from "@/lib/auth";

export const authClient = createAuthClient<typeof auth>({
  baseURL: process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:8081",
  plugins: [
    expoClient({
      scheme: "aiworkouttrackerapp",
      storage: SecureStore,
      storagePrefix: "myworkout",
    }) as BetterAuthClientPlugin,
  ],
});
