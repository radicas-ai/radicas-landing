// Ported verbatim from the original landing (vendors.jsx) — Vendors instrument.
type Trend = "up" | "down" | "flat" | "spike";

function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function Spark({ seed, trend }: { seed: number; trend: Trend }) {
  const r = mulberry32(seed);
  const n = 13,
    w = 56,
    h = 18;
  let p = 0.5;
  const ys: number[] = [];
  for (let i = 0; i < n; i++) {
    const d = trend === "up" ? 0.045 : trend === "down" ? -0.04 : 0;
    p = Math.max(0.12, Math.min(0.88, p + (r() - 0.5) * 0.3 + d));
    ys.push(p);
  }
  if (trend === "spike") {
    ys[n - 3] = 0.85;
    ys[n - 2] = 0.55;
  }
  const pts = ys.map((y, i) => `${(i / (n - 1)) * w},${h - y * h}`).join(" ");
  const color =
    trend === "up" || trend === "spike"
      ? "var(--accent-orange)"
      : trend === "down"
        ? "var(--semantic-allow)"
        : "var(--carbon-400)";
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ display: "block" }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.3" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

interface Row {
  sym: string;
  bg: string;
  name: string;
  sub: string;
  price: string;
  pc: string;
  spend: string;
  trend: Trend;
  commit: number;
  renew: string;
  open?: boolean;
}

const GROUPS: { cat: string; rows: Row[] }[] = [
  {
    cat: "LLM Providers",
    rows: [
      { sym: "O", bg: "#10A37F", name: "OpenAI", sub: "COGS", price: "token", pc: "token", spend: "€42,180", trend: "spike", commit: 56, renew: "2026-09-15" },
      { sym: "A", bg: "#C8794A", name: "Anthropic", sub: "Mixed", price: "token", pc: "token", spend: "€28,940", trend: "up", commit: 49, renew: "2026-11-15" },
      { sym: "OR", bg: "#7C5CFF", name: "OpenRouter", sub: "OpEx", price: "credit", pc: "credit", spend: "€1,840", trend: "flat", commit: 46, renew: "prepaid", open: true },
    ],
  },
  {
    cat: "Enterprise AI SaaS",
    rows: [
      { sym: "MS", bg: "#2B6FD6", name: "Microsoft 365 + Copilot", sub: "OpEx · 320 seats", price: "per-seat", pc: "perseat", spend: "€18,400", trend: "flat", commit: 44, renew: "2026-06-30" },
      { sym: "CE", bg: "#1B2230", name: "ChatGPT Enterprise", sub: "OpEx · 300 seats", price: "per-seat", pc: "perseat", spend: "€18,000", trend: "up", commit: 50, renew: "2027-02-15" },
      { sym: "NO", bg: "#15171A", name: "Notion AI", sub: "OpEx · 480 seats", price: "bundled", pc: "bundled", spend: "€4,800", trend: "up", commit: 0, renew: "2026-10-15", open: true },
      { sym: "SF", bg: "#2E9BE0", name: "Salesforce Einstein", sub: "OpEx", price: "bundled", pc: "bundled", spend: "€4,200", trend: "flat", commit: 0, renew: "2027-03-30", open: true },
    ],
  },
  {
    cat: "Dev AI Services",
    rows: [
      { sym: "CR", bg: "#1B2230", name: "Cursor", sub: "OpEx · 60 seats", price: "hybrid", pc: "hybrid", spend: "€5,200", trend: "up", commit: 0, renew: "open", open: true },
      { sym: "GH", bg: "#15171A", name: "GitHub Copilot Business", sub: "OpEx · 120 seats", price: "per-seat", pc: "perseat", spend: "€4,560", trend: "up", commit: 50, renew: "2026-12-15" },
      { sym: "VR", bg: "#0B0B0B", name: "Vercel", sub: "COGS", price: "consumption", pc: "consumption", spend: "€2,840", trend: "up", commit: 47, renew: "2026-09-05" },
      { sym: "GR", bg: "#1F9E6B", name: "Granola", sub: "OpEx · 80 seats", price: "per-seat", pc: "perseat", spend: "€1,280", trend: "up", commit: 50, renew: "2026-07-01" },
    ],
  },
  {
    cat: "Agentic AI Services",
    rows: [
      { sym: "PC", bg: "#3B5BDB", name: "Pinecone", sub: "COGS", price: "consumption", pc: "consumption", spend: "€3,640", trend: "up", commit: 45, renew: "2026-10-20" },
    ],
  },
];

export function VendorsVisual() {
  return (
    <div className="pv">
      <div className="pv-bar">
        <span className="pv-dots">
          <i></i>
          <i></i>
          <i></i>
        </span>
        <span className="pv-title">vendors</span>
        <span className="pv-live">
          <span className="led"></span>near real-time
        </span>
      </div>
      <div className="pv-statline">
        <span>
          <b>12</b> active vendors
        </span>
        <span className="sep">·</span>
        <span>
          <b>€124k</b> monthly spend
        </span>
        <span className="sep">·</span>
        <span>
          <b>3</b> contracts <span className="mut">maturing in 90 days</span>
        </span>
      </div>
      <div className="vt-toolbar">
        <span className="vt-search">⌕ search vendors</span>
        <span className="vt-filter">
          pricing <b>all</b> ⌄
        </span>
        <span className="vt-filter">
          renewal <b>any</b> ⌄
        </span>
        <span className="vt-add">+ add vendor</span>
      </div>
      <div className="vt-colhead">
        <div className="vt-grid">
          <span>vendor</span>
          <span>pricing</span>
          <span style={{ textAlign: "right" }}>30d spend ▾</span>
          <span>90d</span>
          <span>committed</span>
          <span>renewal</span>
        </div>
      </div>
      <div className="vt-scroll">
        {GROUPS.map((g, gi) => (
          <div key={gi}>
            <div className="vt-group">
              {g.cat}
              <span className="n">{g.rows.length}</span>
            </div>
            {g.rows.map((v, i) => (
              <div className="vt-row" key={i}>
                <div className="vt-grid">
                  <span className="vt-name">
                    <span className="pv-vicon" style={{ background: v.bg, color: "#fff", border: "none" }}>
                      {v.sym}
                    </span>
                    <span className="vt-nameTxt">
                      <span className="nm">{v.name}</span>
                      <span className="sub">{v.sub}</span>
                    </span>
                  </span>
                  <span className={"pchip " + v.pc}>{v.price}</span>
                  <span className="vt-spend">{v.spend}</span>
                  <Spark seed={gi * 40 + i * 7 + 3} trend={v.trend} />
                  {v.open ? (
                    <span className="commit open">
                      <span className="commit-pct" style={{ minWidth: 0 }}>
                        open
                      </span>
                    </span>
                  ) : (
                    <span className="commit">
                      <span className="commit-track">
                        <span className="commit-fill" style={{ width: v.commit + "%" }}></span>
                      </span>
                      <span className="commit-pct">{v.commit}%</span>
                    </span>
                  )}
                  <span className={"vt-renew" + (v.renew === "open" || v.renew === "prepaid" ? " open" : "")}>
                    {v.renew}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
