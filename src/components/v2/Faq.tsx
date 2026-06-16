"use client";

// Proposal 2 — FAQ accordion. Sentence case, periwinkle active marker,
// ease-out expand, full keyboard + ARIA.
import { useId, useState } from "react";

const FAQ: { q: string; a: string }[] = [
  {
    q: "What is the runtime control plane?",
    a: "A layer that sits beneath every model, tool, and agent your company runs — seeing each call in real time, attributing its cost, and applying policy before it executes.",
  },
  {
    q: "How is this different from a FinOps dashboard?",
    a: "A dashboard reports yesterday's spend. Radicas operates at runtime: it intercepts calls as they happen, so it can attribute cost live and enforce policy, not just chart it after the fact.",
  },
  {
    q: "How does Radicas see agent and MCP traffic?",
    a: "Agents and tools connect over MCP and standard provider APIs. Radicas observes that traffic directly, so autonomous agents are costed and governed the same way human-driven calls are.",
  },
  {
    q: "Is it EU-hosted?",
    a: "Yes. Radicas is EU-native — your AI traffic, ledger, and audit trail are processed and stored in the EU.",
  },
  {
    q: "Does it enforce policy or only observe?",
    a: "Both. Start in shadow mode to observe and attribute without changing behaviour, then turn on enforcement — allow, review, or deny — per rule when you're ready.",
  },
  {
    q: "How does it connect to our stack?",
    a: "Through the LLMs you already use, MCP for agents, and workspace integrations like Slack and Teams. No rip-and-replace; it slots beneath what you run today.",
  },
  {
    q: "What does it cost?",
    a: "Pricing scales with the spend you put under management. Book a working session and we'll size it against your actual stack.",
  },
  {
    q: "Do you store our prompts and data?",
    a: "We capture the metadata needed to cost and govern calls. Prompt and payload retention is configurable, and everything stays in the EU under your DPA.",
  },
];

function Row({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  const id = useId();
  return (
    <div className="border-b border-border">
      <h3>
        <button
          type="button"
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          id={`${id}-btn`}
          onClick={() => setOpen((o) => !o)}
          className="flex w-full items-center gap-4 py-5 text-left transition-colors hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary-light"
        >
          <span
            aria-hidden="true"
            className={
              "grid h-5 w-5 shrink-0 place-items-center text-brand-primary transition-transform duration-200 ease-out " +
              (open ? "rotate-45" : "")
            }
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M12 5v14 M5 12h14" />
            </svg>
          </span>
          <span className="text-md font-medium text-fg">{q}</span>
        </button>
      </h3>
      <div
        id={`${id}-panel`}
        role="region"
        aria-labelledby={`${id}-btn`}
        className="grid transition-all duration-200 ease-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <p className="max-w-2xl pb-5 pl-9 text-sm text-fg-muted">{a}</p>
        </div>
      </div>
    </div>
  );
}

export function Faq() {
  return (
    <section id="faq" className="section section-hairline">
      <div className="container">
        <div className="tabs-head">
          <span className="eyebrow text-fg-subtle">faq</span>
          <h2 className="tabs-heading" style={{ marginTop: 16 }}>
            Questions, answered precisely.
          </h2>
        </div>
        <div className="mx-auto max-w-3xl border-t border-border">
          {FAQ.map((f) => (
            <Row key={f.q} {...f} />
          ))}
        </div>
      </div>
    </section>
  );
}
