"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  DRIVERS,
  DRIVER_MAX,
  ECONOMICS,
  GOVERNANCE,
  RECOMMENDATIONS,
  type ProcessStepKey,
} from "@/data/process";
import { useCountUp } from "@/hooks/useCountUp";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { cn } from "@/lib/cn";
import { REFRESH, Icon } from "./icons";
import styles from "./Process.module.css";

/** True one frame after mount, so the entrance transitions actually run. */
function useRevealed(): boolean {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const raf = requestAnimationFrame(() => requestAnimationFrame(() => setOn(true)));
    return () => cancelAnimationFrame(raf);
  }, []);
  return on;
}

function Rv({ on, i, children }: { on: boolean; i: number; children: ReactNode }) {
  return (
    <div className={cn(styles.rv, on && styles.in)} style={{ transitionDelay: `${80 + i * 140}ms` }}>
      {children}
    </div>
  );
}

function CountUp({ target, run, duration }: { target: string; run: boolean; duration: number }) {
  return <>{useCountUp(target, { run, duration })}</>;
}

function Head({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className={styles.ph}>
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h3>{title}</h3>
      </div>
    </div>
  );
}

function Economics() {
  const on = useRevealed();

  return (
    <>
      <Head eyebrow={ECONOMICS.eyebrow} title={ECONOMICS.title} />
      <div className={styles.econ}>
        <Rv on={on} i={0}>
          <div className={styles.big}>
            <CountUp target={`€${ECONOMICS.value}`} run={on} duration={1000} />
          </div>
          <p>{ECONOMICS.caption}</p>
          <span className={styles.dlt}>{ECONOMICS.delta}</span>
        </Rv>
        <Rv on={on} i={1}>
          <div className={styles.split}>
            {ECONOMICS.split.map((s) => (
              <i
                key={s.label}
                style={{
                  width: on ? `${s.pct}%` : 0,
                  background: s.tone === "brand" ? "var(--color-brand-primary)" : "var(--warning)",
                }}
              />
            ))}
          </div>
          <div className={styles.lg}>
            {ECONOMICS.split.map((s) => (
              <div key={s.label}>
                <i
                  style={{
                    background: s.tone === "brand" ? "var(--color-brand-primary)" : "var(--warning)",
                  }}
                />
                <span>
                  {s.label}
                  {s.note ? <small>{s.note}</small> : null}
                </span>
                <b>{s.value}</b>
              </div>
            ))}
          </div>
          <div className={styles.ppl}>
            <b>{ECONOMICS.people.value}</b>
            <span>{ECONOMICS.people.text}</span>
          </div>
        </Rv>
      </div>
    </>
  );
}

function Drivers() {
  const on = useRevealed();
  const money = (v: number) => `${v < 0 ? "−" : "+"}€${Math.abs(v).toFixed(2)}`;

  return (
    <>
      <Head eyebrow={DRIVERS.eyebrow} title={DRIVERS.title} />
      <div className={styles.dhd}>
        <span className={styles.pt}>
          <small>{DRIVERS.from.label}</small>
          <b>{DRIVERS.from.value}</b>
        </span>
        <span className={cn(styles.ar, on && styles.go)} />
        <span className={cn(styles.pt, styles.end)}>
          <small>{DRIVERS.to.label}</small>
          <b>{DRIVERS.to.value}</b>
        </span>
      </div>
      <div className={styles.dv}>
        {DRIVERS.rows.map((r, k) => {
          const up = r.delta > 0;
          return (
            <div
              key={r.label}
              className={cn(styles.dr, styles.rv, on && styles.in)}
              style={{ transitionDelay: `${80 + k * 140}ms` }}
            >
              <span className={styles.lb}>
                {r.label}
                <small>{r.note}</small>
              </span>
              <span className={styles.tr}>
                <i
                  className={up ? styles.pos : styles.neg}
                  style={{
                    width: on ? `${((Math.abs(r.delta) / DRIVER_MAX) * 62).toFixed(1)}%` : 0,
                    transitionDelay: `${320 + k * 160}ms`,
                  }}
                />
              </span>
              <span className={cn(styles.v, up ? styles.pos : styles.neg)}>{money(r.delta)}</span>
            </div>
          );
        })}
      </div>
      <Rv on={on} i={3}>
        <div className={styles.note}>
          <b>{DRIVERS.note.lead}</b> {DRIVERS.note.rest}
        </div>
      </Rv>
    </>
  );
}

function Recommendations({ onRule }: { onRule: () => void }) {
  const on = useRevealed();

  return (
    <>
      <Head eyebrow={RECOMMENDATIONS.eyebrow} title={RECOMMENDATIONS.title} />
      <div className={styles.rcs}>
        {RECOMMENDATIONS.cards.map((c, k) => (
          <Rv key={c.body} on={on} i={k}>
            <div className={styles.rc}>
              <span className={styles.tag}>{c.tag}</span>
              <span className={styles.fx}>{c.fx}</span>
              <b>{c.body}</b>
              <div className={styles.ef}>
                <span>Expected</span>
                <strong>{c.effect}</strong>
              </div>
            </div>
          </Rv>
        ))}
      </div>
      <Rv on={on} i={2}>
        <div className={styles.res}>
          <span>
            {RECOMMENDATIONS.resultLead} <b>{RECOMMENDATIONS.resultValue}</b>
            {RECOMMENDATIONS.resultRest}
          </span>
          <button className="btn btn-primary" type="button" onClick={onRule}>
            {RECOMMENDATIONS.cta}
          </button>
        </div>
      </Rv>
    </>
  );
}

function Governance() {
  const on = useRevealed();
  const reduced = useReducedMotion();

  return (
    <>
      <Head eyebrow={GOVERNANCE.eyebrow} title={GOVERNANCE.title} />
      <Rv on={on} i={0}>
        <div className={styles.rule}>
          <span className="eyebrow">{GOVERNANCE.ruleEyebrow}</span>
          <p>{GOVERNANCE.rule}</p>
        </div>
      </Rv>
      <ol className={styles.tl}>
        {GOVERNANCE.timeline.map((t, k) => (
          <li
            key={t.k}
            className={cn(on && styles.in)}
            style={{ transitionDelay: reduced ? "0ms" : `${300 + k * 200}ms` }}
          >
            <span className={styles.k}>
              <i />
              {t.k}
              <em>{t.when}</em>
            </span>
            <p>{t.text}</p>
          </li>
        ))}
      </ol>
      <Rv on={on} i={2}>
        <div className={styles.adv}>
          <span className={styles.lock}>{GOVERNANCE.advancedLabel}</span>
          {GOVERNANCE.advanced}
        </div>
      </Rv>
      <Rv on={on} i={3}>
        <div className={styles.back}>
          <Icon paths={REFRESH} />
          {GOVERNANCE.back}
        </div>
      </Rv>
    </>
  );
}

export function ProcessView({ step, onRule }: { step: ProcessStepKey; onRule: () => void }) {
  if (step === "econ") return <Economics />;
  if (step === "drv") return <Drivers />;
  if (step === "rec") return <Recommendations onRule={onRule} />;
  return <Governance />;
}
