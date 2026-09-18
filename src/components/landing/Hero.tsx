"use client";

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from "react";
import { useFunctionState } from "@/components/landing/FunctionContext";
import { FN_ICONS_HERO, Icon } from "@/components/landing/icons";
import { useTypewriter } from "@/hooks/useTypewriter";
import { cn } from "@/lib/cn";
import styles from "./Hero.module.css";

export function Hero() {
  const { index, fn, style, hoverStart, hoverEnd } = useFunctionState();
  const pillRef = useRef<HTMLSpanElement>(null);
  const labRef = useRef<HTMLSpanElement>(null);
  const measRef = useRef<HTMLSpanElement>(null);

  // The first word ships fully typed so the h1 is never empty for LCP and crawlers.
  const [typing, setTyping] = useState(false);
  if (!typing && index !== 0) setTyping(true);

  const { shown, done } = useTypewriter(style.word, { speed: 55, run: typing });

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
    <section
      id="top"
      className={styles.hero}
      aria-labelledby="hero-title"
      onMouseEnter={hoverStart}
      onMouseLeave={hoverEnd}
    >
      <div className="wrap">
        <h1 id="hero-title" className={styles.title}>
          <span className={styles.ln}>What AI costs, how it&#8217;s governed,</span>
          <span className={styles.ln}>
            in{" "}
            <span
              ref={pillRef}
              className={cn(styles.pill, done && styles.done)}
              style={
                { "--pc": style.c, "--pc-bg": style.bg, "--pc-line": style.line } as CSSProperties
              }
            >
              <span className={styles.dot}>
                <Icon paths={FN_ICONS_HERO[fn.id]} />
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
          Measured per <b>{style.unit}</b> · every rule with a named owner
        </p>
        <p className={styles.lede}>
          Built for the teams where AI already does the work. One unit of work per function, humans
          and agents together, governed by rules with a named owner.
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
