import { Mark } from "@/components/ui/Mark";
import { ButtonLink } from "@/components/ui/Button";
import { BookDemoButton } from "@/components/ui/BookDemoButton";

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden">
      {/* canvas gradient */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(1200px 620px at 15% -12%, rgba(117,113,235,0.12), transparent 62%)," +
            "radial-gradient(820px 520px at 100% 0%, rgba(0,229,255,0.05), transparent 58%)," +
            "linear-gradient(180deg, #0f1424 0%, #090c18 100%)",
        }}
      />
      <Mark className="pointer-events-none absolute -right-16 top-10 h-[420px] w-[420px] text-brand-primary/[0.06]" />

      <div className="relative mx-auto max-w-6xl px-5 pb-20 pt-16 sm:pb-28 sm:pt-24">
        <span className="inline-flex items-center gap-2.5 font-mono text-2xs uppercase tracking-caps text-fg-muted">
          <span className="h-1.5 w-1.5 rounded-pill bg-semantic-allow shadow-[0_0_10px_var(--color-semantic-allow)]" />
          finops for the ai era
        </span>

        <h1 className="mt-5 max-w-3xl font-display text-4xl font-semibold leading-tight tracking-tight text-fg sm:text-5xl">
          See and control every AI tool your company runs.
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-fg-muted">
          Radicas is the operating instrument for enterprise AI — a real-time cost intelligence layer
          beneath every tool, model, and agent your company runs.
        </p>

        <div className="mt-9 flex flex-wrap items-center gap-x-4 gap-y-3">
          <BookDemoButton location="hero" />
          <ButtonLink href="#what-it-does" variant="secondary" size="lg">
            See the product
          </ButtonLink>
          <span className="font-mono text-2xs lowercase tracking-mono text-fg-subtle">
            eu-native · no card
          </span>
        </div>

        {/* proof strip */}
        <div className="mt-14 grid max-w-3xl grid-cols-2 gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-4">
          {[
            { v: "€124k", k: "monthly spend tracked" },
            { v: "12", k: "AI vendors, one ledger" },
            { v: "15", k: "agents costed live" },
            { v: "12%", k: "waste surfaced" },
          ].map((s) => (
            <div key={s.k} className="bg-bg-elevated p-4">
              <div className="text-2xl font-medium tabular text-fg">{s.v}</div>
              <div className="mt-1 font-mono text-2xs uppercase leading-tight tracking-caps text-fg-subtle">
                {s.k}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
