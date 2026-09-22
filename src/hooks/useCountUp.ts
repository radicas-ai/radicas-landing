"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export interface CountUpOptions {
  run: boolean;
  duration?: number;
}

/** Counts up to the number inside `target`, keeping its prefix, suffix and decimals. */
export function useCountUp(target: string, { run, duration = 700 }: CountUpOptions): string {
  const reduced = useReducedMotion();
  const [shown, setShown] = useState(target);

  useEffect(() => {
    const m = String(target).match(/^([^\d]*)([\d,.]+)(.*)$/);
    if (!m || !run || reduced) {
      setShown(target);
      return;
    }
    const [, pre, num, post] = m;
    const dec = (num.split(".")[1] || "").length;
    const end = parseFloat(num.replace(/,/g, ""));
    const t0 = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const v = end * (1 - Math.pow(1 - p, 3));
      setShown(pre + v.toLocaleString("en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec }) + post);
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, run, reduced, duration]);

  return shown;
}
