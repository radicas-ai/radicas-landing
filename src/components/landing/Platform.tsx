"use client";

import { useRef, useState } from "react";
import {
  PLATFORM_COPY,
  PLATFORM_ROWS,
  SUPPORT,
  SUPPORT_LABEL,
  type PlatformRow,
} from "@/data/platform";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/cn";
import { CHEVRON_DOWN, PLATFORM_ICONS, Icon } from "./icons";
import { PLATFORM_ARTS } from "./PlatformArts";
import { SectionHead } from "./SectionHead";
import styles from "./Platform.module.css";

/**
 * One row of the accordion. Opening is click- and keyboard-only: the height of the page is a
 * user's decision, never the pointer's, or a row slides out from under a stationary cursor and
 * the next open starts itself.
 */
function Row({
  row,
  open,
  seen,
  onOpen,
}: {
  row: PlatformRow;
  open: boolean;
  seen: boolean;
  onOpen: () => void;
}) {
  const Art = PLATFORM_ARTS[row.k];
  const panelId = `platform-${row.k}`;

  return (
    <div
      data-row={row.k}
      className={cn(
        styles.row,
        row.k === "gov" && styles.gov,
        open && styles.open,
        open && seen && styles.in,
      )}
    >
      <span className={styles.n}>{row.num}</span>
      <div className={styles.tx}>
        <h3>
          <button
            type="button"
            className={styles.trigger}
            aria-expanded={open}
            aria-controls={panelId}
            onClick={onOpen}
          >
            <i className={styles.badge}>
              <Icon paths={PLATFORM_ICONS[row.k]} />
            </i>
            {row.name}
            <span className={styles.chev}>
              <Icon paths={CHEVRON_DOWN} />
            </span>
          </button>
        </h3>
        <p>{row.desc}</p>
        {row.k === "gov" ? (
          <div className={styles.sup}>
            <div>
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
          </div>
        ) : null}
      </div>
      <div id={panelId} className={styles.art}>
        <Art />
      </div>
    </div>
  );
}

export function Platform() {
  const [open, setOpen] = useState(0);
  const rowsRef = useRef<HTMLDivElement>(null);
  // The open row's pieces stagger in once, when the stack arrives — not on every toggle.
  const seen = useInView(rowsRef, { threshold: 0.15, rootMargin: "0px 0px -10% 0px", once: true });

  return (
    <section className={styles.section} id="platform" aria-label="Radicas core">
      <div className="wrap">
        <SectionHead kicker={PLATFORM_COPY.kicker} lede={PLATFORM_COPY.lede} tight>
          {PLATFORM_COPY.headingLead} <em>{PLATFORM_COPY.headingEmphasis}</em>
        </SectionHead>

        <div ref={rowsRef} data-stage="platform">
          {PLATFORM_ROWS.map((row, i) => (
            <Row
              key={row.k}
              row={row}
              open={i === open}
              seen={seen}
              onOpen={() => setOpen(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
