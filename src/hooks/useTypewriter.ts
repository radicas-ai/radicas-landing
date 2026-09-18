"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export interface TypewriterOptions {
  speed: number;
  run: boolean;
}

export function useTypewriter(text: string, { speed, run }: TypewriterOptions): { shown: string; done: boolean } {
  const reduced = useReducedMotion();
  const [count, setCount] = useState(0);
  const full = reduced || !run;

  useEffect(() => {
    if (full) return;
    let n = 0;
    setCount(0);
    const id = setInterval(() => {
      n += 1;
      setCount(n);
      if (n >= text.length) clearInterval(id);
    }, speed);
    return () => clearInterval(id);
  }, [text, speed, full]);

  if (full) return { shown: text, done: true };
  return { shown: text.slice(0, count), done: count >= text.length };
}
