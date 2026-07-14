"use client";

// Allocation — spend sliced three ways. Treemap mosaics for business unit and
// use case; a bento breakdown (hero + ranked cards) for cost centre.
import { useState } from "react";

interface Cell {
  name: string;
  pct: number;
  amt: string;
  color: string;
}
// A column item is either a single cell or a horizontal pair (a nested split).
type Item = Cell | { row: Cell[] };

const sumPct = (it: Item) => ("row" in it ? it.row.reduce((a, c) => a + c.pct, 0) : it.pct);

function CellBox({ c }: { c: Cell }) {
  return (
    <div className="tm-cell" style={{ flexGrow: c.pct, flexBasis: 0, background: c.color }}>
      <div>
        <div className="nm">{c.name}</div>
        <div className="pct">{c.pct.toFixed(1)}%</div>
      </div>
      <div className="amt">{c.amt}</div>
    </div>
  );
}

function Treemap({ cols }: { cols: Item[][] }) {
  return (
    <div className="alloc-view">
      <div className="tm">
        {cols.map((col, ci) => (
          <div className="tm-col" key={ci} style={{ flexGrow: col.reduce((s, it) => s + sumPct(it), 0), flexBasis: 0 }}>
            {col.map((it, i) =>
              "row" in it ? (
                <div className="tm-row" key={i} style={{ flexGrow: sumPct(it), flexBasis: 0 }}>
                  {it.row.map((c, j) => (
                    <CellBox c={c} key={j} />
                  ))}
                </div>
              ) : (
                <CellBox c={it} key={i} />
              ),
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const BU: Cell[] = [
  { name: "Engineering", pct: 31.0, amt: "€38k", color: "#6E6AE0" },
  { name: "Product", pct: 18.2, amt: "€23k", color: "#8C89E6" },
  { name: "Sales", pct: 15.2, amt: "€19k", color: "#138A6B" },
  { name: "Customer Success", pct: 11.5, amt: "€14k", color: "#157C99" },
  { name: "G&A", pct: 8.7, amt: "€11k", color: "#4A5578" },
  { name: "Ops", pct: 7.7, amt: "€10k", color: "#C25E1B" },
  { name: "COGS (in-product)", pct: 7.7, amt: "€10k", color: "#1E7F5C" },
];

function BarChart({ rows }: { rows: Cell[] }) {
  const max = Math.max(...rows.map((r) => r.pct));
  return (
    <div className="bu">
      <div className="bu-top">
        <span className="bu-total">€124k · 30 days</span>
        <span className="bu-cap">share of spend</span>
      </div>
      <div className="bu-list">
        {rows.map((r, i) => (
          <div className="bu-row" key={i}>
            <div className="bu-name">{r.name}</div>
            <div className="bu-bar-col">
              <div className="bu-bar" style={{ width: `${(r.pct / max) * 100}%`, backgroundColor: r.color }} />
            </div>
            <div className="bu-val">
              <span className="bu-amt">{r.amt}</span>
              <span className="bu-pct">{r.pct.toFixed(1)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const UC: Item[][] = [
  [
    { name: "In-product Praxis Assistant", pct: 25.3, amt: "€31k", color: "#138A6B" },
    { name: "AP reconciliation", pct: 8.6, amt: "€11k", color: "#C25E1B" },
  ],
  [
    { name: "Engineering tooling", pct: 20.6, amt: "€26k", color: "#6E6AE0" },
    { name: "Knowledge / Notion AI", pct: 6.7, amt: "€8k", color: "#8C89E6" },
  ],
  [
    { name: "Tier-1 support automation", pct: 17.3, amt: "€21k", color: "#157C99" },
    { name: "Sales outreach + meeting notes", pct: 13.1, amt: "€16k", color: "#138A6B" },
    {
      row: [
        { name: "CRM embedded (Einstein)", pct: 5.8, amt: "€7k", color: "#2C5BB8" },
        { name: "Other / experimentation", pct: 2.6, amt: "€3k", color: "#39415C" },
      ],
    },
  ],
];

interface Cost {
  code: string;
  name: string;
  amt: string;
  pct: string;
  desc: string;
  color: string;
  tag: "measured" | "estimated";
}

const COST: Cost[] = [
  { code: "01", name: "OpEx", amt: "€76,880", pct: "62.0", desc: "Subscriptions · seats · BU charge-back", color: "#6E6AE0", tag: "measured" },
  { code: "02", name: "COGS", amt: "€27,280", pct: "22.0", desc: "In-product inference, vector reads", color: "#138A6B", tag: "measured" },
  { code: "03", name: "CapEx", amt: "€11,160", pct: "9.0", desc: "Edge infrastructure", color: "#157C99", tag: "estimated" },
  { code: "04", name: "R&D", amt: "€6,200", pct: "5.0", desc: "Capitalised experiments", color: "#C25E1B", tag: "estimated" },
  { code: "05", name: "Other", amt: "€2,480", pct: "2.0", desc: "Unmapped, review queue", color: "#2A3350", tag: "estimated" },
];

function CostBento() {
  const hero = COST[0]!;
  const rest = COST.slice(1);
  return (
    <div className="cb">
      <div className="cb-card cb-hero" style={{ background: hero.color }}>
        <div className="cb-card-top">
          <span className="cb-code">
            {hero.code} · {hero.name}
          </span>
          <span className="cb-tag">{hero.tag}</span>
        </div>
        <div className="cb-hero-body">
          <div className="cb-name">{hero.name}</div>
          <div className="cb-amt-hero">{hero.amt}</div>
          <div className="cb-pct">{hero.pct}% of total spend</div>
          <div className="cb-desc">{hero.desc}</div>
        </div>
      </div>
      <div className="cb-col">
        {rest.map((c) => (
          <div className="cb-card cb-mini" key={c.code} style={{ flexGrow: parseFloat(c.pct), flexBasis: 0, background: c.color }}>
            <div className="cb-card-top">
              <span className="cb-code">
                {c.code} · {c.name}
              </span>
              <span className="cb-tag">{c.tag}</span>
            </div>
            <div className="cb-mini-body">
              <span className="cb-name-mini">{c.name}</span>
              <span className="cb-amt-mini">{c.amt}</span>
              <div className="cb-meta">
                {c.pct}% of total · {c.desc}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const VIEWS = [
  { id: "business unit", render: () => <BarChart rows={BU} /> },
  { id: "cost center", render: () => <CostBento /> },
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
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-2xs)",
            color: "var(--fg-subtle)",
            letterSpacing: "var(--track-mono)",
            alignSelf: "center",
            marginRight: 4,
          }}
        >
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
