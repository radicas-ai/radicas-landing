"use client";

import { useEffect, useRef, useState } from "react";
import {
  PLATFORM_COPY,
  PLATFORM_ROWS,
  SUPPORT,
  SUPPORT_LABEL,
  type PlatformRowKey,
} from "@/data/platform";
import { useInView } from "@/hooks/useInView";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/cn";
import { CHEVRON_DOWN, PLATFORM_ICONS, Icon } from "./icons";
import { PLATFORM_ARTS } from "./PlatformArts";
import { SectionHead } from "./SectionHead";
import styles from "./Platform.module.css";

const HOVER_INTENT_MS = 260;
const PIECES_DELAY_MS = 450;
const CONNECTOR_DELAY_MS = 500;

export function Platform() {
  const reduced = useReducedMotion();
  const sheetRef = useRef<HTMLDivElement>(null);
  const seen = useInView(sheetRef, { threshold: 0.4, once: true });

  const [open, setOpen] = useState<PlatformRowKey | null>(null);
  const [built, setBuilt] = useState(false);
  const [playing, setPlaying] = useState(false);
  const intent = useRef<number | undefined>(undefined);

  // The first row opens itself once the section arrives; after that it follows the pointer.
  useEffect(() => {
    if (seen && open === null) setOpen(PLATFORM_ROWS[0].k);
  }, [seen, open]);

  useEffect(() => {
    if (open === null) return;
    setBuilt(false);
    setPlaying(false);
    if (reduced) {
      setBuilt(true);
      setPlaying(true);
      return;
    }
    const a = window.setTimeout(() => setBuilt(true), PIECES_DELAY_MS);
    const b = window.setTimeout(() => setPlaying(true), CONNECTOR_DELAY_MS);
    return () => {
      window.clearTimeout(a);
      window.clearTimeout(b);
    };
  }, [open, reduced]);

  function hover(k: PlatformRowKey) {
    window.clearTimeout(intent.current);
    intent.current = window.setTimeout(() => setOpen(k), HOVER_INTENT_MS);
  }

  useEffect(() => () => window.clearTimeout(intent.current), []);

  return (
    <section className={styles.section} id="platform" aria-label="Radicas core">
      <div className="wrap">
        <SectionHead kicker={PLATFORM_COPY.kicker} lede={PLATFORM_COPY.lede}>
          {PLATFORM_COPY.headingLead} <em>{PLATFORM_COPY.headingEmphasis}</em>
        </SectionHead>

        <div ref={sheetRef}>
          {PLATFORM_ROWS.map((row) => {
            const isOpen = open === row.k;
            const Art = PLATFORM_ARTS[row.k];
            return (
              <div
                key={row.k}
                className={cn(
                  styles.row,
                  row.k === "gov" && styles.gov,
                  isOpen && styles.open,
                  isOpen && playing && styles.play,
                )}
                onMouseEnter={() => hover(row.k)}
                onMouseLeave={() => window.clearTimeout(intent.current)}
                onClick={() => {
                  window.clearTimeout(intent.current);
                  setOpen(row.k);
                }}
              >
                <span className={styles.n}>{row.num}</span>
                <div className={styles.tx}>
                  <h3>
                    <i className={styles.badge}>
                      <Icon paths={PLATFORM_ICONS[row.k]} />
                    </i>
                    {row.name}
                    <span className={styles.chev}>
                      <Icon paths={CHEVRON_DOWN} />
                    </span>
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
                <div className={styles.art}>
                  <Art on={isOpen && built} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
