"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { HERO_ICONS, Icon } from "@/components/landing/icons";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useTypewriter } from "@/hooks/useTypewriter";
import { cn } from "@/lib/cn";
import styles from "./Hero.module.css";

const DWELL_MS = 3800;

const WORDS = [
  { word: "cost", c: "#7571EB", bg: "rgba(117,113,235,.12)", line: "rgba(117,113,235,.35)" },
  { word: "governance", c: "#D69520", bg: "rgba(214,149,32,.13)", line: "rgba(214,149,32,.4)" },
  { word: "return", c: "#00A378", bg: "rgba(0,163,120,.12)", line: "rgba(0,163,120,.38)" },
] as const;

export function Hero() {
  const reduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const style = WORDS[index];

  const pillRef = useRef<HTMLSpanElement>(null);
  const labRef = useRef<HTMLSpanElement>(null);
  const measRef = useRef<HTMLSpanElement>(null);

  // The first word ships fully typed so the h1 is never empty for LCP and crawlers.
  const [typing, setTyping] = useState(false);
  if (!typing && index !== 0) setTyping(true);

  const { shown, done } = useTypewriter(style.word, { speed: 55, run: typing });

  useEffect(() => {
    if (reduced) return;
    const id = window.setInterval(() => setIndex((i) => (i + 1) % WORDS.length), DWELL_MS);
    return () => window.clearInterval(id);
  }, [reduced]);

  const fit = useCallback(() => {
    const pill = pillRef.current;
    const lab = labRef.current;
    const meas = measRef.current;
    if (!pill || !lab || !meas) return;
    const from = getComputedStyle(lab);
    meas.style.fontFamily = from.fontFamily;
    meas.style.fontSize = from.fontSize;
    meas.style.fontWeight = from.fontWeight;
    meas.style.letterSpacing = from.letterSpacing;
    pill.style.setProperty("--w", `${Math.ceil(meas.getBoundingClientRect().width + 2)}px`);
  }, []);

  useLayoutEffect(fit, [fit, style.word]);

  useEffect(() => {
    window.addEventListener("resize", fit);
    document.fonts?.ready.then(fit);
    return () => window.removeEventListener("resize", fit);
  }, [fit]);

  return (
    <section id="top" className={styles.hero} aria-labelledby="hero-title">
      <div className="wrap">
        <h1 id="hero-title" className={styles.title}>
          <span className={styles.ln}>Humans and AI, one workforce.</span>
          <span className={styles.ln}>
            Master its{" "}
            <span
              ref={pillRef}
              className={cn(styles.pill, done && styles.done)}
              style={
                { "--pc": style.c, "--pc-bg": style.bg, "--pc-line": style.line } as CSSProperties
              }
            >
              <span className={styles.dot}>
                <Icon paths={HERO_ICONS[style.word]} />
              </span>
              <span ref={labRef} className={styles.lab}>
                {shown}
              </span>
            </span>
            .
          </span>
        </h1>
        <span ref={measRef} className={styles.meas} aria-hidden>
          {style.word}
        </span>
        <p className={styles.unit} style={{ "--pc": style.c } as CSSProperties}>
          Radicas · <b>the layer underneath</b>
        </p>
        <p className={styles.lede}>
          In every function, people and agents now do the work together. Radicas shows what that work
          costs, keeps it governed, and proves what it returns.
        </p>
        <div className={styles.ctaRow}>
          <a className="btn btn-primary btn-lg" href="#contact">
            Book a demo
          </a>
          <a className="btn btn-secondary btn-lg" href="#process">
            See how it works
          </a>
        </div>
      </div>
    </section>
  );
}
