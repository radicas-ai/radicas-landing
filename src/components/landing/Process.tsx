"use client";

import { useCallback, useState, type KeyboardEvent } from "react";
import { FUNCTIONS } from "@/data/functions";
import { PROCESS_CONTENT, PROCESS_STEPS } from "@/data/process";
import { useDwell } from "@/hooks/useDwell";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useSwap } from "@/hooks/useSwap";
import { cn } from "@/lib/cn";
import { RadicasMark } from "./Brand";
import { useFunctionState } from "./FunctionContext";
import { ProcessView } from "./ProcessViews";
import { SectionHead } from "./SectionHead";
import styles from "./Process.module.css";

const DWELL = 6500;

export function Process() {
  const { index: fnIndex, fn, select } = useFunctionState();
  const reduced = useReducedMotion();
  const [step, setStep] = useState(0);
  const [stopped, setStopped] = useState(false);
  const [hovering, setHovering] = useState(false);

  const advance = useCallback(() => setStep((s) => (s + 1) % PROCESS_STEPS.length), []);
  const progress = useDwell({
    dwell: DWELL,
    running: !stopped && !hovering && !reduced,
    onDone: advance,
    resetKey: step,
  });

  // The step dwell is keyed on the step alone, so switching function replays the step without restarting it.
  const { shown, swapping } = useSwap(`${step}-${fnIndex}`, 160);
  const [shownStep, shownFn] = shown.split("-").map(Number);

  const pick = (i: number) => {
    setStopped(true);
    setStep(i);
  };
  const onStepKey = (event: KeyboardEvent<HTMLLIElement>, i: number) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    pick(i);
  };

  const current = PROCESS_STEPS[step];
  const content = PROCESS_CONTENT[fn.id];
  const title =
    current.title ??
    (current.k === "see"
      ? `Your view · ${fn.name}`
      : `Governance rule · ${content.rid.split(" ")[0]}`);

  return (
    <section
      className={styles.section}
      id="process"
      aria-label="From a question to a decision the organisation keeps"
    >
      <div className="wrap">
        <SectionHead
          kicker="The same process, in every function"
          lede="Ask. See the numbers. Understand why. Set a rule. Learn from what happened. Five steps, the same in every function."
        >
          From a question to a decision <em>the organisation keeps.</em>
        </SectionHead>

        <div className={cn("tabs", styles.tabs)} role="tablist" aria-label="Business function">
          {FUNCTIONS.map((f, i) => (
            <button
              key={f.id}
              type="button"
              className="tab"
              role="tab"
              aria-selected={i === fnIndex}
              onClick={() => select(i)}
            >
              <span>{f.name}</span>
              <span className="bar">
                <i style={{ width: i === fnIndex ? "100%" : "0%" }} />
              </span>
            </button>
          ))}
        </div>

        <div className={styles.flow}>
          <ol className={styles.pst}>
            {PROCESS_STEPS.map((s, i) => (
              <li
                key={s.k}
                className={cn(
                  styles.pstep,
                  s.k === "loop" && styles.loop,
                  i === step && styles.on,
                  i < step && styles.done,
                )}
                role="button"
                tabIndex={0}
                aria-current={i === step ? "step" : undefined}
                onClick={() => pick(i)}
                onKeyDown={(event) => onStepKey(event, i)}
              >
                <span className={styles.n}>{s.k === "loop" ? "↻" : i + 1}</span>
                <span>
                  <b>
                    {s.name}
                    {s.small ? <small>{s.small}</small> : null}
                  </b>
                  <span className={styles.comp}>{s.comp}</span>
                  <p>{s.desc}</p>
                </span>
                <span className={styles.pg}>
                  <i
                    style={{
                      width: i === step ? (stopped ? "100%" : `${progress * 100}%`) : "0%",
                    }}
                  />
                </span>
              </li>
            ))}
          </ol>
          <div>
            <div
              className={cn(styles.frame, swapping && "swapping")}
              aria-live="polite"
              onMouseEnter={() => setHovering(true)}
              onMouseLeave={() => setHovering(false)}
            >
              <div className={styles.fh}>
                <span className={styles.av}>
                  <RadicasMark />
                </span>
                <span className={styles.t}>{title}</span>
                <span className={styles.r}>
                  {current.chips.map((c) => (
                    <span key={c} className="chip mono">
                      {c}
                    </span>
                  ))}
                </span>
              </div>
              <div className={cn(styles.fb, "swap")}>
                <ProcessView
                  key={shown}
                  step={PROCESS_STEPS[shownStep].k}
                  p={PROCESS_CONTENT[FUNCTIONS[shownFn].id]}
                />
              </div>
              <div className={styles.ff}>
                <span className="eyebrow">{current.foot}</span>
                <span className="eyebrow">Basis · coverage · assumptions on every figure</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
