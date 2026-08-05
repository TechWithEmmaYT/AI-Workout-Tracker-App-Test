import { expoClient } from "@better-auth/expo/client";
import type { BetterAuthClientPlugin } from "better-auth";
import { createAuthClient } from "better-auth/react";
import Constants from "expo-constants";
import * as SecureStore from "expo-secure-store";

const localURL = `http://${Constants.expoConfig?.hostUri ?? "localhost:8081"}`;
const baseURL =
  process.env.EXPO_PUBLIC_API_URL?.replace("http://localhost:8081", localURL) ??
  localURL;

export const authClient = createAuthClient({
  baseURL,
  plugins: [
    expoClient({
      scheme: "aiworkouttrackerapp",
      storage: SecureStore,
      storagePrefix: "myworkout",
    }) as BetterAuthClientPlugin,
  ],
});
