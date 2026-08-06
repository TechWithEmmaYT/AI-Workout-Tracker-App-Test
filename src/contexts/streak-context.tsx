import { useQuery } from "@tanstack/react-query";
import { createContext, useContext, useState } from "react";

import StreakBottomSheet from "@/components/home/streak-bottom-sheet";
import { getHistoryQueryFn } from "@/lib/api";
import { getStreakSummary } from "@/lib/streak";

type StreakContextValue = {
  currentStreak: number;
  showStreak: () => void;
};

const StreakContext = createContext<StreakContextValue | null>(null);

export function StreakProvider({ children }: React.PropsWithChildren) {
  const [visible, setVisible] = useState(false);
  const { data: history } = useQuery({
    queryKey: ["history"],
    queryFn: getHistoryQueryFn,
  });
  const streak = getStreakSummary(
    (history ?? []).map((item) => new Date(item.completedAt)),
  );

  return (
    <StreakContext.Provider
      value={{
        currentStreak: streak.currentStreak,
        showStreak: () => setVisible(true),
      }}
    >
      {children}
      <StreakBottomSheet
        bestStreak={streak.bestStreak}
        completedDays={streak.completedDays}
        currentStreak={streak.currentStreak}
        onClose={() => setVisible(false)}
        visible={visible}
      />
    </StreakContext.Provider>
  );
}

export function useStreak() {
  const value = useContext(StreakContext);
  if (!value) throw new Error("useStreak must be used inside its provider");
  return value;
}
