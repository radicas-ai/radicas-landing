"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { FUNCTIONS, FUNCTIONS_COPY, INTEL_BLOCKS } from "@/data/functions";
import { useRotator } from "@/hooks/useRotator";
import { cn } from "@/lib/cn";
import { DWELL, SWAP_MS } from "@/lib/motion";
import { FN_ICONS, Icon } from "./icons";
import { SectionHead } from "./SectionHead";
import styles from "./Functions.module.css";

const SWEEP_START = 150;
const SWEEP_STEP = 200;
const SWEEP_HOLD = 500;

/** Lights the shared layers one by one on every switch — the "same engine" beat. */
function useSweep(key: number, run: boolean): number {
  const [lit, setLit] = useState(-1);

  useEffect(() => {
    if (!run) return;
    const timers: number[] = [];
    INTEL_BLOCKS.forEach((_, k) => {
      timers.push(window.setTimeout(() => setLit(k), SWEEP_START + k * SWEEP_STEP));
      timers.push(
        window.setTimeout(
          () => setLit((c) => (c === k ? -1 : c)),
          SWEEP_START + k * SWEEP_STEP + SWEEP_HOLD,
        ),
      );
    });
    return () => {
      timers.forEach(clearTimeout);
      setLit(-1);
    };
  }, [key, run]);

  return lit;
}

export function Functions() {
  const { railRef, hold, index, shown, swapping, paused, select, vars } = useRotator({
    count: FUNCTIONS.length,
    dwell: DWELL.functions,
    swap: SWAP_MS,
  });
  const fn = FUNCTIONS[shown];
  // Keyed on `shown`, so the sweep runs with the card it belongs to, never over the fade.
  const lit = useSweep(shown, !swapping);

  const attrs = [
    { icon: "unit", label: FUNCTIONS_COPY.attrUnit, value: fn.unit },
    { icon: "ok", label: FUNCTIONS_COPY.attrOutcome, value: fn.outcome },
    { icon: "db", label: FUNCTIONS_COPY.attrSystems, value: fn.systems },
  ];

  return (
    <section
      className={styles.section}
      id="functions"
      aria-label="One engine, every function"
      style={{ ...vars, "--fc": FUNCTIONS[shown].colour } as CSSProperties}
    >
      <div className="wrap">
        <SectionHead kicker={FUNCTIONS_COPY.kicker} lede={FUNCTIONS_COPY.lede}>
          {FUNCTIONS_COPY.headingLead} <em>{FUNCTIONS_COPY.headingEmphasis}</em>
        </SectionHead>

        <div
          ref={railRef}
          data-rail="functions"
          className={cn(styles.rail, paused && styles.paused)}
          {...hold}
        >
          <p className="sr">
            This rail advances on its own. Choose a function to pause it, and the same function
            again to resume.
          </p>

          <ol className={styles.fns} role="tablist" aria-label="Business function">
            {FUNCTIONS.map((f, i) => (
              <li key={f.id}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  className={cn(styles.fn, i === index && styles.on)}
                  style={{ "--fc": f.colour } as CSSProperties}
                  onClick={() => select(i)}
                >
                  <span className={styles.fi}>
                    <Icon paths={FN_ICONS[f.id]} />
                  </span>
                  <span>{f.name}</span>
                  <span className={styles.pg} data-bar>
                    <i />
                  </span>
                </button>
              </li>
            ))}
          </ol>

          <div className={styles.link} aria-hidden />

          <div className={styles.intel}>
            <div className={styles.ttl}>
              <span className="eyebrow">{FUNCTIONS_COPY.intelKicker}</span>
              <b>{FUNCTIONS_COPY.intelTitle}</b>
            </div>
            <div className={styles.blocks}>
              {INTEL_BLOCKS.map((b, k) => (
                <div key={b} className={cn(styles.blk, lit === k && styles.hi)}>
                  <b>{b}</b>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.link} aria-hidden />

          <div
            className={cn(styles.card, swapping && styles.out)}
            aria-live={paused ? "polite" : "off"}
          >
            <div className={styles.who}>
              <span className={styles.bx}>
                <Icon paths={FN_ICONS[fn.id]} />
              </span>
              <span>
                <b data-pane="functions">{fn.name}</b>
                <span>{fn.tag}</span>
              </span>
            </div>
            <div className={styles.qt}>
              <span className={styles.qm}>&ldquo;</span>
              <span>
                <small>{FUNCTIONS_COPY.quoteLabel}</small>
                <p>{fn.q}</p>
              </span>
            </div>
            {attrs.map((a, k) => (
              <div key={a.label} className={cn(styles.at, [styles.at1, styles.at2, styles.at3][k])}>
                <Icon paths={FN_ICONS[a.icon]} />
                <span>
                  <b>{a.label}</b>
                  <span>{a.value}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
