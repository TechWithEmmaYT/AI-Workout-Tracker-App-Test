import { useEffect, useRef, useState } from "react";

// Manages real-time elapsed session time
// and rest timer countdown using wall-clock timestamps

export function useWorkoutTimer() {
  const [startedAt] = useState(() => Date.now());
  const [elapsed, setElapsed] = useState(0);
  const [rest, setRest] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const accumulatedRef = useRef(0);
  const lastResumeAt = useRef(Date.now());
  const restEndsAt = useRef<number | null>(null);

  // Computes elapsed session time
  // and rest countdown from wall-clock timestamps on interval
  useEffect(() => {
    if (!isPaused) lastResumeAt.current = Date.now();

    const timer = setInterval(() => {
      if (!isPaused)
        setElapsed(
          accumulatedRef.current + (Date.now() - lastResumeAt.current) / 1000,
        );
      if (restEndsAt.current !== null)
        setRest(Math.max(0, (restEndsAt.current - Date.now()) / 1000));
    }, 500);

    return () => clearInterval(timer);
  }, [isPaused]);

  // Toggles pause/resume state and folds running segment into accumulated time
  const togglePause = () => {
    if (!isPaused)
      accumulatedRef.current += (Date.now() - lastResumeAt.current) / 1000;
    setIsPaused((p) => !p);
  };

  // Starts a rest timer countdown for specified duration in seconds
  const startRest = (seconds: number) => {
    restEndsAt.current = Date.now() + seconds * 1000;
    setRest(seconds);
  };

  // Cancels active rest countdown timer
  const skipRest = () => {
    restEndsAt.current = null;
    setRest(0);
  };

  return {
    elapsed,
    isPaused,
    rest,
    startedAt,
    skipRest,
    startRest,
    togglePause,
  };
}

//
//
//
//
//
//
//
//
//
//
//
//
//
//
// export function useWorkoutTimer() {
//   const [startedAt] = useState(() => Date.now());
//   const [elapsed, setElapsed] = useState(0);
//   const [rest, setRest] = useState(0);
//   const [isPaused, setIsPaused] = useState(false);
//   const accumulatedRef = useRef(0);
//   const lastResumeAt = useRef(0);
//   const restEndsAt = useRef<number | null>(null);

//   // Computes elapsed session time
//   // and rest countdown from wall-clock timestamps on interval
//   useEffect(() => {
//     lastResumeAt.current = Date.now();
//     const timer = setInterval(() => {
//       setElapsed(
//         isPaused
//           ? accumulatedRef.current
//           : accumulatedRef.current + (Date.now() - lastResumeAt.current) / 1000,
//       );
//       if (restEndsAt.current !== null)
//         setRest(Math.max(0, (restEndsAt.current - Date.now()) / 1000));
//     }, 500);
//     return () => clearInterval(timer);
//   }, [isPaused]);

//   // Toggles pause/resume state and folds running segment into accumulated time
//   const togglePause = () => {
//     if (!isPaused)
//       accumulatedRef.current += (Date.now() - lastResumeAt.current) / 1000;
//     setIsPaused((value) => !value);
//   };

//   // Cancels active rest countdown timer
//   const skipRest = () => {
//     restEndsAt.current = null;
//     setRest(0);
//   };

//   // Starts a rest timer countdown for specified duration in seconds
//   const startRest = (seconds: number) => {
//     restEndsAt.current = Date.now() + seconds * 1000;
//     setRest(seconds);
//   };

//   return {
//     elapsed,
//     isPaused,
//     rest,
//     startedAt,
//     skipRest,
//     startRest,
//     togglePause,
//   };
// }
