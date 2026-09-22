"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

/** Holds the old value for `ms` while `swapping` is true, then adopts the new one. */
export function useSwap<T>(value: T, ms: number): { shown: T; swapping: boolean } {
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(value);
  const [swapping, setSwapping] = useState(false);

  useEffect(() => {
    if (Object.is(shown, value)) return;
    if (reduced) {
      setShown(value);
      setSwapping(false);
      return;
    }
    setSwapping(true);
    const id = setTimeout(() => {
      setShown(value);
      setSwapping(false);
    }, ms);
    return () => clearTimeout(id);
  }, [value, shown, ms, reduced]);

  return { shown, swapping };
}
