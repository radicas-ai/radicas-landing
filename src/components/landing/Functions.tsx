"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { FUNCTIONS, FUNCTIONS_COPY, INTEL_BLOCKS } from "@/data/functions";
import { useDwell } from "@/hooks/useDwell";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useSwap } from "@/hooks/useSwap";
import { cn } from "@/lib/cn";
import { FN_ICONS, Icon } from "./icons";
import { SectionHead } from "./SectionHead";
import styles from "./Functions.module.css";

const DWELL_MS = 6500;
const SWAP_MS = 1100;
const SWEEP_START = 150;
const SWEEP_STEP = 200;
const SWEEP_HOLD = 500;

/** Lights the shared layers one by one on every switch — the "same engine" beat. */
function useSweep(key: number, reduced: boolean): number {
  const [lit, setLit] = useState(-1);

  useEffect(() => {
    if (reduced) return;
    const timers: number[] = [];
    INTEL_BLOCKS.forEach((_, k) => {
      timers.push(window.setTimeout(() => setLit(k), SWEEP_START + k * SWEEP_STEP));
      timers.push(
        window.setTimeout(() => setLit((c) => (c === k ? -1 : c)), SWEEP_START + k * SWEEP_STEP + SWEEP_HOLD),
      );
    });
    return () => timers.forEach(clearTimeout);
  }, [key, reduced]);

  return lit;
}

export function Functions() {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [pinned, setPinned] = useState(false);
  const [hovering, setHovering] = useState(false);

  const running = !reduced && !pinned && !hovering;
  const progress = useDwell({
    dwell: DWELL_MS,
    running,
    onDone: () => setIndex((i) => (i + 1) % FUNCTIONS.length),
    resetKey: index,
  });

  const { shown, swapping } = useSwap(index, SWAP_MS);
  const fn = FUNCTIONS[shown];
  const lit = useSweep(index, reduced);

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
      style={{ "--fc": FUNCTIONS[index].colour } as CSSProperties}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div className="wrap">
        <SectionHead kicker={FUNCTIONS_COPY.kicker} lede={FUNCTIONS_COPY.lede}>
          {FUNCTIONS_COPY.headingLead} <em>{FUNCTIONS_COPY.headingEmphasis}</em>
        </SectionHead>

        <ol className={styles.fns} role="tablist" aria-label="Business function">
          {FUNCTIONS.map((f, i) => (
            <li key={f.id}>
              <button
                type="button"
                role="tab"
                aria-selected={i === index}
                className={cn(styles.fn, i === index && styles.on)}
                style={{ "--fc": f.colour } as CSSProperties}
                onClick={() => {
                  setPinned(true);
                  setIndex(i);
                }}
              >
                <span className={styles.fi}>
                  <Icon paths={FN_ICONS[f.id]} />
                </span>
                <span>{f.name}</span>
                <span className={styles.pg}>
                  <i style={{ width: pinned || reduced ? "100%" : `${progress * 100}%` }} />
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

        <div className={cn(styles.card, swapping && styles.out)} aria-live="polite">
          <div className={styles.who}>
            <span className={styles.bx}>
              <Icon paths={FN_ICONS[fn.id]} />
            </span>
            <span>
              <b>{fn.name}</b>
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
    </section>
  );
}
