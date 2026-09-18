import type { ReactNode } from "react";
import { cn } from "@/lib/cn";
import type { PlatformRowKey } from "@/data/platform";
import styles from "./Platform.module.css";

export function EstateArt() {
  return (
    <>
      <div className={styles.inv}>
        <div className={cn(styles.rw, styles.hd)}>
          <span>Entity</span>
          <span className={styles.hide}>Owner</span>
          <span className={styles.n}>€ / mo</span>
          <span>State</span>
        </div>
        <div className={styles.rw}>
          <b>Review agent</b>
          <span className={styles.hide}>Platform lead</span>
          <span className={styles.n}>412</span>
          <span className="chip good">reconciled</span>
        </div>
        <div className={styles.rw}>
          <b>Claude Code · 14 seats</b>
          <span className={styles.hide}>Eng manager</span>
          <span className={styles.n}>1,120</span>
          <span className="chip good">reconciled</span>
        </div>
        <div className={styles.rw}>
          <b>Planner agent</b>
          <span className={cn(styles.none, styles.hide)}>no owner</span>
          <span className={styles.n}>96</span>
          <span className="chip warn">estimated</span>
        </div>
        <div className={styles.rw}>
          <b>Support reply agent</b>
          <span className={styles.hide}>Support ops</span>
          <span className={styles.n}>1,870</span>
          <span className="chip good">reconciled</span>
        </div>
      </div>
      <div className={styles.cov}>
        <div className={styles.bar}>
          <i style={{ width: "91%", background: "var(--color-brand-primary)" }} />
          <i style={{ width: "7%", background: "var(--warning)" }} />
          <i style={{ width: "2%", background: "var(--color-carbon-300)" }} />
        </div>
        <div className={styles.lg}>
          <span>
            <i style={{ background: "var(--color-brand-primary)" }} />
            reconciled 91%
          </span>
          <span>
            <i style={{ background: "var(--warning)" }} />
            estimated 7%
          </span>
          <span>
            <i style={{ background: "var(--color-carbon-300)" }} />
            unassigned 2%
          </span>
        </div>
      </div>
    </>
  );
}

type MapNode = { name: string; sub: string; y: number };

const PEOPLE: MapNode[] = [
  { name: "M. Rossi", sub: "human", y: 20 },
  { name: "Review agent", sub: "agent · Anthropic", y: 66 },
  { name: "Planner agent", sub: "agent · OpenAI", y: 112 },
];
const TEAMS: MapNode[] = [
  { name: "Platform", sub: "owner · Platform lead", y: 30 },
  { name: "Payments", sub: "owner · Payments lead", y: 100 },
];
const UNITS: MapNode[] = [
  { name: "LIN-482", sub: "task · shipped", y: 20 },
  { name: "PR #1290", sub: "review · merged", y: 66 },
  { name: "LIN-491", sub: "task · in progress", y: 112 },
];

/** Review agent → Platform → LIN-482 is the one lit path. */
const LINKS: [number, number, number, number, boolean?][] = [
  [150, 37, 230, 47],
  [150, 83, 230, 47, true],
  [150, 129, 230, 117],
  [360, 47, 420, 37, true],
  [360, 47, 420, 83],
  [360, 117, 420, 129],
];

function Boxes({ nodes, x, hi }: { nodes: MapNode[]; x: number; hi: string }) {
  return (
    <>
      {nodes.map((node) => (
        <g key={node.name}>
          <rect
            className={cn(styles.nd, node.name === hi && styles.hi)}
            x={x}
            y={node.y}
            width={130}
            height={34}
          />
          <text x={x + 10} y={node.y + 15}>
            {node.name}
          </text>
          <text className={styles.s} x={x + 10} y={node.y + 27}>
            {node.sub}
          </text>
        </g>
      ))}
    </>
  );
}

export function MapArt() {
  return (
    <div className={styles.map}>
      <svg viewBox="0 0 570 160" role="img" aria-label="People and agents mapped to teams and units of work">
        <text className={styles.h} x={20} y={10}>
          People &amp; agents
        </text>
        <text className={styles.h} x={230} y={10}>
          Teams
        </text>
        <text className={styles.h} x={420} y={10}>
          Units of work
        </text>
        {LINKS.map(([x1, y1, x2, y2, hi]) => (
          <path
            key={`${x1}-${y1}-${x2}-${y2}`}
            className={cn(styles.ln, hi && styles.hi)}
            d={`M${x1} ${y1} C ${x1 + 40} ${y1}, ${x2 - 40} ${y2}, ${x2} ${y2}`}
          />
        ))}
        <Boxes nodes={PEOPLE} x={20} hi="Review agent" />
        <Boxes nodes={TEAMS} x={230} hi="Platform" />
        <Boxes nodes={UNITS} x={420} hi="LIN-482" />
      </svg>
    </div>
  );
}

export function ReceiptArt() {
  return (
    <>
      <div className={styles.rcp}>
        <div className={styles.rh}>
          <b>LIN-482 · one shipped task</b>
        </div>
        <div className={styles.ln}>
          <span>Planner + implementer</span>
          <span className={styles.d}>3 runs</span>
          <span className={styles.n}>€1.29</span>
        </div>
        <div className={cn(styles.ln, styles.warn)}>
          <span>Review agent</span>
          <span className={styles.d}>4 runs · 2 retries</span>
          <span className={styles.n}>€0.74</span>
        </div>
        <div className={cn(styles.ln, styles.sub)}>
          <span>AI cost</span>
          <span className={styles.d}>failed / retried €0.29</span>
          <span className={styles.n}>€2.41</span>
        </div>
        <div className={styles.ln}>
          <span>Human review</span>
          <span className={styles.d}>12 min · rate card</span>
          <span className={styles.n}>€11.20</span>
        </div>
        <div className={cn(styles.ln, styles.tot)}>
          <span>Cost of this task</span>
          <span className={styles.d}>3h 40m · merged first pass</span>
          <span className={styles.n}>€13.61</span>
        </div>
      </div>
      <div className={styles.meta}>
        <span className="chip brand">AI + human</span>
        <span className="chip">basis Linear · GitHub · invoice</span>
        <span className="chip">coverage 94%</span>
      </div>
    </>
  );
}

export function LedgerArt() {
  return (
    <>
      <div className={styles.rule}>
        <div>
          <b>Review-agent retries</b>
          <span className={styles.id}>R-212 · v2 · owner Platform lead</span>
        </div>
        <span className="chip brand">watching</span>
        <span className={styles.acts}>
          <span className="chip good">Alert · live</span>
          <span className="chip">Enforce · advanced step</span>
        </span>
      </div>
      <div className={styles.chain}>
        <div className={styles.ev}>
          <span className={styles.t}>09:12Z</span>
          <span className={cn(styles.d, styles.w)}>W</span>
          <span>
            <b>Watcher fired</b> · 4.3 retries per run, threshold 3
          </span>
          <span className={styles.who}>→ Platform lead</span>
        </div>
        <div className={styles.ev}>
          <span className={styles.t}>09:18Z</span>
          <span className={cn(styles.d, styles.o)}>O</span>
          <span>
            <b>Owner acknowledged</b> · cap approved for Platform
          </span>
          <span className={styles.who}>Platform lead</span>
        </div>
        <div className={styles.ev}>
          <span className={styles.t}>09:40Z</span>
          <span className={cn(styles.d, styles.x)}>X</span>
          <span>
            <b>Executor applied</b> · retries ≤ 3 <span className="chip">advanced</span>
          </span>
          <span className={styles.who}>mandate M-07</span>
        </div>
      </div>
    </>
  );
}

export const PLATFORM_ARTS: Record<PlatformRowKey, () => ReactNode> = {
  estate: EstateArt,
  map: MapArt,
  receipt: ReceiptArt,
  ledger: LedgerArt,
};
