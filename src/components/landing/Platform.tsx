"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { PLATFORM_ROWS } from "@/data/platform";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { SectionHead } from "./SectionHead";
import { Icon, PLATFORM_ICONS } from "./icons";
import { PLATFORM_ARTS } from "./PlatformArts";
import styles from "./Platform.module.css";

const HOVER_OPEN_DELAY = 260;

export function Platform() {
  const sheetRef = useRef<HTMLDivElement>(null);
  const pending = useRef<number | undefined>(undefined);
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(0);
  // Assume a pointer until the media query is readable, so the server markup matches the desktop default.
  const [canHover, setCanHover] = useState(true);
  const [revealed, setRevealed] = useState<boolean[]>(() => PLATFORM_ROWS.map(() => false));

  const cancelPending = useCallback(() => {
    window.clearTimeout(pending.current);
    pending.current = undefined;
  }, []);

  useEffect(() => {
    setCanHover(window.matchMedia("(hover: hover)").matches);
  }, []);

  useEffect(() => cancelPending, [cancelPending]);

  useEffect(() => {
    const sheet = sheetRef.current;
    if (!sheet) return;
    const rows = Array.from(sheet.querySelectorAll<HTMLElement>("[data-row]"));
    if (reduced || typeof IntersectionObserver === "undefined") {
      setRevealed(rows.map(() => true));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          io.unobserve(entry.target);
          const i = Number((entry.target as HTMLElement).dataset.row);
          setRevealed((prev) => (prev[i] ? prev : prev.map((v, j) => (j === i ? true : v))));
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );
    for (const row of rows) io.observe(row);
    return () => io.disconnect();
  }, [reduced]);

  return (
    <section className={styles.section} id="platform" aria-labelledby="g5t">
      <div className="wrap">
        <div className={styles.head}>
          <SectionHead
            kicker="What the platform does"
            lede="Connect what you already run. Map people and agents to their work. Price every unit of it. Keep every rule and action on a ledger you can read back."
          >
            <span id="g5t">
              One estate, one map, one receipt, <em>one ledger.</em>
            </span>
          </SectionHead>
        </div>
        <div className={styles.sheet} ref={sheetRef}>
          {PLATFORM_ROWS.map((row, i) => {
            const Art = PLATFORM_ARTS[row.k];
            return (
              <div
                key={row.k}
                data-row={i}
                tabIndex={0}
                className={cn(
                  styles.row,
                  styles.rv,
                  (!canHover || open === i) && styles.open,
                  revealed[i] && styles.in,
                )}
                onMouseEnter={() => {
                  if (!canHover) return;
                  cancelPending();
                  pending.current = window.setTimeout(() => setOpen(i), HOVER_OPEN_DELAY);
                }}
                onMouseLeave={cancelPending}
                onFocus={() => canHover && setOpen(i)}
              >
                <span className={styles.n}>{row.num}</span>
                <div>
                  <h3>
                    <i>
                      <Icon paths={PLATFORM_ICONS[row.k]} />
                    </i>
                    {row.name}
                  </h3>
                  <p>{row.desc}</p>
                </div>
                <div className={styles.art}>
                  <div>
                    <Art />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
