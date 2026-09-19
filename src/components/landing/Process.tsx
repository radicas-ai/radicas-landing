"use client";

import { useEffect, useRef, useState } from "react";
import { PROCESS_COPY, PROCESS_GAINS, PROCESS_KPI, PROCESS_STEPS, KPI_GOOD_BELOW } from "@/data/process";
import { useDwell } from "@/hooks/useDwell";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useSwap } from "@/hooks/useSwap";
import { cn } from "@/lib/cn";
import { RadicasMark } from "./Brand";
import { CHECK, PROCESS_ICONS, Icon } from "./icons";
import { ProcessView } from "./ProcessViews";
import { SectionHead } from "./SectionHead";
import styles from "./Process.module.css";

const DWELL_MS = 9000;
const SWAP_MS = 420;
const TONES = [styles.s1, styles.s2, styles.s3, styles.s4];

/** Eases the frame figure from wherever it stood to the step's value. */
function useKpiTween(index: number, reduced: boolean): string {
  const state = PROCESS_KPI[index];
  const current = useRef(PROCESS_KPI[0].to);
  const [shown, setShown] = useState(() => PROCESS_KPI[0].to.toFixed(2));

  useEffect(() => {
    const from = state.from ?? current.current;
    const to = state.to;
    current.current = to;
    if (reduced) {
      setShown(to.toFixed(2));
      return;
    }
    const t0 = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const p = Math.min(1, (now - t0) / 1100);
      const e = 1 - Math.pow(1 - p, 3);
      setShown((from + (to - from) * e).toFixed(2));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [state, reduced]);

  return shown;
}

export function Process() {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [pinned, setPinned] = useState(false);
  const [hovering, setHovering] = useState(false);

  const running = !reduced && !pinned && !hovering;
  const progress = useDwell({
    dwell: DWELL_MS,
    running,
    onDone: () => setIndex((i) => (i + 1) % PROCESS_STEPS.length),
    resetKey: index,
  });

  const { shown, swapping } = useSwap(index, SWAP_MS);
  const step = PROCESS_STEPS[shown];
  const gain = PROCESS_GAINS[shown];
  const next = PROCESS_STEPS[(shown + 1) % PROCESS_STEPS.length];
  const kpi = PROCESS_KPI[index];
  const figure = useKpiTween(index, reduced);

  function pick(i: number) {
    setPinned(true);
    setIndex(i);
  }

  return (
    <section className={styles.section} id="process" aria-label="How it works">
      <div className="wrap">
        <SectionHead
          kicker={PROCESS_COPY.kicker}
          lede={PROCESS_COPY.lede}
        >
          {PROCESS_COPY.headingLead} <em>{PROCESS_COPY.headingEmphasis}</em>
        </SectionHead>

        <ol className={styles.steps} role="tablist" aria-label="Steps">
          {PROCESS_STEPS.map((s, i) => (
            <li key={s.k}>
              <button
                type="button"
                role="tab"
                aria-selected={i === index}
                className={cn(styles.st, TONES[i], i === index && styles.on)}
                onClick={() => pick(i)}
              >
                <span className={styles.ic}>
                  <Icon paths={PROCESS_ICONS[s.k]} />
                </span>
                <span>
                  <b>{s.name}</b>
                  <span className={styles.q}>{s.q}</span>
                </span>
                <span className={styles.pg}>
                  <i style={{ width: pinned || reduced ? "100%" : `${progress * 100}%` }} />
                </span>
              </button>
            </li>
          ))}
        </ol>

        <div
          className={styles.flow}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={() => setHovering(false)}
        >
          <div className={styles.frame}>
            <div className={styles.fh}>
              <span className={styles.av}>
                <RadicasMark />
              </span>
              <span className={styles.t}>{PROCESS_COPY.frameTitle}</span>
              <span className={styles.kpi}>
                <small>{kpi.label}</small>
                <b className={cn(kpi.to < KPI_GOOD_BELOW && styles.good)}>€{figure}</b>
              </span>
            </div>
            <div
              className={cn(styles.pane, TONES[shown], swapping && styles.out)}
              aria-live="polite"
            >
              <ProcessView key={step.k} step={step.k} onRule={() => pick(3)} />
            </div>
          </div>

          <aside className={cn(styles.get, TONES[shown], swapping && styles.out)} aria-live="polite">
            <div className={styles.getIn}>
              <span className="eyebrow">
                <i />
                Step {shown + 1} · you get
              </span>
              <h3>{gain.h}</h3>
              <ul>
                {gain.b.map((b) => (
                  <li key={b}>
                    <Icon paths={CHECK} />
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.nx}>
              {shown < PROCESS_STEPS.length - 1 ? (
                <>
                  Next: <b>{next.name}</b>
                </>
              ) : (
                <>
                  Then back to <b>{PROCESS_STEPS[0].name}</b>
                </>
              )}
              <span className={styles.dots}>
                {PROCESS_STEPS.map((s, j) => (
                  <i key={s.k} className={cn(j === shown && styles.on)} />
                ))}
              </span>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
