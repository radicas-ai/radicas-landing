"use client";

// Proposal 2 hero — two-column (copy + framed vendor-ledger artifact) with an
// animated stat strip. Count-ups fire once on scroll-in and honour reduced motion.
import { useEffect, useRef, useState } from "react";
import { BookDemoButton } from "@/components/ui/BookDemoButton";
import { ButtonLink } from "@/components/ui/Button";

type Ledger = { vendor: string; spend: string; renews: string; state?: "ALLOW" | "REVIEW" };
const LEDGER: Ledger[] = [
  { vendor: "openai.gpt-4o", spend: "€42,180", renews: "2026-09-15", state: "ALLOW" },
  { vendor: "anthropic.claude", spend: "€31,640", renews: "2026-11-02" },
  { vendor: "microsoft.copilot", spend: "€18,920", renews: "2026-08-30", state: "REVIEW" },
  { vendor: "cursor.compose", spend: "€7,410", renews: "2027-01-21" },
];

const STATS = [
  { prefix: "€", to: 124, suffix: "k", label: "monthly spend tracked" },
  { prefix: "", to: 12, suffix: "", label: "AI vendors, one ledger" },
  { prefix: "", to: 15, suffix: "", label: "agents costed live" },
  { prefix: "", to: 12, suffix: "%", label: "waste surfaced", accent: true },
];

function useInView<T extends Element>(once = true) {
  const ref = useRef<T | null>(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || seen) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) {
          setSeen(true);
          if (once) io.disconnect();
        }
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [seen, once]);
  return { ref, seen };
}

function CountUp({ to, seen }: { to: number; seen: boolean }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!seen) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setN(to);
      return;
    }
    const dur = 1200;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
      setN(Math.round(eased * to));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, to]);
  return <>{n}</>;
}

export function HeroV2() {
  const { ref, seen } = useInView<HTMLDivElement>();

  return (
    <section id="top" className="relative overflow-hidden">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(1100px 560px at 12% -10%, rgba(117,113,235,0.14), transparent 60%)," +
            "radial-gradient(760px 480px at 100% 0%, rgba(0,229,255,0.05), transparent 58%)," +
            "linear-gradient(180deg, #0f1424 0%, #090c18 100%)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-16 sm:pt-20 lg:pb-20">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          {/* left — copy */}
          <div className="min-w-0">
            <span className="inline-flex items-center gap-2.5 font-mono text-2xs uppercase tracking-caps text-fg-muted">
              <span className="h-1.5 w-1.5 rounded-pill bg-semantic-allow shadow-[0_0_10px_var(--color-semantic-allow)]" />
              finops for the ai era
            </span>

            <h1 className="mt-5 max-w-2xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-fg sm:text-5xl">
              Take control of your AI spend.
            </h1>

            <p className="mt-6 max-w-xl text-lg text-fg-muted">
              AI spend is becoming one of the fastest-growing, least-governed line items on your P&amp;L.
              Radicas helps organizations understand what they&apos;re spending, who owns it, and where
              it&apos;s creating value.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3">
              <BookDemoButton location="hero-v2" />
              <ButtonLink href="#what-it-does" variant="secondary" size="lg">
                See how it works
              </ButtonLink>
              <span className="font-mono text-2xs lowercase tracking-mono text-fg-subtle">
                eu-native · no card
              </span>
            </div>
          </div>

          {/* right — framed vendor-ledger artifact */}
          <div className="min-w-0 rounded-xl border border-border bg-bg-elevated shadow-[0_10px_40px_rgba(0,0,0,0.55)] [box-shadow:inset_0_1px_0_rgba(255,255,255,0.04),0_10px_40px_rgba(0,0,0,0.55)]">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <span className="font-mono text-xs tracking-mono text-fg-muted">vendor ledger</span>
              <span className="font-mono text-2xs uppercase tracking-caps text-fg-subtle">
                01 oct – 31 oct · 12 vendors
              </span>
            </div>
            <div className="overflow-x-auto">
              <div className="min-w-[420px]">
                <div className="grid grid-cols-[1.4fr_0.9fr_0.9fr_auto] gap-3 border-b border-border px-4 py-2 font-mono text-2xs uppercase tracking-caps text-fg-subtle">
                  <span>vendor</span>
                  <span className="text-right">spend</span>
                  <span>renews</span>
                  <span className="text-right">state</span>
                </div>
                {LEDGER.map((r) => (
                  <div
                    key={r.vendor}
                    className="grid grid-cols-[1.4fr_0.9fr_0.9fr_auto] items-center gap-3 border-b border-border/60 px-4 py-3 font-mono text-sm last:border-0"
                  >
                    <span className="text-fg">{r.vendor}</span>
                    <span className="text-right tabular text-fg">{r.spend}</span>
                    <span className="text-fg-muted">{r.renews}</span>
                    <span className="text-right">
                      {r.state ? (
                        <span
                          className={
                            "rounded px-1.5 py-0.5 text-2xs font-semibold " +
                            (r.state === "ALLOW"
                              ? "bg-semantic-allow/12 text-semantic-allow"
                              : "bg-semantic-review/12 text-semantic-review")
                          }
                        >
                          {r.state}
                        </span>
                      ) : (
                        <span className="text-fg-subtle">—</span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* stats strip */}
        <div
          ref={ref}
          className="mt-14 grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-4"
        >
          {STATS.map((s) => (
            <div key={s.label} className="bg-bg-elevated p-5">
              <div
                className={
                  "font-mono text-3xl font-medium tabular " +
                  (s.accent ? "text-semantic-allow" : "text-fg")
                }
              >
                {s.prefix}
                <CountUp to={s.to} seen={seen} />
                {s.suffix}
              </div>
              <div className="mt-1.5 font-mono text-2xs uppercase leading-tight tracking-caps text-fg-subtle">
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
