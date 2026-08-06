import { differenceInCalendarDays, startOfDay, subDays } from "date-fns";

export type StreakSummary = {
  bestStreak: number;
  completedDays: Date[];
  currentStreak: number;
};

export function getStreakSummary(completedDates: Date[]): StreakSummary {
  // Keep one timestamp per calendar day, sorted oldest → newest.
  const days = [
    ...new Set(completedDates.map((date) => startOfDay(date).getTime())),
  ].sort((a, b) => a - b);
  if (days.length === 0) {
    return { bestStreak: 0, completedDays: [], currentStreak: 0 };
  }

  // Start counting from today; if today isn't done yet, count from yesterday.
  let cursor = startOfDay(new Date());
  if (!days.includes(cursor.getTime())) {
    cursor = subDays(cursor, 1);
  }

  // Walk backwards one day at a time while the day is in the list.
  let currentStreak = 0;
  while (days.includes(cursor.getTime())) {
    currentStreak++;
    cursor = subDays(cursor, 1);
  }

  // Longest run: walk the sorted list, extending when days are consecutive.
  let bestStreak = 0;
  let run = 0;
  let prev: number | null = null;
  for (const day of days) {
    run =
      prev !== null && differenceInCalendarDays(day, prev) === 1 ? run + 1 : 1;
    bestStreak = Math.max(bestStreak, run);
    prev = day;
  }

  return {
    bestStreak,
    completedDays: days.map((day) => new Date(day)),
    currentStreak,
  };
}
