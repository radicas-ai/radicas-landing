"use client";

// Ported verbatim from the original landing (allocation.jsx) — Allocation surface with group-by.
import { useState } from "react";

const FLOW = [
  { code: "01", name: "opex", amt: "€76,880", pct: 62.0, color: "#6E6AE0", desc: "subscriptions · seats", measured: true },
  { code: "02", name: "cogs", amt: "€27,280", pct: 22.0, color: "#138A6B", desc: "in-product inference", measured: true },
  { code: "03", name: "capex", amt: "€11,160", pct: 9.0, color: "#157C99", desc: "edge infra", measured: false },
  { code: "04", name: "r&d", amt: "€6,200", pct: 5.0, color: "#C25E1B", desc: "capitalised experiments", measured: false },
  { code: "05", name: "other", amt: "€2,480", pct: 2.0, color: "#46506E", desc: "unmapped · review queue", measured: false },
];

function CostCenter() {
  const W = 720,
    H = 600,
    top = 12,
    bot = 12,
    H2 = H - top - bot;
  const lx0 = 6,
    lx1 = 42,
    rx0 = 430,
    rx1 = 458,
    lblx = 478;
  const gap = 7;
  const totalGap = gap * (FLOW.length - 1);
  const slot = H2 / FLOW.length;
  let lc = top,
    rc = top;
  const ribbons: React.ReactNode[] = [];
  const nodes: React.ReactNode[] = [];
  const conns: React.ReactNode[] = [];
  const labels: React.ReactNode[] = [];
  FLOW.forEach((f, i) => {
    const lh = (f.pct / 100) * H2;
    const rh = (f.pct / 100) * (H2 - totalGap);
    const ly0 = lc,
      ly1 = lc + lh;
    const ry0 = rc,
      ry1 = rc + rh;
    const cx = (lx1 + rx0) / 2;
    const nodeMid = (ry0 + ry1) / 2;
    const labelY = top + (i + 0.5) * slot;
    ribbons.push(
      <path key={"rb" + i} d={`M ${lx1} ${ly0} C ${cx} ${ly0}, ${cx} ${ry0}, ${rx0} ${ry0} L ${rx0} ${ry1} C ${cx} ${ry1}, ${cx} ${ly1}, ${lx1} ${ly1} Z`} fill={f.color} fillOpacity="0.18" />,
    );
    nodes.push(<rect key={"nd" + i} x={rx0} y={ry0} width={rx1 - rx0} height={Math.max(2.5, rh)} rx="2" fill={f.color} />);
    const ccx = (rx1 + lblx) / 2;
    conns.push(
      <path key={"cn" + i} d={`M ${rx1} ${nodeMid} C ${ccx} ${nodeMid}, ${ccx} ${labelY}, ${lblx - 6} ${labelY}`} fill="none" stroke={f.color} strokeOpacity="0.4" strokeWidth="1" />,
    );
    labels.push(
      <g key={"lb" + i}>
        <text x={lblx} y={labelY - 14} fill={f.color} fontFamily="var(--font-mono)" fontSize="9" letterSpacing="0.06em">
          {f.code} · {f.name}
        </text>
        {f.measured && (
          <text x={lblx + 150} y={labelY - 14} textAnchor="end" fill="var(--semantic-allow)" fontFamily="var(--font-mono)" fontSize="8" letterSpacing="0.08em">
            measured
          </text>
        )}
        <text x={lblx} y={labelY + 4} fill="var(--fg)" fontFamily="var(--font-mono)" fontSize="15" fontWeight="500">
          {f.amt}
        </text>
        <text x={lblx + 150} y={labelY + 4} textAnchor="end" fill="var(--fg-subtle)" fontFamily="var(--font-mono)" fontSize="9">
          {f.pct.toFixed(1)}%
        </text>
        <text x={lblx} y={labelY + 18} fill="var(--fg-subtle)" fontFamily="var(--font-mono)" fontSize="8.5">
          {f.desc}
        </text>
      </g>,
    );
    lc = ly1;
    rc = ry1 + gap;
  });
  return (
    <div className="alloc-view">
      <svg className="flow-svg" viewBox={`0 0 ${W} ${H}`}>
        <rect x={lx0} y={top} width={lx1 - lx0} height={H2} rx="3" fill="#1B2236" stroke="var(--border)" />
        <text x={(lx0 + lx1) / 2} y={top + H2 / 2} fill="var(--fg)" fontFamily="var(--font-mono)" fontSize="12" fontWeight="600" textAnchor="middle" transform={`rotate(-90 ${(lx0 + lx1) / 2} ${top + H2 / 2})`}>
          €124k · 30 days
        </text>
        {ribbons}
        {conns}
        {nodes}
        {labels}
      </svg>
    </div>
  );
}

interface Cell {
  name: string;
  pct: number;
  amt: string;
  color: string;
}
function Treemap({ cols }: { cols: Cell[][] }) {
  return (
    <div className="alloc-view">
      <div className="tm">
        {cols.map((col, ci) => {
          const w = col.reduce((s, c) => s + c.pct, 0);
          return (
            <div className="tm-col" key={ci} style={{ flexGrow: w, flexBasis: 0 }}>
              {col.map((c, i) => (
                <div className="tm-cell" key={i} style={{ flexGrow: c.pct, flexBasis: 0, background: c.color }}>
                  <div>
                    <div className="nm">{c.name}</div>
                    <div className="pct">{c.pct.toFixed(1)}%</div>
                  </div>
                  <div className="amt">{c.amt}</div>
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  );
}

const BU: Cell[][] = [
  [{ name: "Engineering", pct: 31.0, amt: "€38k", color: "#6E6AE0" }],
  [{ name: "Product", pct: 18.2, amt: "€23k", color: "#8C89E6" }, { name: "Ops", pct: 7.7, amt: "€10k", color: "#C25E1B" }],
  [{ name: "Sales", pct: 15.2, amt: "€19k", color: "#138A6B" }, { name: "G&A", pct: 8.7, amt: "€11k", color: "#232B45" }],
  [{ name: "CS", pct: 11.5, amt: "€14k", color: "#157C99" }, { name: "COGS (in-product)", pct: 7.7, amt: "€10k", color: "#1E7F5C" }],
];
const UC: Cell[][] = [
  [{ name: "In-product Praxis Assistant", pct: 25.3, amt: "€31k", color: "#138A6B" }, { name: "AP reconciliation", pct: 8.6, amt: "€11k", color: "#C25E1B" }],
  [{ name: "Engineering tooling", pct: 20.6, amt: "€26k", color: "#6E6AE0" }, { name: "Knowledge / Notion AI", pct: 6.7, amt: "€8k", color: "#8C89E6" }],
  [{ name: "Tier-1 support automation", pct: 17.3, amt: "€21k", color: "#157C99" }, { name: "Sales outreach + notes", pct: 13.1, amt: "€16k", color: "#138A6B" }],
  [{ name: "CRM", pct: 5.8, amt: "€7k", color: "#2C5BB8" }, { name: "Other", pct: 2.6, amt: "€3k", color: "#39415C" }],
];

const VIEWS = [
  { id: "business unit", render: () => <Treemap cols={BU} /> },
  { id: "cost center", render: () => <CostCenter /> },
  { id: "use case", render: () => <Treemap cols={UC} /> },
];

export function AllocationVisual() {
  const [g, setG] = useState(0);
  return (
    <div className="pv">
      <div className="pv-bar">
        <span className="pv-dots">
          <i></i>
          <i></i>
          <i></i>
        </span>
        <span className="pv-title">allocation</span>
        <span className="pv-live" style={{ textTransform: "none" }}>
          slice without restructuring the gl
        </span>
      </div>
      <div className="groupby">
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-2xs)", color: "var(--fg-subtle)", letterSpacing: "var(--track-mono)", alignSelf: "center", marginRight: 4 }}>
          group by
        </span>
        {VIEWS.map((v, i) => (
          <button key={i} className={"gb-tab" + (g === i ? " active" : "")} onClick={() => setG(i)}>
            {v.id}
          </button>
        ))}
      </div>
      {VIEWS[g]!.render()}
    </div>
  );
}
