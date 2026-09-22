"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent,
} from "react";
import { useDwell } from "@/hooks/useDwell";
import { useInView } from "@/hooks/useInView";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useSwap } from "@/hooks/useSwap";

export interface RotatorOptions {
  count: number;
  dwell: number;
  swap: number;
}

/**
 * The state the three rails share. `railRef` is both the hover/focus region and the
 * in-view gate, so a rail only ever runs while it is on screen and unattended.
 */
export function useRotator({ count, dwell, swap }: RotatorOptions) {
  const reduced = useReducedMotion();
  const railRef = useRef<HTMLDivElement>(null);
  const inView = useInView(railRef, { threshold: 0.2 });
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [held, setHeld] = useState(false);

  const running = !reduced && inView && !paused && !held;

  useDwell({
    dwell,
    running,
    resetKey: index,
    target: railRef,
    onDone: () => setIndex((i) => (i + 1) % count),
  });

  // Nothing is counting down, so the active bar is a selection underline.
  useEffect(() => {
    if (reduced) railRef.current?.style.setProperty("--p", "1");
  }, [reduced, index]);

  const { shown, swapping } = useSwap(index, swap);

  /** A different tab takes the rail over; the same tab again hands it back. */
  const select = useCallback(
    (i: number) => {
      setPaused((p) => (i === index ? !p : true));
      setIndex(i);
    },
    [index],
  );

  const hold = {
    onMouseEnter: () => setHeld(true),
    onMouseLeave: () => setHeld(false),
    onFocusCapture: () => setHeld(true),
    onBlurCapture: (e: FocusEvent<HTMLElement>) => {
      if (!railRef.current?.contains(e.relatedTarget)) setHeld(false);
    },
  };

  return {
    railRef,
    hold,
    index,
    shown,
    swapping,
    paused,
    select,
    vars: { "--swap": `${swap}ms` } as CSSProperties,
  };
}
