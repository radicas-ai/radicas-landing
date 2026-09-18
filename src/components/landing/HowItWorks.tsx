"use client";

import { Fragment, useEffect, useRef, useState, type CSSProperties } from "react";
import { cn } from "@/lib/cn";
import { DECLARATIONS, HOW_COPY, HOW_FUNCTIONS, OUTPUTS, CORE_STACK } from "@/data/how";
import { VENDORS } from "@/data/vendors";
import { useInView } from "@/hooks/useInView";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { RadicasMark } from "./Brand";
import { FN_ICONS_HOW, HOW_ICONS, Icon } from "./icons";
import { Wire } from "./Wire";
import styles from "./HowItWorks.module.css";

const STAGE_MS = 1400;
const SOURCE_COUNT = VENDORS.length + DECLARATIONS.length;

export function HowItWorks() {
  const aRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const inView = useInView(aRef, { threshold: 0.1 });
  const [tick, setTick] = useState<number | null>(null);
  const [broken, setBroken] = useState<Record<string, boolean>>({});

  // Off-screen the loop would burn a render every 1.4s for nobody; the mock ran it unconditionally.
  useEffect(() => {
    if (!inView || reduced) return;
    const id = window.setInterval(() => setTick((t) => (t === null ? 0 : t + 1)), STAGE_MS);
    return () => window.clearInterval(id);
  }, [inView, reduced]);

  const litSources = tick === null ? null : new Set([0, 1, 2].map((i) => (tick * 7 + i * 5) % SOURCE_COUNT));
  const litOutput = tick === null ? -1 : tick % OUTPUTS.length;
  const litFn = tick === null ? -1 : tick % HOW_FUNCTIONS.length;

  return (
    <section className={styles.section} id="how" aria-label="How it works">
      <div className="wrap">
        <div className={styles.head}>
          <div className={cn("eyebrow", styles.kicker)}>{HOW_COPY.kicker}</div>
          <h2 className={styles.title}>
            {HOW_COPY.headingLead} <em>{HOW_COPY.headingEmphasis}</em>
          </h2>
          <p>{HOW_COPY.lede}</p>
        </div>

        <div className={styles.a} ref={aRef}>
          <div className={styles.heads}>
            {HOW_COPY.columns.map((label, i) => (
              <Fragment key={label}>
                {i > 0 ? <span /> : null}
                <span className={styles.lbl}>{label}</span>
              </Fragment>
            ))}
          </div>

          <Wire />

          <div className={styles.grid}>
            {VENDORS.map((v, i) => (
              <div key={v.slug} className={styles.src}>
                <span className={cn(styles.c, litSources?.has(i) && styles.lit)} data-src-node="">
                  {v.file && !broken[v.slug] ? (
                    <img
                      src={v.file}
                      alt=""
                      loading="lazy"
                      onError={() => setBroken((b) => ({ ...b, [v.slug]: true }))}
                    />
                  ) : null}
                  <em>{v.monogram}</em>
                </span>
                <small>{v.name}</small>
              </div>
            ))}
            {DECLARATIONS.map((d, j) => (
              <div key={d.key} className={cn(styles.src, styles.decl)}>
                <span
                  className={cn(styles.c, litSources?.has(VENDORS.length + j) && styles.lit)}
                  data-src-node=""
                >
                  <Icon paths={HOW_ICONS[d.key]} />
                </span>
                <small>{d.name}</small>
              </div>
            ))}
            <span className={styles.more}>{HOW_COPY.more}</span>
          </div>

          <div className={styles.gap} />

          <div className={styles.core} data-core-col="">
            <div className={styles.ring} />
            <div className={styles.mark} data-core="">
              <RadicasMark />
            </div>
            <b>{HOW_COPY.coreTitle}</b>
            <div className={styles.stack}>
              {CORE_STACK.map((layer) => (
                <span key={layer.label} className={layer.hi ? styles.hi : undefined}>
                  {layer.label}
                </span>
              ))}
            </div>
          </div>

          <div className={styles.gap} />

          <div className={styles.outc} data-outc="">
            <div className={styles.oh}>
              <b>{HOW_COPY.outputsTitle}</b>
            </div>
            {OUTPUTS.map((o, i) => (
              <div
                key={o.key}
                data-orow=""
                className={cn(
                  styles.orow,
                  o.cls.split(" ").filter(Boolean).map((c) => styles[c]),
                  litOutput === i && styles.lit,
                )}
              >
                <span className={styles.ic}>
                  <Icon paths={HOW_ICONS[o.key]} />
                </span>
                <span>
                  <b>{o.title}</b>
                  <small>{o.desc}</small>
                </span>
                <span className={styles.badge}>{o.badge}</span>
              </div>
            ))}
          </div>

          <div className={styles.gap} />

          <div className={styles.fns}>
            {HOW_FUNCTIONS.map((f, i) => (
              <div
                key={f.key}
                data-fn=""
                className={cn(styles.fn, litFn === i && styles.lit)}
                style={{ "--pc": f.colour } as CSSProperties}
              >
                <i>
                  <Icon paths={FN_ICONS_HOW[f.key]} />
                </i>
                <div>
                  <b>{f.name}</b>
                  <small>{f.unit}</small>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.loopA}>
          <span className={styles.txt}>{HOW_COPY.loopLabel}</span>
          <span className={styles.ln} />
          <span className={styles.txt}>{HOW_COPY.loopNote}</span>
        </div>
      </div>
    </section>
  );
}
