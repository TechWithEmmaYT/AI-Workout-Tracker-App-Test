import { useEffect, useRef, useState } from "react";

export function useWorkoutTimer() {
  const [startedAt] = useState(() => Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [rest, setRest] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const accumulatedRef = useRef(0);
  const lastResumeAt = useRef(0);
  const restEndsAt = useRef<number | null>(null);

  useEffect(() => {
    lastResumeAt.current = Date.now();
    const timer = setInterval(() => {
      setElapsed(
        isPaused
          ? accumulatedRef.current
          : accumulatedRef.current +
              (Date.now() - lastResumeAt.current) / 1000,
      );
      if (restEndsAt.current !== null)
        setRest(Math.max(0, (restEndsAt.current - Date.now()) / 1000));
    }, 500);
    return () => clearInterval(timer);
  }, [isPaused]);

  const togglePause = () => {
    if (!isPaused)
      accumulatedRef.current += (Date.now() - lastResumeAt.current) / 1000;
    setIsPaused((value) => !value);
  };

  return {
    elapsed,
    isPaused,
    rest,
    startedAt,
    skipRest: () => {
      restEndsAt.current = null;
      setRest(0);
    },
    startRest: (seconds: number) => {
      restEndsAt.current = Date.now() + seconds * 1000;
      setRest(seconds);
    },
    togglePause,
  };
}
