import { useEffect, useState } from "react";

export function useWorkoutTimer() {
  const [elapsed, setElapsed] = useState(0);
  const [rest, setRest] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setElapsed((time) => time + 1);
      setRest((time) => Math.max(0, time - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [isPaused]);

  return {
    elapsed,
    isPaused,
    rest,
    skipRest: () => setRest(0),
    startRest: (seconds: number) => setRest(seconds),
    togglePause: () => setIsPaused((value) => !value),
  };
}
