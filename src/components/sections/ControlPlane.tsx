// Runtime control-plane visual — ported from the standalone artifact.
// Tools and agents run "above", every call is intercepted by the Radicas layer,
// then lands "below" as an observed, attributed, governed event.
import { Mark } from "@/components/ui/Mark";

const SOURCES = [
  { label: "openai.gpt-4o", color: "var(--color-accent-cyan)" },
  { label: "anthropic.claude", color: "var(--color-accent-orange)" },
  { label: "agent.support-bot", color: "var(--color-brand-primary-light)" },
  { label: "agent.research", color: "var(--color-brand-primary-light)" },
  { label: "cursor.compose", color: "var(--color-semantic-allow)" },
];

// left %, color, duration, delay
const DROPS = [
  { left: "10%", color: "var(--color-brand-primary)", dur: "2.6s", delay: "0s" },
  { left: "27%", color: "var(--color-accent-cyan)", dur: "3.1s", delay: ".5s" },
  { left: "44%", color: "var(--color-brand-primary)", dur: "2.3s", delay: "1s" },
  { left: "62%", color: "var(--color-brand-primary-light)", dur: "2.9s", delay: ".3s" },
  { left: "80%", color: "var(--color-brand-primary)", dur: "3.4s", delay: "1.4s" },
  { left: "91%", color: "var(--color-accent-cyan)", dur: "2.5s", delay: ".8s" },
];

type Verdict = "ALLOW" | "REVIEW" | "DENY";
const VERDICT_COLOR: Record<Verdict, string> = {
  ALLOW: "var(--color-semantic-allow)",
  REVIEW: "var(--color-semantic-review)",
  DENY: "var(--color-semantic-deny)",
};

type FeedRow = { t: string; src: string; op: string; verdict: Verdict; tail: string };
const FEED: FeedRow[] = [
  { t: "14:08:31Z", src: "agent.support-bot", op: "tools.exec(db.query)", verdict: "DENY", tail: "R-184" },
  { t: "14:08:30Z", src: "anthropic.claude", op: "chat.completion", verdict: "ALLOW", tail: "€0.38" },
  { t: "14:08:28Z", src: "agent.research", op: "web.fetch", verdict: "REVIEW", tail: "R-092" },
  { t: "14:08:27Z", src: "openai.gpt-4o", op: "chat.completion", verdict: "ALLOW", tail: "€0.42" },
  { t: "14:08:25Z", src: "cursor.compose", op: "code.edit", verdict: "ALLOW", tail: "€0.11" },
  { t: "14:08:23Z", src: "agent.finance-bot", op: "tools.exec(export)", verdict: "DENY", tail: "R-211" },
  { t: "14:08:22Z", src: "copilot.chat", op: "chat.completion", verdict: "ALLOW", tail: "€0.07" },
  { t: "14:08:20Z", src: "pinecone.query", op: "vector.search", verdict: "ALLOW", tail: "€0.02" },
];

function FeedRows() {
  return (
    <>
      {FEED.map((r, i) => (
        <div className="cp-feed-row" key={i}>
          <span className="t">{r.t}</span>
          <span className="src">{r.src}</span>
          <span className="op">{r.op}</span>
          <span className="verdict" style={{ color: VERDICT_COLOR[r.verdict] }}>
            {r.verdict}
          </span>
          <span className={r.tail.startsWith("€") ? "cost" : "ref"}>{r.tail}</span>
        </div>
      ))}
    </>
  );
}

export function ControlPlane() {
  return (
    <section id="control-plane" className="section section-hairline">
      <div className="container">
        <div className="tabs-head">
          <h2 className="tabs-heading">One layer beneath every call.</h2>
          <p className="tabs-intro">
            Every model, tool, and agent runs through Radicas — intercepted, costed, and governed in
            real time.
          </p>
        </div>

        <div className="cp-panel">
          {/* chrome */}
          <div className="cp-chrome">
            <span className="cp-chrome-id">
              <Mark className="h-4 w-4 text-brand-primary-light" />
              runtime.control-plane
            </span>
            <span className="cp-live">
              <span className="dot" />
              live · 1,284 calls/min
            </span>
          </div>

          <div className="cp-body">
            {/* ABOVE — sources */}
            <div className="cp-rowhead">
              <span>above — what&apos;s running</span>
              <span>12 vendors · 15 agents</span>
            </div>
            <div className="cp-sources">
              {SOURCES.map((s) => (
                <span className="cp-chip" key={s.label}>
                  <span className="sq" style={{ background: s.color }} />
                  {s.label}
                </span>
              ))}
              <span className="cp-chip more">+ 9 more</span>
            </div>

            {/* connector — falling calls */}
            <div className="cp-connector" aria-hidden="true">
              <span className="lines" />
              {DROPS.map((d, i) => (
                <span
                  className="drop"
                  key={i}
                  style={{
                    left: d.left,
                    background: d.color,
                    boxShadow: `0 0 12px ${d.color}`,
                    animationDuration: d.dur,
                    animationDelay: d.delay,
                  }}
                />
              ))}
            </div>

            {/* THE PLANE */}
            <div className="cp-plane">
              <span className="wash" />
              <span className="cp-plane-id">
                <Mark className="cp-plane-mark h-[22px] w-[22px]" />
                <span style={{ display: "flex", flexDirection: "column" }}>
                  <span className="cp-plane-name">RADICAS</span>
                  <span className="cp-plane-sub">runtime control plane</span>
                </span>
              </span>
              <span className="cp-plane-stats">
                <span>
                  <b>100%</b> intercepted
                </span>
                <span>
                  <b>3.2k</b> policy checks/min
                </span>
                <span>
                  <b>8 ms</b> p50 added
                </span>
              </span>
            </div>

            {/* BELOW — governed feed */}
            <div style={{ marginTop: 18 }}>
              <div className="cp-rowhead">
                <span>below — observed, attributed, governed</span>
                <span className="cp-feed-meta">
                  <span style={{ color: "var(--color-semantic-allow)" }}>847 allow</span> ·{" "}
                  <span style={{ color: "var(--color-semantic-review)" }}>31 review</span> ·{" "}
                  <span style={{ color: "var(--color-semantic-deny)" }}>12 deny</span> / hr
                </span>
              </div>
              <div className="cp-feed-window">
                <div className="cp-feed-track">
                  {/* duplicated for a seamless loop */}
                  <FeedRows />
                  <FeedRows />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
