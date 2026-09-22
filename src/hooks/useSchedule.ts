"use client";

import { useEffect, useRef } from "react";

export type ScheduleStep = readonly [ms: number, run: () => void];

/**
 * Fires each step once per `run` rising edge. Pausing keeps the schedule's own clock, so
 * resuming picks up where it stopped instead of replaying or skipping steps.
 */
export function useSchedule(
  steps: readonly ScheduleStep[],
  { run, paused = false }: { run: boolean; paused?: boolean },
): void {
  const stepsRef = useRef(steps);
  const consumed = useRef(0);
  const fired = useRef(new Set<number>());

  useEffect(() => {
    stepsRef.current = steps;
  });

  // Declared first so a fresh cycle resets before the timers below are armed.
  useEffect(() => {
    if (!run) return;
    consumed.current = 0;
    fired.current.clear();
  }, [run]);

  useEffect(() => {
    if (!run || paused) return;
    const base = consumed.current;
    const t0 = performance.now();
    const timers = stepsRef.current.flatMap(([ms, fn], i) =>
      fired.current.has(i)
        ? []
        : [
            window.setTimeout(() => {
              fired.current.add(i);
              fn();
            }, Math.max(0, ms - base)),
          ],
    );
    return () => {
      timers.forEach(clearTimeout);
      consumed.current = base + (performance.now() - t0);
    };
  }, [run, paused]);
}
