import {
  eachDayOfInterval,
  eachWeekOfInterval,
  endOfWeek,
  format,
  isAfter,
  isSameDay,
  startOfDay,
  startOfWeek,
  subWeeks,
} from "date-fns";
import { useRef, useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import { cn } from "@/lib/utils";

// Optional controlled props: the parent can pass the selected day (value)
// and be notified when it changes (onChange). When omitted, the calendar
// manages its own selection.
type WeekCalendarProps = {
  onChange?: (date: Date) => void;
  value?: Date;
};

export default function WeekCalendar({ onChange, value }: WeekCalendarProps) {
  const { width } = useWindowDimensions(); // screen width: each week page takes the full width for paging
  const scrollRef = useRef<ScrollView>(null); // ref to auto-scroll to the current week on mount
  const today = startOfDay(new Date()); // today at midnight, used for "is future" checks

  // Internal fallback selection; "selected" prefers the parent's value
  const [internal, setInternal] = useState(today);
  const selected = value ?? internal;

  // Build the calendar: 3 weeks (2 previous + the current one), each as an
  // array of its 7 days. eachWeekOfInterval returns one start-of-week date
  // per week, then eachDayOfInterval expands it into the 7 day cells.
  const weeks = eachWeekOfInterval({
    start: subWeeks(startOfWeek(today), 2), // start at the Sunday 2 weeks ago
    end: endOfWeek(today), // end at the Saturday of the current week
  }).map((weekStart) =>
    eachDayOfInterval({
      start: weekStart, // Sunday of that week
      end: endOfWeek(weekStart), // Saturday of that week
    }),
  );

  // Selecting a day: update internal state and, if controlled, tell the parent
  const selectDate = (date: Date) => {
    setInternal(date);
    onChange?.(date);
  };

  return (
    <ScrollView
      className="-mx-5 mt-5 flex-grow-0"
      horizontal
      onContentSizeChange={() =>
        scrollRef.current?.scrollToEnd({ animated: false })
      }
      pagingEnabled
      ref={scrollRef}
      showsHorizontalScrollIndicator={false}
    >
      {weeks.map((week) => (
        <View
          className="flex-row gap-1.5 px-5"
          key={week[0].getTime()}
          style={{ width }}
        >
          {week.map((date) => {
            const isSelected = isSameDay(date, selected);
            const isFuture = isAfter(date, today);

            return (
              <Pressable
                accessibilityLabel={date.toLocaleDateString("en-US", {
                  dateStyle: "full",
                })}
                accessibilityRole="button"
                accessibilityState={{
                  disabled: isFuture,
                  selected: isSelected,
                }}
                className={cn(
                  "h-[88px] flex-1 items-center justify-center rounded-2xl border",
                  isSelected
                    ? "border-primary bg-card"
                    : "border-border bg-background/80",
                  isFuture && "opacity-40",
                )}
                disabled={isFuture}
                key={date.getTime()}
                onPress={() => selectDate(date)}
              >
                <Text className="font-inter-medium text-[10px] text-muted-foreground">
                  {format(date, "EE").toUpperCase()}
                </Text>
                <Text className="mt-2 font-inter-bold text-[16px] text-foreground">
                  {format(date, "dd")}
                </Text>
                <View
                  className={cn(
                    "mt-2 h-1.5 w-1.5 rounded-full bg-border",
                    isSelected && "bg-primary",
                  )}
                />
              </Pressable>
            );
          })}
        </View>
      ))}
    </ScrollView>
  );
}
