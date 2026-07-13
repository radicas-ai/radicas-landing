"use client";

// Allocation — a ranked horizontal-bar breakdown of AI spend, sliced three ways.
// Form: magnitude + ranking → horizontal bars (easier to read than treemap areas).
// Colour: one periwinkle hue as a sequential ramp by rank; length carries the value.
import { useState } from "react";

type Row = { name: string; amt: string; pct: number; sub?: string };

const BU: Row[] = [
  { name: "Engineering", amt: "€38k", pct: 31.0 },
  { name: "Product", amt: "€23k", pct: 18.2 },
  { name: "Sales", amt: "€19k", pct: 15.2 },
  { name: "Customer Success", amt: "€14k", pct: 11.5 },
  { name: "G&A", amt: "€11k", pct: 8.7 },
  { name: "Ops", amt: "€10k", pct: 7.7 },
  { name: "COGS (in-product)", amt: "€10k", pct: 7.7 },
];

const CC: Row[] = [
  { name: "OpEx", amt: "€77k", pct: 62.0, sub: "subscriptions · seats" },
  { name: "COGS", amt: "€27k", pct: 22.0, sub: "in-product inference" },
  { name: "CapEx", amt: "€11k", pct: 9.0, sub: "edge infra" },
  { name: "R&D", amt: "€6k", pct: 5.0, sub: "capitalised experiments" },
  { name: "Other", amt: "€2k", pct: 2.0, sub: "unmapped · review queue" },
];

const UC: Row[] = [
  { name: "In-product Praxis Assistant", amt: "€31k", pct: 25.3 },
  { name: "Engineering tooling", amt: "€26k", pct: 20.6 },
  { name: "Tier-1 support automation", amt: "€21k", pct: 17.3 },
  { name: "Sales outreach + notes", amt: "€16k", pct: 13.1 },
  { name: "AP reconciliation", amt: "€11k", pct: 8.6 },
  { name: "Knowledge / Notion AI", amt: "€8k", pct: 6.7 },
  { name: "CRM (Einstein)", amt: "€7k", pct: 5.8 },
  { name: "Other", amt: "€3k", pct: 2.6 },
];

// periwinkle sequential ramp, brightest = largest
const RAMP = ["#B4B1F6", "#A5A2F3", "#918EF0", "#7D7AEC", "#6E6AE0", "#5E5BC8", "#4F4DAB", "#43428A"];

function Breakdown({ rows }: { rows: Row[] }) {
  const max = Math.max(...rows.map((r) => r.pct));
  return (
    <div className="ab">
      <div className="ab-top">
        <span className="ab-total">€124k · 30 days</span>
        <span className="ab-cap">share of spend</span>
      </div>
      <div className="ab-list">
        {rows.map((r, i) => (
          <div className="ab-row" key={i}>
            <div className="ab-lab">
              <span className="ab-name">{r.name}</span>
              {r.sub && <span className="ab-sub">{r.sub}</span>}
            </div>
            <div className="ab-bar-col">
              <div
                className="ab-bar"
                style={{ width: `${(r.pct / max) * 100}%`, background: RAMP[Math.min(i, RAMP.length - 1)] }}
              />
            </div>
            <div className="ab-val">
              <span className="ab-amt">{r.amt}</span>
              <span className="ab-pct">{r.pct.toFixed(1)}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const VIEWS = [
  { id: "business unit", render: () => <Breakdown rows={BU} /> },
  { id: "cost center", render: () => <Breakdown rows={CC} /> },
  { id: "use case", render: () => <Breakdown rows={UC} /> },
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
