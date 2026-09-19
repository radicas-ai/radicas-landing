"use client";

import { useCallback, useEffect, useRef, type RefObject } from "react";

/** Resuming must never land on an advance; rewind far enough to leave a beat. */
const RESUME_GRACE_MS = 1200;

export interface DwellOptions {
  dwell: number;
  running: boolean;
  onDone: () => void;
  resetKey?: unknown;
  /** Progress 0..1 is written here as a custom property, so no frame costs a React render. */
  target: RefObject<HTMLElement | null>;
  varName?: string;
}

export function useDwell({
  dwell,
  running,
  onDone,
  resetKey,
  target,
  varName = "--p",
}: DwellOptions): void {
  const elapsed = useRef(0);
  const doneRef = useRef(onDone);

  useEffect(() => {
    doneRef.current = onDone;
  });

  const write = useCallback(
    (p: number) => target.current?.style.setProperty(varName, String(p)),
    [target, varName],
  );

  useEffect(() => {
    elapsed.current = 0;
    write(0);
  }, [resetKey, dwell, write]);

  useEffect(() => {
    if (!running) return;
    elapsed.current = Math.min(elapsed.current, Math.max(0, dwell - RESUME_GRACE_MS));
    let raf = 0;
    let last = performance.now();
    const tick = (now: number) => {
      elapsed.current += now - last;
      last = now;
      if (elapsed.current >= dwell) {
        elapsed.current = 0;
        write(0);
        doneRef.current();
      } else {
        write(elapsed.current / dwell);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running, dwell, write]);
}
