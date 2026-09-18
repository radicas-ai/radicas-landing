"use client";

import { useEffect, useRef, useState } from "react";

export interface DwellOptions {
  dwell: number;
  running: boolean;
  onDone: () => void;
  resetKey?: unknown;
}

/** Progress 0..1 over `dwell` ms. Pausing keeps the elapsed time; it resumes where it stopped. */
export function useDwell({ dwell, running, onDone, resetKey }: DwellOptions): number {
  const [progress, setProgress] = useState(0);
  const elapsed = useRef(0);
  const doneRef = useRef(onDone);

  useEffect(() => {
    doneRef.current = onDone;
  });

  useEffect(() => {
    elapsed.current = 0;
    setProgress(0);
  }, [resetKey, dwell]);

  useEffect(() => {
    if (!running) return;
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      elapsed.current += now - last;
      last = now;
      const p = Math.min(1, elapsed.current / dwell);
      if (p >= 1) {
        elapsed.current = 0;
        setProgress(0);
        doneRef.current();
      } else {
        setProgress(p);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running, dwell]);

  return progress;
}
