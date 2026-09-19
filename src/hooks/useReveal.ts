"use client";

import { useRef, type CSSProperties, type RefObject } from "react";
import { useInView } from "@/hooks/useInView";

/**
 * The page's one entrance: an element lifts into place the first time it arrives.
 * `i` staggers siblings. Pair with the shared `reveal.module.css` classes.
 */
export function useReveal<T extends HTMLElement>(
  i = 0,
): { ref: RefObject<T | null>; seen: boolean; style: CSSProperties } {
  const ref = useRef<T>(null);
  const seen = useInView(ref, { threshold: 0.15, rootMargin: "0px 0px -10% 0px", once: true });
  return { ref, seen, style: { "--i": i } as CSSProperties };
}
