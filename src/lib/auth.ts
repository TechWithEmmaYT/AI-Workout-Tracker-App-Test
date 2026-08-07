import { expo } from "@better-auth/expo";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { APIError, createAuthMiddleware } from "better-auth/api";

import { db, profiles } from "@/db";
import * as schema from "@/db/schema";
import { onboardingValuesSchema } from "@/lib/validation/onboarding-schema";

const getOnboarding = (body: unknown) => {
  const result = onboardingValuesSchema.safeParse(body);
  if (!result.success) {
    throw new APIError("BAD_REQUEST", {
      message: "Invalid onboarding details",
    });
  }
  return result.data;
};
console.log(process.env.BETTER_AUTH_URL, "process.env.BETTER_AUTH_URL");

const AUTH_URL = process.env.BETTER_AUTH_URL!;

export const auth = betterAuth({
  appName: "MyWorkout",
  baseURL: AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET!,
  database: drizzleAdapter(db, { provider: "pg", schema }),
  trustedOrigins: [
    "aiworkouttrackerapp://",
    "aiworkouttrackerapp://*",
    "exp://",
    "exp://*",
    "exp://**",
    "exp://192.168.*.*:*/**",
    "http://localhost:*",
    "http://192.168.*.*:*",
    AUTH_URL,
  ].filter(Boolean),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
  },
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-up/email") getOnboarding(ctx.body);
    }),
    after: createAuthMiddleware(async (ctx) => {
      if (ctx.path !== "/sign-up/email" || !ctx.context.newSession) return;
      await db.insert(profiles).values({
        userId: ctx.context.newSession.user.id,
        ...getOnboarding(ctx.body),
      });
    }),
  },
  socialProviders: {},
  plugins: [expo()],
});

export type AuthSession = typeof auth.$Infer.Session;
