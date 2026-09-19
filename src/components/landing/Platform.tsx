"use client";

import { useEffect, useRef, useState, type CSSProperties, type RefObject } from "react";
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

/**
 * Slot fraction a row holds at full strength, and the fraction it fades over. They must NOT
 * overlap: two rows at 20% are both still legible, and superimposed text reads as a fault, not
 * as a dissolve. One leaves — upward, and completely — before the next arrives from below.
 */
const HOLD = 0.34;
const RAMP = 0.14;
const SHIFT_PX = 90;

/**
 * Turns the tall track into a 0..1 progress while its sticky stage is pinned, and writes each
 * row's opacity and offset straight onto the node — a scroll handler must never re-render React.
 * CSS owns the breakpoint; this asks it for `--pinned` rather than repeating the query.
 */
function useScrub(steps: number) {
  const trackRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const rowsRef = useRef<(HTMLDivElement | null)[]>([]);
  const [index, setIndex] = useState(0);
  const [pinned, setPinned] = useState(false);

  useEffect(() => {
    const read = () => {
      const track = trackRef.current;
      setPinned(!!track && getComputedStyle(track).getPropertyValue("--pinned").trim() === "1");
    };
    read();
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    window.addEventListener("resize", read);
    mq.addEventListener("change", read);
    return () => {
      window.removeEventListener("resize", read);
      mq.removeEventListener("change", read);
    };
  }, []);

  useEffect(() => {
    if (!pinned) {
      for (const row of rowsRef.current) {
        row?.style.removeProperty("--o");
        row?.style.removeProperty("--y");
      }
      setIndex(0);
      return;
    }

    let raf = 0;
    let last = -1;
    const paint = () => {
      raf = 0;
      const track = trackRef.current;
      const stage = stageRef.current;
      if (!track || !stage) return;
      const rect = track.getBoundingClientRect();
      const travel = rect.height - stage.offsetHeight;
      const p = travel <= 0 ? 0 : Math.min(1, Math.max(0, -rect.top / travel));
      // Half a slot of lead-in and lead-out, clamped so the first and last rows hold the ends.
      const at = Math.min(steps - 1, Math.max(0, p * steps - 0.5));

      rowsRef.current.forEach((row, i) => {
        if (!row) return;
        const s = at - i;
        const fade = Math.min(1, Math.max(0, (Math.abs(s) - HOLD) / RAMP));
        row.style.setProperty("--o", String(1 - fade));
        row.style.setProperty("--y", `${(fade * SHIFT_PX * (s < 0 ? 1 : -1)).toFixed(1)}px`);
      });

      const nearest = Math.round(at);
      if (nearest !== last) {
        last = nearest;
        setIndex(nearest);
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(paint);
    };
    paint();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [pinned, steps]);

  return { trackRef, stageRef, rowsRef, index, pinned };
}

/**
 * Pinned, the scrub says when a row is on. Unpinned, the row reveals itself when its art
 * arrives. Either way the pieces stagger in behind the same `.in` class.
 */
function Row({
  row,
  pinned,
  active,
  rowRef,
}: {
  row: PlatformRow;
  pinned: boolean;
  active: boolean;
  rowRef: (el: HTMLDivElement | null) => void;
}) {
  const artRef = useRef<HTMLDivElement>(null);
  const seen = useInView(artRef as RefObject<Element | null>, {
    threshold: 0.15,
    rootMargin: "0px 0px -12% 0px",
    once: true,
  });
  const Art = PLATFORM_ARTS[row.k];
  const lit = pinned ? active : seen;

  return (
    <div
      ref={rowRef}
      data-row={row.k}
      className={cn(styles.row, row.k === "gov" && styles.gov, lit && styles.in, active && styles.on)}
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
  const { trackRef, stageRef, rowsRef, index, pinned } = useScrub(PLATFORM_ROWS.length);

  return (
    <section className={styles.section} id="platform" aria-label="Radicas core">
      <div className="wrap">
        <SectionHead kicker={PLATFORM_COPY.kicker} lede={PLATFORM_COPY.lede}>
          {PLATFORM_COPY.headingLead} <em>{PLATFORM_COPY.headingEmphasis}</em>
        </SectionHead>
      </div>

      <div
        ref={trackRef}
        className={styles.track}
        style={{ "--steps": PLATFORM_ROWS.length } as CSSProperties}
      >
        <div ref={stageRef} className={styles.stage}>
          <div className={cn("wrap", styles.inner)}>
            {/* Decorative: the rows below carry the same words, and all three stay readable. */}
            <ol className={styles.ticks} aria-hidden>
              {PLATFORM_ROWS.map((row, i) => (
                <li key={row.k} className={cn(i === index && styles.on)}>
                  <b>{row.num}</b>
                  {row.name}
                </li>
              ))}
            </ol>

            <div className={styles.rows}>
              {PLATFORM_ROWS.map((row, i) => (
                <Row
                  key={row.k}
                  row={row}
                  pinned={pinned}
                  active={i === index}
                  rowRef={(el) => {
                    rowsRef.current[i] = el;
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
