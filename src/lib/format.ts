import { format } from "date-fns";

// Convert a duration in seconds into a short human-readable string.
// Example: 52 minutes -> "52 min", 3720 seconds (1h 2m) -> "1h 2m".
export const formatDuration = (seconds: number) => {
  // Whole hours from the total seconds (Math.floor drops the remainder)
  const hours = Math.floor(seconds / 3600);
  // Remaining minutes after the hours are removed, rounded to the nearest whole minute
  const minutes = Math.round((seconds % 3600) / 60);
  // Show hours only when there is at least one full hour
  return hours > 0 ? `${hours}h ${minutes}m` : `${minutes} min`;
};

// Convert an ISO date string (e.g. "2026-08-06T08:45:00.000Z") into a readable
// timestamp like "Thu, Aug 6, 8:45 AM" for the history screens.
export const formatSessionDate = (date: string) =>
  format(new Date(date), "EEE, MMM d, h:mm a");
