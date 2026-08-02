import { useRef, useState } from "react";
import {
  Pressable,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";

import { cn } from "@/lib/utils";

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const midnight = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();

export default function WeekCalendar() {
  const { width } = useWindowDimensions();
  const scrollRef = useRef<ScrollView>(null);
  const today = midnight(new Date());
  const [selected, setSelected] = useState(today);

  const start = new Date(today);
  start.setDate(start.getDate() - start.getDay() - 14);
  const days = Array.from({ length: 21 }, (_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() + index);
    return date;
  });

  return (
    <ScrollView
      ref={scrollRef}
      className="-mx-4 mt-5 flex-grow-0 px-4"
      decelerationRate="fast"
      horizontal
      onContentSizeChange={() =>
        scrollRef.current?.scrollToEnd({ animated: false })
      }
      showsHorizontalScrollIndicator={false}
      snapToInterval={width}
    >
      {days.map((date) => {
        const time = midnight(date);
        const isSelected = time === selected;
        const isFuture = time > today;

        return (
          <TouchableOpacity
            key={time}
            accessibilityLabel={date.toLocaleDateString("en-US", {
              dateStyle: "full",
            })}
            accessibilityRole="button"
            accessibilityState={{ disabled: isFuture, selected: isSelected }}
            className="items-center"
            disabled={isFuture}
            onPress={() => setSelected(time)}
            style={{ width: width / 7 }}
          >
            <Text
              className={cn(
                "font-inter-medium text-[12px]",
                isSelected ? "text-primary" : "text-muted-foreground",
                isFuture && "opacity-40",
              )}
            >
              {weekdays[date.getDay()]}
            </Text>
            <View
              className={cn(
                "mt-2 h-11 w-11 items-center justify-center rounded-full border",
                isSelected
                  ? "border-primary bg-primary"
                  : "border-border bg-background",
                isFuture && "opacity-40",
              )}
            >
              <Text
                className={cn(
                  "font-inter-semibold text-[15px]",
                  isSelected ? "text-primary-foreground" : "text-foreground",
                )}
              >
                {date.getDate()}
              </Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
}
