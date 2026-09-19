"use client";

import { useState, type CSSProperties } from "react";
import { FRAMEWORK_COPY, PILLARS } from "@/data/framework";
import { useDwell } from "@/hooks/useDwell";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useSwap } from "@/hooks/useSwap";
import { cn } from "@/lib/cn";
import { CHECK, PILLAR_ICONS, Icon } from "./icons";
import { SectionHead } from "./SectionHead";
import styles from "./Framework.module.css";

const DWELL_MS = 7000;
const SWAP_MS = 420;

export function Framework() {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [pinned, setPinned] = useState(false);
  const [hovering, setHovering] = useState(false);

  const running = !reduced && !pinned && !hovering;
  const progress = useDwell({
    dwell: DWELL_MS,
    running,
    onDone: () => setIndex((i) => (i + 1) % PILLARS.length),
    resetKey: index,
  });

  const { shown, swapping } = useSwap(index, SWAP_MS);
  const pillar = PILLARS[shown];

  return (
    <section
      className={styles.section}
      id="framework"
      aria-label="The Radicas Framework"
      style={{ "--pc": PILLARS[index].colour } as CSSProperties}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      <div className="wrap">
        <SectionHead kicker={FRAMEWORK_COPY.kicker} lede={FRAMEWORK_COPY.lede}>
          {FRAMEWORK_COPY.headingLead} <em>{FRAMEWORK_COPY.headingEmphasis}</em>
        </SectionHead>

        <div className={styles.word} role="tablist" aria-label="Framework pillars">
          {PILLARS.map((p, i) => (
            <button
              key={p.name}
              type="button"
              role="tab"
              aria-selected={i === index}
              className={cn(styles.lt, i === index && styles.on)}
              style={{ "--pc": p.colour } as CSSProperties}
              onClick={() => {
                setPinned(true);
                setIndex(i);
              }}
            >
              <span className={styles.pi}>
                <Icon paths={PILLAR_ICONS[i]} />
              </span>
              <span className={styles.nm}>{p.name}</span>
              <span className={styles.qq}>{p.q}</span>
              <span className={styles.pg}>
                <i style={{ width: pinned || reduced ? "100%" : `${progress * 100}%` }} />
              </span>
            </button>
          ))}
        </div>

        <div className={cn(styles.pane, swapping && styles.swapping)} aria-live="polite">
          <div className={styles.lft}>
            <span className={cn(styles.badge, styles.fade)}>
              <Icon paths={PILLAR_ICONS[shown]} />
            </span>
            <span className={cn("eyebrow", styles.tint, styles.fade)}>
              {String(shown + 1).padStart(2, "0")} · {pillar.name}
            </span>
            <p className={cn(styles.q, styles.fade)}>{pillar.q}</p>
            <p className={cn(styles.why, styles.fade)}>{pillar.why}</p>
          </div>
          <div>
            <span className="eyebrow">{FRAMEWORK_COPY.metricsLabel}</span>
            <ul className={cn(styles.mets, styles.fade)}>
              {pillar.metrics.map((m) => (
                <li key={m}>
                  <i>
                    <Icon paths={CHECK} />
                  </i>
                  <span>{m}</span>
                </li>
              ))}
            </ul>
            <a className={styles.ask} href="#contact">
              {FRAMEWORK_COPY.ask}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
