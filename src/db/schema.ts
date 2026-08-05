import { pgEnum, pgTable, text, timestamp } from "drizzle-orm/pg-core";
import { user } from "./auth-schema";

export * from "./auth-schema";

export const genderEnum = pgEnum("gender", ["male", "female"]);
export const goalEnum = pgEnum("goal", [
  "build-muscle",
  "lose-fat",
  "maintain",
]);
export const experienceEnum = pgEnum("experience", [
  "beginner",
  "intermediate",
  "advanced",
]);

export const profiles = pgTable("profiles", {
  userId: text()
    .primaryKey()
    .references(() => user.id, { onDelete: "cascade" }),
  gender: genderEnum().notNull(),
  goal: goalEnum().notNull(),
  experience: experienceEnum().notNull(),
  createdAt: timestamp({ withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp({ withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
});

export type Profile = typeof profiles.$inferSelect;
export type NewProfile = typeof profiles.$inferInsert;
