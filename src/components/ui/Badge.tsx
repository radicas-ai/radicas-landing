import { cn } from "@/lib/cn";

type Tone = "neutral" | "brand" | "allow" | "deny" | "warning" | "review" | "info" | "orange";

const tones: Record<Tone, string> = {
  neutral: "text-fg-subtle border-border bg-bg-elevated",
  brand: "text-brand-primary-light border-brand-primary/30 bg-brand-primary/10",
  allow: "text-semantic-allow border-semantic-allow/30 bg-semantic-allow/10",
  deny: "text-semantic-deny border-semantic-deny/30 bg-semantic-deny/10",
  warning: "text-semantic-warning border-semantic-warning/30 bg-semantic-warning/10",
  review: "text-semantic-review border-semantic-review/30 bg-semantic-review/10",
  info: "text-semantic-info border-semantic-info/30 bg-semantic-info/10",
  orange: "text-accent-orange border-accent-orange/30 bg-accent-orange/10",
};

export function Badge({
  tone = "neutral",
  className,
  children,
}: {
  tone?: Tone;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5",
        "font-mono text-2xs font-medium uppercase tracking-caps",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}
