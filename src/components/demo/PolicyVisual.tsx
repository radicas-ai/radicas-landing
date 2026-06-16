// Ported verbatim from the original landing (policy.jsx) — three enforcement levels + decision feed.
const LEVELS = [
  { h: "see & flag", d: "observe · alert", led: "var(--semantic-info)" },
  { h: "require approval", d: "human in loop", led: "var(--semantic-review)" },
  { h: "block", d: "stop before spend", led: "var(--semantic-deny)" },
];

const DECISIONS = [
  { name: "billing-agent", prov: "openai", used: 38, state: "allowed", cls: "lvl-allow", led: "var(--semantic-allow)", bcolor: "var(--semantic-allow)" },
  { name: "research-agent", prov: "anthropic", used: 71, state: "flagged", cls: "lvl-info", led: "var(--semantic-info)", bcolor: "var(--semantic-info)" },
  { name: "ops-agent", prov: "bedrock", used: 88, state: "approval", cls: "lvl-review", led: "var(--semantic-review)", bcolor: "var(--semantic-warning)" },
  { name: "scraper-agent", prov: "openai", used: 100, state: "blocked", cls: "lvl-deny", led: "var(--semantic-deny)", bcolor: "var(--semantic-deny)" },
];

export function PolicyVisual() {
  return (
    <div className="pv">
      <div className="pv-bar">
        <span className="pv-dots">
          <i></i>
          <i></i>
          <i></i>
        </span>
        <span className="pv-title">policy-engine</span>
        <span className="pv-live">
          <span className="led"></span>enforcing
        </span>
      </div>
      <div className="pv-statline" style={{ display: "block" }}>
        <b>1 policy</b>, three levels · every agent gets an <b>identity</b> and a <b>budget</b>, across
        every provider
      </div>
      <div className="pv-body">
        <div className="policy-levels">
          {LEVELS.map((l, i) => (
            <div className="plevel" key={i}>
              <div className="pl-h">
                <span style={{ width: 7, height: 7, borderRadius: "50%", background: l.led, display: "inline-block" }}></span>
                {l.h}
              </div>
              <div className="pl-d">{l.d}</div>
            </div>
          ))}
        </div>
        <div className="policy-feed">
          {DECISIONS.map((a, i) => (
            <div className="policy-item" key={i}>
              <span className="policy-led" style={{ background: a.led, boxShadow: `0 0 8px ${a.led}` }}></span>
              <span>
                <span className="policy-agent">
                  {a.name} <span className="prov">· {a.prov}</span>
                </span>
                <span className="budget" style={{ marginTop: 6 }}>
                  <span className="budget-track">
                    <span className="budget-fill" style={{ width: a.used + "%", background: a.bcolor }}></span>
                  </span>
                  <span className="pv-sub" style={{ minWidth: 30, textAlign: "right" }}>
                    {a.used}%
                  </span>
                </span>
              </span>
              <span className={"policy-state " + a.cls}>{a.state}</span>
            </div>
          ))}
        </div>
        <div className="pv-sub" style={{ marginTop: 12, color: "var(--semantic-deny)" }}>
          ● scraper-agent — next call blocked at the provider before the money is spent
        </div>
      </div>
    </div>
  );
}
