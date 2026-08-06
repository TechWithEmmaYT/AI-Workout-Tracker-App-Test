import { differenceInCalendarDays, startOfDay, subDays } from "date-fns";

export type StreakSummary = {
  bestStreak: number;
  completedDays: Date[];
  currentStreak: number;
};

export function getStreakSummary(completedDates: Date[]): StreakSummary {
  const days = [
    ...new Set(completedDates.map((date) => startOfDay(date).getTime())),
  ].sort((a, b) => a - b);
  if (days.length === 0) {
    return { bestStreak: 0, completedDays: [], currentStreak: 0 };
  }

  let cursor = startOfDay(new Date());
  if (!days.includes(cursor.getTime())) {
    // Today not worked out yet — yesterday still counts as "on the streak".
    cursor = subDays(cursor, 1);
  }

  let currentStreak = 0;
  while (days.includes(cursor.getTime())) {
    currentStreak++;
    cursor = subDays(cursor, 1);
  }

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
