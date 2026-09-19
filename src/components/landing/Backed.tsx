"use client";

import { useReveal } from "@/hooks/useReveal";
import { cn } from "@/lib/cn";
import reveal from "./reveal.module.css";
import styles from "./Backed.module.css";

export function Backed() {
  const { ref, seen, style } = useReveal<HTMLDivElement>();

  return (
    <section className={styles.backed} aria-label="Backed by Vento">
      <div ref={ref} className={cn("wrap", reveal.rv, seen && reveal.in)} style={style}>
        <span className={styles.ln} />
        <a
          className={styles.lbl}
          href="https://www.vento.ventures/"
          target="_blank"
          rel="noopener"
          aria-label="Backed by Vento — opens vento.ventures"
        >
          <span className="eyebrow">Backed by</span>
          {/* Plain img: a fixed 22px-tall logo has no optimisation headroom worth a request to /_next/image. */}
          <img
            className={styles.logo}
            src="/brand/vento.png"
            alt="Vento"
            width={331}
            height={114}
            suppressHydrationWarning
          />
        </a>
        <span className={styles.ln} />
      </div>
    </section>
  );
}
