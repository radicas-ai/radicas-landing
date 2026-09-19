"use client";

import type { CSSProperties } from "react";
import { FRAMEWORK_COPY, PILLARS } from "@/data/framework";
import { useRotator } from "@/hooks/useRotator";
import { cn } from "@/lib/cn";
import { DWELL, SWAP_MS } from "@/lib/motion";
import { CHECK, PILLAR_ICONS, Icon } from "./icons";
import { SectionHead } from "./SectionHead";
import styles from "./Framework.module.css";

export function Framework() {
  const { railRef, hold, index, shown, swapping, paused, select, vars } = useRotator({
    count: PILLARS.length,
    dwell: DWELL.framework,
    swap: SWAP_MS,
  });
  const pillar = PILLARS[shown];

  return (
    <section
      className={styles.section}
      id="framework"
      aria-label="The Radicas Framework"
      style={{ ...vars, "--pc": PILLARS[shown].colour } as CSSProperties}
    >
      <div className="wrap">
        <SectionHead kicker={FRAMEWORK_COPY.kicker} lede={FRAMEWORK_COPY.lede}>
          {FRAMEWORK_COPY.headingLead} <em>{FRAMEWORK_COPY.headingEmphasis}</em>
        </SectionHead>

        <div
          ref={railRef}
          data-rail="framework"
          className={cn(styles.rail, paused && styles.paused)}
          {...hold}
        >
          <p className="sr">
            This rail advances on its own. Choose a pillar to pause it, and the same pillar
            again to resume.
          </p>

          <div className={styles.word} role="tablist" aria-label="Framework pillars">
            {PILLARS.map((p, i) => (
              <button
                key={p.name}
                type="button"
                role="tab"
                aria-selected={i === index}
                className={cn(styles.lt, i === index && styles.on)}
                style={{ "--pc": p.colour } as CSSProperties}
                onClick={() => select(i)}
              >
                <span className={styles.pi}>
                  <Icon paths={PILLAR_ICONS[i]} />
                </span>
                <span className={styles.nm}>{p.name}</span>
                <span className={styles.qq}>{p.q}</span>
                <span className={styles.pg} data-bar>
                  <i />
                </span>
              </button>
            ))}
          </div>

          <div
            className={cn(styles.pane, swapping && styles.swapping)}
            aria-live={paused ? "polite" : "off"}
          >
            <div className={styles.lft}>
              <span className={cn(styles.badge, styles.fade)}>
                <Icon paths={PILLAR_ICONS[shown]} />
              </span>
              <span className={cn("eyebrow", styles.tint, styles.fade)}>
                {String(shown + 1).padStart(2, "0")} · {pillar.name}
              </span>
              <p className={cn(styles.q, styles.fade)} data-pane="framework">
                {pillar.q}
              </p>
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
      </div>
    </section>
  );
}
