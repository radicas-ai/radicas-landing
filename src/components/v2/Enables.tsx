// "What Radicas enables" — layout 1A from the design handoff: standardized
// cards, each with a uniform media tile holding an inline SVG, plus a hover lift.
// SVG coordinates/colors are copied from the prototype; hues map to tokens.

function DiscoverViz() {
  return (
    <svg width="170" height="60" viewBox="0 0 170 60" fill="none" aria-hidden="true">
      <g stroke="var(--carbon-500)" strokeWidth="1.5">
        <circle cx="20" cy="20" r="5" /><circle cx="88" cy="20" r="5" />
        <circle cx="20" cy="42" r="5" /><circle cx="54" cy="42" r="5" /><circle cx="88" cy="42" r="5" />
      </g>
      <circle cx="54" cy="20" r="5" fill="var(--brand-primary)" />
      <circle cx="122" cy="20" r="5" fill="var(--brand-primary)" />
      <circle cx="122" cy="42" r="5" fill="var(--brand-primary-light)" />
      <circle cx="150" cy="20" r="5" fill="var(--accent-cyan)" />
    </svg>
  );
}

function MeasureViz() {
  return (
    <svg width="180" height="92" viewBox="0 0 180 92" fill="none" aria-hidden="true">
      <line x1="12" y1="54" x2="168" y2="54" stroke="#191f30" />
      <line x1="12" y1="34" x2="168" y2="34" stroke="#191f30" />
      <line x1="12" y1="74" x2="168" y2="74" stroke="var(--carbon-700)" />
      <rect x="16" y="48" width="14" height="26" rx="2" fill="var(--carbon-500)" />
      <rect x="34" y="34" width="14" height="40" rx="2" fill="var(--accent-cyan)" />
      <rect x="52" y="54" width="14" height="20" rx="2" fill="var(--carbon-500)" />
      <rect x="70" y="40" width="14" height="34" rx="2" fill="var(--accent-orange)" />
      <rect x="88" y="44" width="14" height="30" rx="2" fill="var(--carbon-500)" />
      <line x1="116" y1="20" x2="116" y2="74" stroke="var(--carbon-600)" strokeDasharray="3 3" />
      <rect x="132" y="24" width="22" height="50" rx="2" fill="var(--brand-primary)" />
    </svg>
  );
}

function AttributeViz() {
  return (
    <>
      <svg width="150" height="18" viewBox="0 0 150 18" fill="none" aria-hidden="true">
        <rect x="0" y="0" width="36" height="18" rx="4" fill="var(--brand-primary)" />
        <rect x="40" y="0" width="30" height="18" rx="4" fill="var(--accent-cyan)" />
        <rect x="74" y="0" width="40" height="18" rx="4" fill="var(--semantic-allow)" />
        <rect x="118" y="0" width="32" height="18" rx="4" fill="var(--accent-orange)" />
      </svg>
      <svg width="150" height="10" viewBox="0 0 150 10" fill="none" aria-hidden="true">
        <circle cx="8" cy="5" r="3" fill="var(--brand-primary)" /><rect x="16" y="2" width="20" height="6" rx="3" fill="var(--carbon-600)" />
        <circle cx="48" cy="5" r="3" fill="var(--accent-cyan)" /><rect x="56" y="2" width="14" height="6" rx="3" fill="var(--carbon-600)" />
        <circle cx="82" cy="5" r="3" fill="var(--semantic-allow)" /><rect x="90" y="2" width="24" height="6" rx="3" fill="var(--carbon-600)" />
        <circle cx="126" cy="5" r="3" fill="var(--accent-orange)" /><rect x="134" y="2" width="16" height="6" rx="3" fill="var(--carbon-600)" />
      </svg>
    </>
  );
}

function OptimizeViz() {
  return (
    <svg width="170" height="68" viewBox="0 0 130 52" fill="none" aria-hidden="true">
      <rect x="6" y="10" width="12" height="36" rx="2" fill="var(--brand-primary)" />
      <rect x="26" y="18" width="12" height="28" rx="2" fill="#5d5ab8" />
      <rect x="46" y="26" width="12" height="20" rx="2" fill="var(--carbon-500)" />
      <rect x="66" y="34" width="12" height="12" rx="2" fill="var(--carbon-600)" />
      <path d="M12 14 L72 40" stroke="var(--semantic-allow)" strokeWidth="1.5" />
      <circle cx="72" cy="40" r="3" fill="var(--semantic-allow)" />
    </svg>
  );
}

const CARDS = [
  { n: "01", Viz: DiscoverViz, h: "Discover", p: "Know every AI vendor, model, subscription, and agent running across your organization." },
  { n: "02", Viz: MeasureViz, h: "Measure", p: "Normalize token-, seat-, consumption-, and credit-based pricing into a single financial view. Real spend — not estimates." },
  { n: "03", Viz: AttributeViz, h: "Attribute", p: "Allocate every AI cost to the right business unit, department, project, or use case. Every euro has an owner.", stack: true },
  { n: "04", Viz: OptimizeViz, h: "Optimize", p: "Identify unused subscriptions, idle agents, expensive models, and unexpected spend before costs escalate." },
];

export function Enables() {
  return (
    <section className="section tg" id="enables">
      <div className="container">
        <div className="enables-head">
          <p className="tg-eyebrow" style={{ marginBottom: 22 }}>
            <span className="dot" />
            What Radicas enables
          </p>
          <h2 className="tabs-heading">The financial confidence every organization needs to run AI.</h2>
        </div>
        <div className="en-grid">
          {CARDS.map(({ n, Viz, h, p, stack }) => (
            <article className="en-card" key={n}>
              <div className={"en-media" + (stack ? " stack" : "")}>
                <Viz />
              </div>
              <span className="en-index">{n}</span>
              <h3 className="en-h">{h}</h3>
              <p className="en-p">{p}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
