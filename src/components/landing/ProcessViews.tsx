"use client";

import { projectionPath } from "@/lib/charts";
import { cn } from "@/lib/cn";
import type { ProcessContent, ProcessStepKey, RecKind } from "@/data/process";
import { useTypewriter } from "@/hooks/useTypewriter";
import { RadicasMark } from "./Brand";
import { ARROW_RIGHT, Icon } from "./icons";
import styles from "./Process.module.css";

type ViewProps = { p: ProcessContent };

const REC_LABEL: Record<RecKind, string> = { opt: "Optimise", scale: "Scale", stop: "Stop" };

export function AskView({ p }: ViewProps) {
  const { shown, done } = useTypewriter(p.q, { speed: 20, run: true });

  return (
    <>
      <div className={styles.convo}>
        <div className={styles.you}>
          <span className={styles.who}>You</span>
          <span className={cn(styles.bub, done && styles.done)}>{shown}</span>
        </div>
        <div className={styles.rad}>
          <span className={styles.av}>
            <RadicasMark />
          </span>
          <div className={styles.card}>
            <span className={styles.who}>
              <i />
              Radicas · answered from the data model
            </span>
            <p>
              <b>{p.tiles[0][1]}</b> per {p.unit}, {p.tiles[0][2]} against the baseline.{" "}
              {p.why.replace(/^Why /, "Mostly because ")}.
            </p>
            <span className={styles.next}>
              → the numbers, the reason and the rule follow in the next steps
            </span>
          </div>
        </div>
      </div>
      <div className={styles.ask}>
        <span className={styles.q}>Ask about spend, work, agents…</span>
        <span className={styles.send}>
          <Icon paths={ARROW_RIGHT} />
        </span>
      </div>
    </>
  );
}

export function SeeView({ p }: ViewProps) {
  const g = projectionPath(p);

  return (
    <>
      <div className={styles.view}>
        {p.tiles.map(([label, value, sub, basis]) => (
          <div key={label} className={styles.tile}>
            <span className="eyebrow">{label}</span>
            <span className={styles.v}>
              {value}
              <small>{sub}</small>
            </span>
            <div className={styles.basis}>
              {basis.map((b) => (
                <span key={b}>{b}</span>
              ))}
            </div>
          </div>
        ))}
        <div className={cn(styles.tile, styles.add)}>
          + Add a KPI
          <br />
          <span className={styles.src}>from the Framework</span>
        </div>
      </div>
      <div className={styles.proj}>
        <div className={styles.hd}>
          <span className="eyebrow">Cost per {p.unit} · last 6 months + projection</span>
          <span className="chip mono">baseline {p.fmt(p.base)}</span>
        </div>
        <svg viewBox={`0 0 ${g.w} ${g.h}`} preserveAspectRatio="none" aria-hidden>
          <line
            x1="0"
            x2={g.w}
            y1={g.baseY}
            y2={g.baseY}
            stroke="var(--color-carbon-300)"
            strokeWidth="1"
            strokeDasharray="2 4"
          />
          <path
            d={g.histD}
            fill="none"
            stroke="var(--color-brand-primary)"
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
            strokeLinejoin="round"
          />
          <path
            d={g.futD}
            fill="none"
            stroke="var(--color-brand-primary)"
            strokeWidth="2"
            strokeDasharray="4 5"
            vectorEffect="non-scaling-stroke"
          />
          <circle
            cx={g.dotX}
            cy={g.dotY}
            r="4"
            fill="var(--card)"
            stroke="var(--color-brand-primary)"
            strokeWidth="2"
          />
        </svg>
        <div className={styles.leg}>
          <span>
            <i />
            Measured
          </span>
          <span>
            <i className={styles.d} />
            Projected
          </span>
          <span>
            <i className={styles.g} />
            Baseline · declared by {p.owner}
          </span>
        </div>
      </div>
    </>
  );
}

export function UnderstandView({ p }: ViewProps) {
  return (
    <>
      <div className={styles.expl}>
        <span className="eyebrow">{p.why}</span>
        <p>{p.expl}</p>
        <div className={styles.ev}>
          {p.ev.map((e) => (
            <span key={e} className="chip">
              {e}
            </span>
          ))}
        </div>
      </div>
      <div className={styles.recs}>
        {p.recs.map(([kind, title, metric, pick]) => (
          <div key={title} className={cn(styles.rec, pick && styles.pick)}>
            <span className={cn(styles.tag, styles[kind])}>{REC_LABEL[kind]}</span>
            <b>{title}</b>
            <span>{metric}</span>
            <span className={styles.go}>{pick ? "Turn into a rule →" : "Keep watching →"}</span>
          </div>
        ))}
      </div>
    </>
  );
}

export function GovernView({ p }: ViewProps) {
  return (
    <>
      <div className={styles.rule}>
        <div className={styles.rh}>
          <b>{p.rule}</b>
          <span className="chip mono">{p.rid}</span>
          <span className={cn(styles.st, "chip good")}>Active</span>
        </div>
        <div className={styles.rrow}>
          <span className={styles.k}>When</span>
          <span className={styles.v} dangerouslySetInnerHTML={{ __html: p.when }} />
          <span className={cn(styles.tog, styles.on)}>
            <i />
            Watch
          </span>
        </div>
        <div className={styles.rrow}>
          <span className={styles.k}>Alert</span>
          <span className={styles.v}>
            <span className={styles.who}>
              <i />
              {p.owner}
            </span>{" "}
            in Slack · advisory, with the evidence attached
          </span>
          <span className={cn(styles.tog, styles.on)}>
            <i />
            On
          </span>
        </div>
        <div className={cn(styles.rrow, styles.adv)}>
          <span className={styles.k}>Enforce</span>
          <span className={styles.v}>
            {p.enforce} — the advanced step, mandated per scope, revocable
          </span>
          <span className={styles.lock}>Advanced</span>
        </div>
      </div>
      <div className={styles.mandate}>
        <span className="chip">Named owner</span>
        <span className="chip">Evidence attached</span>
        <span className="chip">Every alert logged</span>
      </div>
      <p className={styles.quote}>
        <b>A budget that warns is a notification. A budget that acts is a layer.</b>
      </p>
    </>
  );
}

export function LoopView({ p }: ViewProps) {
  return (
    <>
      <div className={styles.loopv}>
        <div className={styles.lbox}>
          <span className="eyebrow">What happened</span>
          {p.loop.map(([k, v]) => (
            <div key={k} className={styles.row}>
              <span>{k}</span>
              <span className="mono">{v}</span>
            </div>
          ))}
        </div>
        <div className={styles.larr}>
          <Icon paths={ARROW_RIGHT} />
        </div>
        <div className={styles.lbox}>
          <span className="eyebrow">Re-entered as</span>
          {p.re.map(([k, v]) => (
            <div key={k} className={styles.row}>
              <span>{k}</span>
              <span className="mono" dangerouslySetInnerHTML={{ __html: v }} />
            </div>
          ))}
        </div>
      </div>
      <p className={styles.lnote}>
        The next time anyone asks the same question, the answer is measured against the new baseline
        — and it says so.
      </p>
    </>
  );
}

export function ProcessView({ step, p }: { step: ProcessStepKey } & ViewProps) {
  switch (step) {
    case "ask":
      return <AskView p={p} />;
    case "see":
      return <SeeView p={p} />;
    case "understand":
      return <UnderstandView p={p} />;
    case "govern":
      return <GovernView p={p} />;
    case "loop":
      return <LoopView p={p} />;
  }
}
