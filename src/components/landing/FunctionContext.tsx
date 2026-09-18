"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { FUNCTIONS, FUNCTION_STYLE, type FunctionData, type FunctionStyle } from "@/data/functions";
import { useDwell } from "@/hooks/useDwell";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export type FunctionMode = "run" | "hover" | "stop";

export interface FunctionState {
  index: number;
  fn: FunctionData;
  style: FunctionStyle;
  mode: FunctionMode;
  progress: number;
  select: (i: number) => void;
  hoverStart: () => void;
  hoverEnd: () => void;
}

const DWELL = 3400;

const Ctx = createContext<FunctionState | null>(null);

export function FunctionProvider({ children }: { children: ReactNode }) {
  const [index, setIndex] = useState(0);
  const [mode, setMode] = useState<FunctionMode>("run");
  const reduced = useReducedMotion();

  const advance = useCallback(() => setIndex((i) => (i + 1) % FUNCTIONS.length), []);
  const progress = useDwell({ dwell: DWELL, running: mode === "run" && !reduced, onDone: advance });

  // Any user choice ends the rotation for good.
  const select = useCallback((i: number) => {
    setIndex(i);
    setMode("stop");
  }, []);
  const hoverStart = useCallback(() => setMode((m) => (m === "run" ? "hover" : m)), []);
  const hoverEnd = useCallback(() => setMode((m) => (m === "hover" ? "run" : m)), []);

  const value = useMemo<FunctionState>(() => {
    const fn = FUNCTIONS[index];
    return { index, fn, style: FUNCTION_STYLE[fn.id], mode, progress, select, hoverStart, hoverEnd };
  }, [index, mode, progress, select, hoverStart, hoverEnd]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useFunctionState(): FunctionState {
  const state = useContext(Ctx);
  if (!state) throw new Error("useFunctionState must be used inside FunctionProvider");
  return state;
}
