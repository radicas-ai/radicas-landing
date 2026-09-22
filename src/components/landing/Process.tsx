"use client";

import { useEffect, useRef, useState } from "react";
import { PROCESS_COPY, PROCESS_GAINS, PROCESS_KPI, PROCESS_STEPS, KPI_GOOD_BELOW } from "@/data/process";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useRotator } from "@/hooks/useRotator";
import { cn } from "@/lib/cn";
import { DWELL, SWAP_MS } from "@/lib/motion";
import { RadicasMark } from "./Brand";
import { CHECK, PROCESS_ICONS, Icon } from "./icons";
import { ProcessView } from "./ProcessViews";
import { SectionHead } from "./SectionHead";
import styles from "./Process.module.css";

const TONES = [styles.s1, styles.s2, styles.s3, styles.s4];

/** Its own component so the 60fps tween re-renders a text node, not the section. */
function KpiFigure({ index }: { index: number }) {
  const reduced = useReducedMotion();
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

  return <>€{shown}</>;
}

export function Process() {
  const { railRef, hold, index, shown, swapping, paused, select, vars } = useRotator({
    count: PROCESS_STEPS.length,
    dwell: DWELL.process,
    swap: SWAP_MS,
  });

  const step = PROCESS_STEPS[shown];
  const gain = PROCESS_GAINS[shown];
  const next = PROCESS_STEPS[(shown + 1) % PROCESS_STEPS.length];
  const kpi = PROCESS_KPI[shown];

  return (
    <section className={styles.section} id="process" aria-label="How it works" style={vars}>
      <div className="wrap">
        <SectionHead kicker={PROCESS_COPY.kicker} lede={PROCESS_COPY.lede}>
          {PROCESS_COPY.headingLead} <em>{PROCESS_COPY.headingEmphasis}</em>
        </SectionHead>

        <div
          ref={railRef}
          data-rail="process"
          className={cn(styles.rail, paused && styles.paused)}
          {...hold}
        >
          <p className="sr">
            This rail advances on its own. Choose a step to pause it, and the same step again to
            resume.
          </p>

          <ol className={styles.steps} role="tablist" aria-label="Steps">
            {PROCESS_STEPS.map((s, i) => (
              <li key={s.k}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  className={cn(styles.st, TONES[i], i === index && styles.on)}
                  onClick={() => select(i)}
                >
                  <span className={styles.ic}>
                    <Icon paths={PROCESS_ICONS[s.k]} />
                  </span>
                  <span>
                    <b>{s.name}</b>
                    <span className={styles.q}>{s.q}</span>
                  </span>
                  <span className={styles.pg} data-bar>
                    <i />
                  </span>
                </button>
              </li>
            ))}
          </ol>

          <div className={styles.flow}>
            <div className={styles.frame}>
              <div className={styles.fh}>
                <span className={styles.av}>
                  <RadicasMark />
                </span>
                <span className={styles.t}>{PROCESS_COPY.frameTitle}</span>
                <span className={styles.kpi}>
                  <small>{kpi.label}</small>
                  <b className={cn(kpi.to < KPI_GOOD_BELOW && styles.good)}>
                    <KpiFigure index={shown} />
                  </b>
                </span>
              </div>
              <div
                className={cn(styles.pane, TONES[shown], swapping && styles.out)}
                aria-live={paused ? "polite" : "off"}
              >
                <ProcessView key={step.k} step={step.k} onRule={() => select(3)} />
              </div>
            </div>

            <aside className={cn(styles.get, TONES[shown], swapping && styles.out)}>
              <div className={styles.getIn}>
                <span className="eyebrow">
                  <i />
                  Step {shown + 1} · you get
                </span>
                <h3 data-pane="process">{gain.h}</h3>
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
      </div>
    </section>
  );
}
