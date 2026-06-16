// Proposal 2 footer — expanded grid on a carbon-950 base to seat the page.
import { Wordmark } from "@/components/ui/Mark";

const COLS: { head: string; links: { href: string; label: string }[] }[] = [
  {
    head: "Product",
    links: [
      { href: "#what-it-does", label: "What the layer does" },
      { href: "#control-plane", label: "Control plane" },
      { href: "#ask", label: "Ask in plain language" },
    ],
  },
  {
    head: "How it works",
    links: [
      { href: "#faq", label: "FAQ" },
      { href: "#ask", label: "Integrations" },
    ],
  },
  {
    head: "Security",
    links: [
      { href: "#security", label: "Trust & compliance" },
      { href: "#security", label: "EU-native" },
    ],
  },
  {
    head: "Contact",
    links: [{ href: "#contact", label: "Request access" }],
  },
];

export function FooterV2() {
  return (
    <footer className="border-t border-border bg-carbon-950">
      <div className="mx-auto max-w-6xl px-5 py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div className="flex flex-col gap-3">
            <Wordmark />
            <p className="max-w-xs text-sm text-fg-subtle">
              The runtime control plane for enterprise AI.
            </p>
            <span className="inline-flex w-fit items-center gap-2 font-mono text-2xs uppercase tracking-caps text-fg-subtle">
              <span className="h-1.5 w-1.5 rounded-pill bg-semantic-allow" />
              eu-native
            </span>
          </div>

          {COLS.map((c) => (
            <div key={c.head} className="flex flex-col gap-3">
              <span className="font-mono text-2xs uppercase tracking-caps text-fg-subtle">
                {c.head}
              </span>
              {c.links.map((l) => (
                <a
                  key={l.label}
                  href={l.href}
                  className="text-sm text-fg-muted transition-colors hover:text-fg"
                >
                  {l.label}
                </a>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-border pt-6">
          <p className="font-mono text-2xs uppercase tracking-caps text-fg-subtle">
            © {new Date().getFullYear()} Radicas · the layer underneath
          </p>
        </div>
      </div>
    </footer>
  );
}
