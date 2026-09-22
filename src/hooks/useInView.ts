"use client";

import { useEffect, useState, type RefObject } from "react";

export interface InViewOptions {
  threshold?: number | number[];
  rootMargin?: string;
  once?: boolean;
}

export function useInView(ref: RefObject<Element | null>, opts: InViewOptions = {}): boolean {
  const { threshold = 0, rootMargin = "0px", once = false } = opts;
  const [inView, setInView] = useState(false);
  // Serialised so an inline array literal does not rebuild the observer every render.
  const thresholdKey = Array.isArray(threshold) ? threshold.join(",") : String(threshold);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          setInView(entry.isIntersecting);
          if (entry.isIntersecting && once) io.disconnect();
        }
      },
      { threshold: thresholdKey.split(",").map(Number), rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, thresholdKey, rootMargin, once]);

  return inView;
}
