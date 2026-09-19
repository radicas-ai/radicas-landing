"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export interface TypewriterOptions {
  speed: number;
  run: boolean;
  paused?: boolean;
}

export function useTypewriter(
  text: string,
  { speed, run, paused = false }: TypewriterOptions,
): { shown: string; done: boolean } {
  const reduced = useReducedMotion();
  const [count, setCount] = useState(0);
  const full = reduced || !run;

  // Pausing must hold the line where it is, so the reset lives apart from the ticking.
  useEffect(() => {
    if (!full) setCount(0);
  }, [text, full]);

  useEffect(() => {
    if (full || paused) return;
    const id = setInterval(() => {
      setCount((n) => {
        if (n >= text.length) {
          clearInterval(id);
          return n;
        }
        return n + 1;
      });
    }, speed);
    return () => clearInterval(id);
  }, [text, speed, full, paused]);

  if (full) return { shown: text, done: true };
  return { shown: text.slice(0, count), done: count >= text.length };
}
