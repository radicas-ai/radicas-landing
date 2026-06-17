"use client";

// Ported from the original landing (mobilesim.jsx) — animated mobile chat, looping 3-turn flow:
// allocation (donut) → cost nature (stacked bar) → anomaly root-causes (bars + fixes).
import { useEffect, useRef, useState } from "react";

interface Seg {
  v: number;
  c: string;
  l: string;
}

function Donut({ play }: { play: boolean }) {
  const SEGS: Seg[] = [
    { v: 18400, c: "#378ADD", l: "Customer Support" },
    { v: 14200, c: "#2E7D5B", l: "Product" },
    { v: 6800, c: "#E8A04A", l: "Sales & Marketing" },
    { v: 5100, c: "#9B6FB0", l: "Finance & Ops" },
    { v: 3700, c: "#C9B98E", l: "Engineering" },
  ];
  const total = SEGS.reduce((s, x) => s + x.v, 0);
  const r = 46,
    C = 2 * Math.PI * r;
  let acc = 0;
  return (
    <div className="sim-donut-wrap">
      <svg viewBox="0 0 120 120" className={"sim-donut" + (play ? " play" : "")}>
        {SEGS.map((s, i) => {
          const f = s.v / total,
            off = -acc * C;
          acc += f;
          return (
            <circle key={i} cx="60" cy="60" r={r} fill="none" stroke={s.c} strokeWidth="15" strokeDasharray={`${f * C} ${C}`} strokeDashoffset={off} transform="rotate(-90 60 60)" />
          );
        })}
        <text x="60" y="56" textAnchor="middle" fill="var(--fg)" fontFamily="var(--font-display)" fontSize="15" fontWeight="600">
          €48.2k
        </text>
        <text x="60" y="70" textAnchor="middle" fill="var(--fg-subtle)" fontFamily="var(--font-mono)" fontSize="7" letterSpacing="0.05em">
          per month
        </text>
      </svg>
      <div className="sim-keys">
        {SEGS.map((s, i) => (
          <div className="sim-key" key={i}>
            <span className="sw" style={{ background: s.c }}></span>
            <span className="kl">{s.l}</span>
            <span className="kv">{Math.round((s.v / total) * 100)}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function Stack({ play }: { play: boolean }) {
  const S: Seg[] = [
    { v: 25000, c: "#2E7D5B", l: "Product / COGS" },
    { v: 17400, c: "#378ADD", l: "Productivity" },
    { v: 5800, c: "#D85A30", l: "Anomalies" },
  ];
  const total = S.reduce((a, x) => a + x.v, 0);
  return (
    <div>
      <div className="sim-stack">
        {S.map((s, i) => (
          <div key={i} className="sim-stack-seg" style={{ width: (play ? (s.v / total) * 100 : 0) + "%", background: s.c, transitionDelay: i * 120 + "ms" }} />
        ))}
      </div>
      <div className="sim-legend">
        {S.map((s, i) => (
          <span key={i}>
            <i style={{ background: s.c }}></i>
            {s.l}
          </span>
        ))}
      </div>
    </div>
  );
}

const CAUSES = [
  { t: "Agent loops", cost: "€2,400", pct: "41%", v: 2400, c: "#D8463A", fix: "Runaway recursion where an agent re-calls itself. Adding max-step limits and loop detection." },
  { t: "Over-powered model", cost: "€1,650", pct: "28%", v: 1650, c: "#D85A30", fix: "Premium models on trivial tasks. Routing simple calls to cheaper models." },
  { t: "Excessive retries", cost: "€1,100", pct: "19%", v: 1100, c: "#E8A04A", fix: "Failed calls retried too aggressively. Tuning backoff and capping retries." },
  { t: "Other / misc", cost: "€650", pct: "11%", v: 650, c: "#C9B98E", fix: "Dev keys hitting prod, oversized context. Hard budget caps per key + alerts." },
];
function CauseBars({ play }: { play: boolean }) {
  const max = 2400;
  return (
    <div className="sim-causebars">
      {CAUSES.map((c, i) => (
        <div className="sim-cbar" key={i}>
          <span className="cb-l">{c.t}</span>
          <span className="cb-track">
            <span className="cb-fill" style={{ width: (play ? (c.v / max) * 100 : 0) + "%", background: c.c, transitionDelay: i * 110 + "ms" }}></span>
          </span>
          <span className="cb-v">{c.cost}</span>
        </div>
      ))}
    </div>
  );
}

interface Kpi {
  k: string;
  v: string;
  s: string;
  warn?: boolean;
}
function Kpi3({ items }: { items: Kpi[] }) {
  return (
    <div className="sim-kpi3">
      {items.map((k, i) => (
        <div className="sim-kpi" key={i}>
          <div className="k">{k.k}</div>
          <div className={"v " + (k.warn ? "bad" : "")}>{k.v}</div>
          <div className="s">{k.s}</div>
        </div>
      ))}
    </div>
  );
}

const DELAYS = [800, 1100, 1300, 1600, 2400, 900, 1100, 1300, 1600, 2400, 900, 1100, 1700, 5200];
const LAST = 13;
const KPI1: Kpi[] = [
  { k: "Total agentic AI / mo", v: "€48,200", s: "15 agents · 5 functions" },
  { k: "Largest area", v: "€18,400", s: "Customer Support — 38%" },
  { k: "Active agents", v: "15", s: "across 5 functions" },
];
const KPI2: Kpi[] = [
  { k: "Product (COGS)", v: "€25,000", s: "52% · revenue-bearing" },
  { k: "Productivity", v: "€17,400", s: "36% · internal automation" },
  { k: "Anomalies / spikes", v: "€5,800", s: "12% · waste", warn: true },
];

const Typing = () => (
  <div className="typing">
    <i></i>
    <i></i>
    <i></i>
  </div>
);

export function PhoneChat({ theme = "carbon" }: { theme?: "carbon" | "purple" }) {
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
  const scroll = useRef<HTMLDivElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const reduce = useRef(false);

  // Start (and loop) only while the phone is on screen; show everything at once if reduced-motion.
  useEffect(() => {
    reduce.current =
      typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const el = wrap.current;
    if (!el) return;
    if (reduce.current) {
      setStep(LAST);
      return;
    }
    const io = new IntersectionObserver((es) => es.forEach((e) => setRunning(e.isIntersecting)), {
      threshold: 0.25,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!running || reduce.current) return;
    const d = DELAYS[step] || 1400;
    const t = setTimeout(() => setStep((s) => (s >= LAST ? 0 : s + 1)), d);
    return () => clearTimeout(t);
  }, [step, running]);

  useEffect(() => {
    const el = scroll.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [step]);

  const show = (n: number) => step >= n;

  return (
    <div ref={wrap} className={"phone" + (theme === "purple" ? " phone-purple" : "")}>
      <div className="phone-screen">
        <div className="sim-status">
          <span>9:41</span>
          <span className="sim-status-r">
            <i></i>
            <i></i>
            <b></b>
          </span>
        </div>
        <div className="chat-head">
          <span className="ch-menu">☰</span>
          <span className="ch-title">
            Radicas <span className="ch-cv">▾</span>
          </span>
          <span className="ch-share">↗</span>
        </div>
        <div className="chat-scroll" ref={scroll}>
          {show(0) && (
            <div className="msg-in u-row">
              <div className="u-bubble">
                How much are we spending on agentic AI across the company? Give me a high-level overview
                of how it&apos;s allocated.
              </div>
            </div>
          )}
          {step === 1 && <Typing />}
          {show(2) && (
            <div className="msg-in a-block">
              <span className="a-who">Radicas</span>
              <Kpi3 items={KPI1} />
            </div>
          )}
          {show(3) && (
            <div className="msg-in sim-chart-card">
              <Donut play={step >= 3} />
            </div>
          )}
          {show(4) && (
            <div className="msg-in a-block">
              <p className="a-text">
                We&apos;re running <b>€48.2k/month</b> on agentic AI across five functions.{" "}
                <b>Customer Support</b> and <b>Product</b> are ~70%; the rest is Sales, Finance/Ops and
                internal tooling.
              </p>
              <p className="a-text dim">
                Want me to break it down by <i>why</i> — by cost type rather than team?
              </p>
            </div>
          )}

          {show(5) && (
            <div className="msg-in u-row">
              <div className="u-bubble">Why are we spending this? Break it down.</div>
            </div>
          )}
          {step === 6 && <Typing />}
          {show(7) && (
            <div className="msg-in a-block">
              <span className="a-who">Radicas</span>
              <Kpi3 items={KPI2} />
            </div>
          )}
          {show(8) && (
            <div className="msg-in sim-chart-card">
              <Stack play={step >= 8} />
            </div>
          )}
          {show(9) && (
            <div className="msg-in a-block">
              <p className="a-text">
                <b>52%</b> is Product COGS — AI in what customers pay for, so it scales with revenue.{" "}
                <b>36%</b> is Productivity — internal automation. The last <b>12% (€5.8k)</b> is anomaly
                spend — pure waste.
              </p>
              <p className="a-text dim">The first two are healthy. The €5.8k is worth attacking.</p>
            </div>
          )}

          {show(10) && (
            <div className="msg-in u-row">
              <div className="u-bubble">Why do these anomalies happen, and what are we doing to fix them?</div>
            </div>
          )}
          {step === 11 && <Typing />}
          {show(12) && (
            <div className="msg-in sim-chart-card">
              <span className="a-who" style={{ marginBottom: 8, display: "block" }}>
                Radicas
              </span>
              <CauseBars play={step >= 12} />
            </div>
          )}
          {show(13) && (
            <div className="msg-in a-block">
              <div className="sim-causes">
                {CAUSES.map((c, i) => (
                  <div className="sim-cause" key={i}>
                    <span className="cc-bul" style={{ background: c.c }}></span>
                    <div>
                      <div className="cc-head">
                        <span className="cc-t">{c.t}</span>
                        <span className="cc-cost">
                          {c.cost} · {c.pct}
                        </span>
                      </div>
                      <div className="cc-fix">
                        <span className="fix-tag">fix</span>
                        {c.fix}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="a-text" style={{ marginTop: 10 }}>
                All four are addressable. Realistic recovery: <b>~€4.5k/month (≈78% of anomaly spend)</b>{" "}
                once guardrails ship.
              </p>
            </div>
          )}
        </div>
        <div className="chat-input">
          <span className="ci-text">Write a message…</span>
          <div className="ci-row">
            <span className="ci-plus">+</span>
            <span className="ci-model">
              Opus 4.7 <b>Extra</b> ▾
            </span>
            <span className="ci-mic">🎙</span>
          </div>
        </div>
      </div>
    </div>
  );
}
