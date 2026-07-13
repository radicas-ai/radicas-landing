"use client";

// "What Radicas enables" — Discover / Measure / Attribute / Optimize.
// Ported from the radicas_1 export; each pillar has a small SVG data-viz that
// reveals on scroll.
import { useReveal } from "./useReveal";

function DiscoverViz() {
  return (
    <svg className="ev" viewBox="0 0 200 64" fill="none" aria-hidden="true">
      <g stroke="var(--border-strong)" strokeWidth="1.4">
        <circle cx="18" cy="20" r="5" /><circle cx="52" cy="20" r="5" /><circle cx="86" cy="20" r="5" />
        <circle cx="120" cy="20" r="5" /><circle cx="154" cy="20" r="5" />
        <circle cx="35" cy="44" r="5" /><circle cx="69" cy="44" r="5" /><circle cx="103" cy="44" r="5" />
        <circle cx="137" cy="44" r="5" /><circle cx="171" cy="44" r="5" />
      </g>
      <g>
        <circle cx="52" cy="20" r="5" fill="var(--brand-primary)" stroke="none" />
        <circle cx="120" cy="20" r="5" fill="var(--brand-primary)" stroke="none" />
        <circle cx="69" cy="44" r="5" fill="var(--brand-primary-light)" stroke="none" />
        <circle cx="171" cy="44" r="5" fill="var(--color-accent-cyan)" stroke="none" />
      </g>
    </svg>
  );
}

function MeasureViz() {
  return (
    <svg className="ev" viewBox="0 0 200 64" fill="none" aria-hidden="true">
      <g>
        <rect x="8" y="30" width="8" height="26" rx="2" fill="var(--color-accent-cyan)" />
        <rect x="22" y="18" width="8" height="38" rx="2" fill="var(--color-accent-orange)" />
        <rect x="36" y="38" width="8" height="18" rx="2" fill="var(--brand-primary-light)" />
        <rect x="50" y="24" width="8" height="32" rx="2" fill="var(--color-semantic-allow)" />
      </g>
      <path d="M74 32 h30 m-7 -5 l7 5 l-7 5" stroke="var(--fg-subtle)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <rect x="120" y="14" width="30" height="42" rx="4" fill="var(--brand-primary)" />
      <text x="135" y="41" textAnchor="middle" fill="var(--color-carbon-050)" fontFamily="var(--font-mono)" fontSize="16" fontWeight="600">€</text>
    </svg>
  );
}

function AttributeViz() {
  return (
    <svg className="ev" viewBox="0 0 200 64" fill="none" aria-hidden="true">
      <g>
        <rect x="8" y="22" width="58" height="16" rx="3" fill="var(--brand-primary)" />
        <rect x="69" y="22" width="42" height="16" rx="3" fill="var(--color-accent-cyan)" />
        <rect x="114" y="22" width="34" height="16" rx="3" fill="var(--color-semantic-allow)" />
        <rect x="151" y="22" width="41" height="16" rx="3" fill="var(--color-semantic-review)" />
      </g>
      <g fill="var(--fg-subtle)" fontFamily="var(--font-mono)" fontSize="7">
        <circle cx="12" cy="50" r="2.2" fill="var(--brand-primary)" /><text x="18" y="52.5">bu</text>
        <circle cx="73" cy="50" r="2.2" fill="var(--color-accent-cyan)" /><text x="79" y="52.5">dept</text>
        <circle cx="118" cy="50" r="2.2" fill="var(--color-semantic-allow)" /><text x="124" y="52.5">proj</text>
        <circle cx="155" cy="50" r="2.2" fill="var(--color-semantic-review)" /><text x="161" y="52.5">use</text>
      </g>
    </svg>
  );
}

function OptimizeViz() {
  return (
    <svg className="ev" viewBox="0 0 200 64" fill="none" aria-hidden="true">
      <g>
        <rect x="10" y="16" width="9" height="40" rx="2" fill="var(--brand-primary)" />
        <rect x="26" y="24" width="9" height="32" rx="2" fill="var(--brand-primary-light)" />
        <rect className="idle" x="42" y="20" width="9" height="36" rx="2" />
        <rect x="58" y="34" width="9" height="22" rx="2" fill="var(--brand-primary-light)" />
        <rect className="idle" x="74" y="30" width="9" height="26" rx="2" />
        <rect x="90" y="42" width="9" height="14" rx="2" fill="var(--color-semantic-allow)" />
      </g>
      <path d="M12 22 C 40 30, 70 44, 96 48" stroke="var(--color-semantic-allow)" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <g transform="translate(150,20)">
        <path d="M8 0 v22 m-6 -7 l6 7 l6 -7" stroke="var(--color-semantic-allow)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <text x="20" y="16" fill="var(--color-semantic-allow)" fontFamily="var(--font-mono)" fontSize="10" fontWeight="600">-31%</text>
      </g>
    </svg>
  );
}

const PILLARS = [
  { n: "01", Viz: DiscoverViz, h: "Discover", p: "Know every AI vendor, model, subscription, and agent running across your organization." },
  { n: "02", Viz: MeasureViz, h: "Measure", p: "Normalize token-, seat-, consumption-, and credit-based pricing into a single financial view. Real spend — not estimates." },
  { n: "03", Viz: AttributeViz, h: "Attribute", p: "Allocate every AI cost to the right business unit, department, project, or use case. Every euro has an owner." },
  { n: "04", Viz: OptimizeViz, h: "Optimize", p: "Identify unused subscriptions, idle agents, expensive models, and unexpected spend before costs escalate." },
];

export function Enables() {
  const { ref, cls } = useReveal<HTMLElement>();
  return (
    <section ref={ref} className={"section tg " + cls} id="enables">
      <div className="container">
        <div className="enables-head">
          <p className="tg-eyebrow" style={{ marginBottom: 16 }}>
            <span className="dot" />
            What Radicas enables
          </p>
          <h2 className="tabs-heading">The financial confidence every organization needs to run AI.</h2>
        </div>
        <div className="tg-grid">
          {PILLARS.map(({ n, Viz, h, p }) => (
            <div className="tg-col" key={n}>
              <span className="tg-num">{n}</span>
              <div className="enable-viz">
                <Viz />
              </div>
              <h3 className="tg-h">{h}</h3>
              <p className="tg-p">{p}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
