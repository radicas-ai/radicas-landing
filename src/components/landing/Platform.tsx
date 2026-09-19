"use client";

import { useRef } from "react";
import {
  PLATFORM_COPY,
  PLATFORM_ROWS,
  SUPPORT,
  SUPPORT_LABEL,
  type PlatformRow,
} from "@/data/platform";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/cn";
import { PLATFORM_ICONS, Icon } from "./icons";
import { PLATFORM_ARTS } from "./PlatformArts";
import { SectionHead } from "./SectionHead";
import styles from "./Platform.module.css";

/** Every row stays open. Each one reveals its own art the first time that art reaches the viewport. */
function Row({ row }: { row: PlatformRow }) {
  const artRef = useRef<HTMLDivElement>(null);
  const seen = useInView(artRef, { threshold: 0.15, rootMargin: "0px 0px -12% 0px", once: true });
  const Art = PLATFORM_ARTS[row.k];

  return (
    <div
      data-row={row.k}
      className={cn(styles.row, row.k === "gov" && styles.gov, seen && styles.in)}
    >
      <span className={styles.n}>{row.num}</span>
      <div className={styles.tx}>
        <h3>
          <i className={styles.badge}>
            <Icon paths={PLATFORM_ICONS[row.k]} />
          </i>
          {row.name}
        </h3>
        <p>{row.desc}</p>
        {row.k === "gov" ? (
          <div className={styles.sup}>
            <span className="eyebrow">{SUPPORT_LABEL}</span>
            <ul>
              {SUPPORT.map((s) => (
                <li key={s.text} className={cn(s.advanced && styles.advanced)}>
                  <Icon paths={PLATFORM_ICONS[s.icon]} />
                  {s.text}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
      <div ref={artRef} className={styles.art}>
        <Art />
      </div>
    </div>
  );
}

export function Platform() {
  return (
    <section className={styles.section} id="platform" aria-label="Radicas core">
      <div className="wrap">
        <SectionHead kicker={PLATFORM_COPY.kicker} lede={PLATFORM_COPY.lede}>
          {PLATFORM_COPY.headingLead} <em>{PLATFORM_COPY.headingEmphasis}</em>
        </SectionHead>

        {PLATFORM_ROWS.map((row) => (
          <Row key={row.k} row={row} />
        ))}
      </div>
    </section>
  );
}
