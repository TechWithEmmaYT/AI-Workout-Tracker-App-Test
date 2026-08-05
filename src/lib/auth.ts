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

export const auth = betterAuth({
  appName: "MyWorkout",
  database: drizzleAdapter(db, { provider: "pg", schema }),
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
  trustedOrigins: [
    "aiworkouttrackerapp://",
    ...(process.env.NODE_ENV === "development"
      ? ["exp://", "exp://**", "exp://192.168.*.*:*/**"]
      : []),
  ],
});

export type AuthSession = typeof auth.$Infer.Session;
