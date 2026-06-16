// Ported verbatim from the original landing (fleet.jsx) — Agent fleet, the financial view.
const PROV: Record<string, { t: string; bg: string; label: string }> = {
  openai: { t: "O", bg: "#10A37F", label: "OpenAI" },
  pinecone: { t: "P", bg: "#3B5BDB", label: "Pinecone" },
  guidewire: { t: "GW", bg: "#C25E1B", label: "Guidewire" },
  aleph: { t: "AA", bg: "#C0392B", label: "Aleph Alpha" },
  anthropic: { t: "A", bg: "#C8794A", label: "Anthropic" },
  salesforce: { t: "SF", bg: "#2E9BE0", label: "Salesforce" },
};

function Chips({ ids }: { ids: string[] }) {
  return (
    <div className="prov-chips">
      {ids.map((id, i) => {
        const p = PROV[id]!;
        return (
          <span className="prov" key={i}>
            <span className="mono-tile" style={{ background: p.bg }}>
              {p.t}
            </span>
            {p.label}
          </span>
        );
      })}
    </div>
  );
}

interface Agent {
  name: string;
  role: string;
  risk: string;
  border: string;
  featured?: boolean;
  cost: string;
  costSub: string;
  margin: string;
  neg?: boolean;
  mTag: [string, string];
  marginSub?: string;
  dau: string;
  dauSub: string;
  exc: string;
  prov: string[];
}

const AGENTS: Agent[] = [
  { name: "Claims Triage Agent", role: "Group Claims Lead", risk: "high", border: "#FF3B5C", cost: "€4,200", costSub: "50.4k annualised", margin: "+€11,200", mTag: ["measured", "MEASURED"], dau: "23%", dauSub: "intentional low — <b>pilot mode</b>, human-in-loop", exc: "2", prov: ["openai", "pinecone", "guidewire"] },
  { name: "Customer Service Knowledge Agent", role: "Head of CS", risk: "limited", border: "#FF6A1A", cost: "€5,100", costSub: "61.2k annualised", margin: "+€13,400", mTag: ["measured", "MEASURED"], dau: "67%", dauSub: "target <b>70%</b>", exc: "14", prov: ["openai", "aleph"] },
  { name: "Underwriting Pricing Assistant", role: "Head of Underwriting", risk: "high", border: "#7571EB", featured: true, cost: "€4,000", costSub: "48.0k annualised", margin: "+€9,000", mTag: ["measured", "MEASURED"], dau: "54%", dauSub: "on track · approval-required > <b>€25k</b>", exc: "5", prov: ["anthropic", "pinecone", "guidewire"] },
  { name: "Sales Outreach Agent", role: "Head of Sales", risk: "limited", border: "#FF6A1A", cost: "€1,000", costSub: "12.0k annualised", margin: "+€3,300", mTag: ["estimated", "ESTIMATED"], dau: "88%", dauSub: "above target · <b>review cadence raised</b>", exc: "9", prov: ["openai", "salesforce"] },
  { name: "Regulatory Documentation Extractor", role: "Head of Regulatory Reporting", risk: "limited", border: "#FF3B5C", cost: "€6,800", costSub: "81.6k annualised", margin: "−€6,800", neg: true, mTag: ["null", "null result · pilot continuing"], dau: "0%", dauSub: "paused · reported", exc: "1", prov: ["openai"] },
  { name: "Fraud Detection (augmented)", role: "Head of Claims Fraud", risk: "high", border: "#00C896", cost: "€3,400", costSub: "40.8k annualised", margin: "+€15,800", mTag: ["measured", "MEASURED"], marginSub: "non-monetary loss avoided", dau: "71%", dauSub: "on track", exc: "3", prov: ["openai", "anthropic"] },
];

export function AgentFleetVisual() {
  return (
    <div className="pv">
      <div className="pv-bar">
        <span className="pv-dots">
          <i></i>
          <i></i>
          <i></i>
        </span>
        <span className="pv-title">agent-fleet</span>
        <span className="pv-live">
          <span className="led"></span>in production
        </span>
      </div>
      <div className="pv-statline" style={{ display: "block" }}>
        <b>6</b> agents · <b>€24,500</b> monthly cost ·{" "}
        <b style={{ color: "var(--semantic-allow)" }}>+€21,400</b> net margin{" "}
        <span className="mut">after the null result</span>
      </div>
      <div className="pv-body" style={{ padding: "14px 16px" }}>
        <div className="fleet-stats">
          <div className="fleet-stat">
            <div className="k">total monthly cost</div>
            <div className="v">€24,500</div>
            <div className="sub">€294k annualised · 6 agents</div>
          </div>
          <div className="fleet-stat">
            <div className="k">total margin contribution</div>
            <div className="v pos">+€45,900</div>
            <div className="tags">
              <span className="mtag measured">3 measured</span>
              <span className="mtag estimated">1 estimated</span>
            </div>
          </div>
          <div className="fleet-stat">
            <div className="k">
              net of null result <span className="lnk">· methodology</span>
            </div>
            <div className="v pos">+€21,400</div>
            <div className="sub">excludes 1 null · 1 non-monetary</div>
          </div>
        </div>
        <div className="fleet-grid">
          {AGENTS.map((a, i) => (
            <div className="acard" key={i} style={{ borderTopColor: a.border }}>
              <div className="acard-head">
                <span>
                  <span className="nm">{a.name}</span>
                  <span className="role">{a.role}</span>
                </span>
                <span className="acard-badges">
                  {a.featured && <span className="feat">featured</span>}
                  <span className={"risk " + a.risk}>
                    {a.risk === "high" ? "high-risk · annex iii" : "limited-risk"}
                  </span>
                </span>
              </div>
              <div className="acard-grid">
                <div className="ametric">
                  <div className="k">cost / month</div>
                  <div className="v">{a.cost}</div>
                  <div className="sub">{a.costSub}</div>
                </div>
                <div className="ametric">
                  <div className="k">margin contribution</div>
                  <div className={"v " + (a.neg ? "neg" : "pos")}>{a.margin}</div>
                  <span className={"mtag " + a.mTag[0]}>{a.mTag[1]}</span>
                  {a.marginSub && <div className="sub">{a.marginSub}</div>}
                </div>
                <div className="ametric">
                  <div className="k">delegated authority</div>
                  <div className="v">{a.dau}</div>
                  <div className="sub" dangerouslySetInnerHTML={{ __html: a.dauSub }}></div>
                </div>
                <div className="ametric">
                  <div className="k">open exceptions</div>
                  <div className="v">{a.exc}</div>
                  <Chips ids={a.prov} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
