"use client";

// Ported from the original landing (app.jsx › TheLayerDoes) — capability tabs + app frame.
import { useState } from "react";
import { VendorsVisual } from "@/components/demo/VendorsVisual";
import { AllocationVisual } from "@/components/demo/AllocationVisual";
import { AgentFleetVisual } from "@/components/demo/AgentFleetVisual";
import { PolicyVisual } from "@/components/demo/PolicyVisual";

const TABS = [
  {
    label: "vendors",
    Visual: VendorsVisual,
  },
  {
    label: "allocation",
    Visual: AllocationVisual,
  },
  {
    label: "agent fleet",
    Visual: AgentFleetVisual,
  },
  {
    label: "policy",
    Visual: PolicyVisual,
  },
];

const APP_META = [
  { title: "Vendors", live: "Live", range: "01 Oct – 31 Oct", meta: "12 vendors", icon: "home" },
  { title: "Allocation", live: "30d", range: "01 Oct – 31 Oct", meta: "5 cost centres", icon: "grid" },
  { title: "Agent fleet", live: "Live", range: "in production", meta: "6 agents", icon: "user" },
  { title: "Policy", live: "Enforcing", range: "real-time", meta: "1 policy · 3 levels", icon: "bell" },
];

const INSIGHTS = [
  {
    lead: "Found 3 things in vendor spend:",
    items: [
      { h: "OpenAI up 12% MoM", d: "token burn on the eval suite" },
      { h: "2 contracts maturing in 90d", d: "Microsoft 365 · Granola" },
      { h: "Notion AI reclassified", d: "now bundled, not per-seat" },
    ],
  },
  {
    lead: "3 allocation notes:",
    items: [
      { h: "Hamburg up 18% QoQ", d: "fastest-growing entity" },
      { h: "2% unmapped spend", d: "sitting in the review queue" },
      { h: "CapEx at 9%", d: "capitalised experiments · edge infra" },
    ],
  },
  {
    lead: "Fleet flags:",
    items: [
      { h: "Reg. Doc Extractor — null", d: "€6,800 · reported, pilot continuing" },
      { h: "Sales Outreach at 88% DAU", d: "above target · review cadence raised" },
      { h: "+€21,400 net of null", d: "after the one non-monetary result" },
    ],
  },
  {
    lead: "Policy activity:",
    items: [
      { h: "scraper-agent blocked", d: "before the provider call" },
      { h: "ops-agent needs approval", d: "88% of budget used" },
      { h: "research-agent flagged", d: "observe · alert only" },
    ],
  },
];

const ICONS: Record<string, string> = {
  home: "M3 11 12 3l9 8M5 10v10h5v-6h4v6h5V10",
  box: "M12 3 21 8v8l-9 5-9-5V8z M3 8l9 5 9-5",
  bell: "M6 9a6 6 0 0 1 12 0c0 7 3 7 3 7H3s3 0 3-7 M10 21a2 2 0 0 0 4 0",
  grid: "M3 3h8v8H3z M13 3h8v8h-8z M3 13h8v8H3z M13 13h8v8h-8z",
  user: "M4 21a8 8 0 0 1 16 0 M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8",
  doc: "M6 2h9l5 5v15H6z M14 2v6h6",
  folder: "M3 6h6l2 2h10v12H3z",
  play: "M6 3 20 12 6 21z",
  dots: "M5 12h.01M12 12h.01M19 12h.01",
};
const RAIL = ["home", "box", "bell", "grid", "user", "doc", "folder", "play", "dots"];

function Ico({ d }: { d: string }) {
  return (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d={d} />
    </svg>
  );
}

export function WhatTheLayerDoes() {
  const [active, setActive] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const select = (i: number) => {
    setActive(i);
    setAnimKey((k) => k + 1);
  };
  const tab = TABS[active]!;
  const m = APP_META[active]!;
  const ins = INSIGHTS[active]!;
  const pad = (n: number) => String(n + 1).padStart(2, "0");
  const Visual = tab.Visual;

  return (
    <section className="section section-hairline" id="what-it-does">
      <div className="container">
        <div className="tabs-head">
          <h2 className="tabs-heading">What the layer does.</h2>
          <p className="tabs-intro">Select a capability to see how it works.</p>
        </div>
        <div className="tabbar" role="tablist">
          {TABS.map((t, i) => (
            <button key={i} role="tab" aria-selected={active === i} className={"tab" + (active === i ? " active" : "")} onClick={() => select(i)}>
              <span className="tab-index">{pad(i)}</span>
              <span className="tab-label">{t.label}</span>
            </button>
          ))}
        </div>
        <div className="app-frame">
          <div className="app-rail">
            {RAIL.map((r, i) => (
              <span key={i} className={"rail-ic" + (r === m.icon ? " active" : "")}>
                <Ico d={ICONS[r]!} />
              </span>
            ))}
          </div>
          <div className="app-main">
            <div className="app-head">
              <span className="app-mark"></span>
              <span className="app-title">{m.title}</span>
              <span className="app-live">{m.live}</span>
              <span className="app-chip">{m.range}</span>
              <span className="app-chip alt">{m.meta}</span>
              <span className="app-x">✕</span>
            </div>
            <div className="app-content" key={animKey}>
              <div className="panel-anim">
                <Visual />
              </div>
            </div>
          </div>
          <aside className="app-side">
            <div className="side-search">✦&nbsp;&nbsp;Ask Alyx about this view</div>
            <div className="side-agent">✦ Alyx</div>
            <div className="side-lead">{ins.lead}</div>
            <ol className="ins" key={animKey}>
              {ins.items.map((it, i) => (
                <li key={i}>
                  <span className="ins-h">{it.h}</span>
                  <span className="ins-d">{it.d}</span>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </div>
    </section>
  );
}
