"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { BASIS_LABEL, EXAMPLE, FUNCTION_SHORT, PILLARS } from "@/data/framework";
import { FUNCTIONS } from "@/data/functions";
import { useDwell } from "@/hooks/useDwell";
import { useInView } from "@/hooks/useInView";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useSwap } from "@/hooks/useSwap";
import { cn } from "@/lib/cn";
import { useFunctionState } from "./FunctionContext";
import { SectionHead } from "./SectionHead";
import styles from "./Framework.module.css";

const DWELL = 7000;
const HOVER_DELAY = 260;

const BASIS_ORDER = ["billed", "rebuilt", "modelled", "count"] as const;

export function Framework() {
  const { index: fnIndex, select } = useFunctionState();
  const reduced = useReducedMotion();
  const paneRef = useRef<HTMLDivElement>(null);
  const inView = useInView(paneRef, { threshold: 0.35 });
  const [pillarIndex, setPillarIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const advance = useCallback(() => setPillarIndex((i) => (i + 1) % PILLARS.length), []);
  const progress = useDwell({
    dwell: DWELL,
    running: inView && !paused && !reduced,
    onDone: advance,
    resetKey: pillarIndex,
  });

  const { shown, swapping } = useSwap(`${pillarIndex}-${fnIndex}`, 420);
  const [shownPillar, shownFn] = shown.split("-").map(Number);
  const pillar = PILLARS[shownPillar];
  const fn = FUNCTIONS[shownFn];
  const [big, label, sub] = EXAMPLE[pillar.ex](fn);

  const pillarRef = useRef(pillarIndex);
  pillarRef.current = pillarIndex;
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const clearHover = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    hoverTimer.current = null;
  };
  useEffect(() => clearHover, []);

  const pick = (i: number) => {
    setPillarIndex(i);
    setPaused(true);
  };
  const onLetterEnter = (i: number) => {
    clearHover();
    hoverTimer.current = setTimeout(() => {
      if (pillarRef.current !== i) pick(i);
      else setPaused(true);
    }, HOVER_DELAY);
  };
  const onWordLeave = () => {
    clearHover();
    setPaused(false);
  };

  const barWidth = (i: number) => {
    if (i !== pillarIndex) return "0%";
    return reduced ? "100%" : `${progress * 100}%`;
  };

  return (
    <section
      className={styles.section}
      id="framework"
      aria-label="Six questions that put AI spend on the ledger"
    >
      <div className="wrap">
        <SectionHead
          kicker="The Radicas Framework · LEDGER"
          lede="LEDGER is how Radicas measures AI: what it cost, what it returned, and who owns it. The same six questions in every function."
        >
          Six questions that put AI spend <em>on the ledger.</em>
        </SectionHead>

        <div
          className={styles.word}
          role="tablist"
          aria-label="Framework pillars"
          style={{ "--n": PILLARS.length } as CSSProperties}
          onMouseLeave={onWordLeave}
        >
          {PILLARS.map((p, i) => (
            <button
              key={p.name}
              type="button"
              className={cn(styles.lt, i === pillarIndex && styles.on)}
              role="tab"
              aria-selected={i === pillarIndex}
              onClick={() => pick(i)}
              onMouseEnter={() => onLetterEnter(i)}
              onMouseLeave={clearHover}
            >
              <span className={styles.L} aria-hidden>
                {p.L}
              </span>
              <span className={styles.nm}>{p.name}</span>
              <span className={styles.pg}>
                <i style={{ width: barWidth(i) }} />
              </span>
            </button>
          ))}
        </div>

        <div
          ref={paneRef}
          className={cn(styles.pane, swapping && styles.swapping)}
          aria-live="polite"
        >
          <div>
            <span className={cn("eyebrow", styles.b, styles.fade)}>
              {pillar.L} · {pillar.name}
            </span>
            <p className={cn(styles.q, styles.fade)}>{pillar.q}</p>
            <p className={cn(styles.why, styles.fade)}>{pillar.why}</p>
          </div>
          <div>
            <span className="eyebrow">Critical metrics</span>
            <ul className={cn(styles.mets, styles.fade)}>
              {pillar.m.map(([name, basis]) => (
                <li key={name}>
                  <span>{name}</span>
                  <span className={cn(styles.bs, styles[basis])}>
                    <i />
                    {BASIS_LABEL[basis]}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div className={styles.ex}>
            <span className="eyebrow">In {fn.name}</span>
            <div className={styles.fsw}>
              {FUNCTION_SHORT.map((name, i) => (
                <button
                  key={name}
                  type="button"
                  aria-pressed={i === fnIndex}
                  onClick={() => select(i)}
                >
                  {name}
                </button>
              ))}
            </div>
            <div className={styles.fade}>
              <div className={styles.big}>{big}</div>
              <div className={styles.lab}>{label}</div>
              <div className={styles.sub}>{sub}</div>
            </div>
          </div>
        </div>

        <div className={styles.foot8}>
          <div className={styles.legend}>
            <span>Every figure says what it rests on:</span>
            {BASIS_ORDER.map((basis) => (
              <span key={basis} className={cn(styles.bs, styles[basis])}>
                <i />
                {BASIS_LABEL[basis]}
              </span>
            ))}
          </div>
          <a className="btn btn-secondary" href="#contact">
            Explore the framework
          </a>
        </div>
      </div>
    </section>
  );
}
