"use client";

import { useEffect, useRef } from "react";

export type ScheduleStep = readonly [ms: number, run: () => void];

/** Fires each step once per `run` rising edge; restart a cycle by toggling `run` off and on. */
export function useSchedule(steps: readonly ScheduleStep[], { run }: { run: boolean }): void {
  const stepsRef = useRef(steps);

  useEffect(() => {
    stepsRef.current = steps;
  });

  useEffect(() => {
    if (!run) return;
    const timers = stepsRef.current.map(([ms, fn]) => setTimeout(fn, ms));
    return () => timers.forEach(clearTimeout);
  }, [run]);
}
