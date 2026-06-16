import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-md font-medium whitespace-nowrap " +
  "transition-all duration-150 ease-out cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg";

const variants: Record<Variant, string> = {
  primary:
    "bg-brand-primary text-carbon-050 hover:bg-brand-primary-hover hover:shadow-glow active:opacity-90",
  secondary:
    "bg-bg-elevated text-fg border border-border hover:bg-bg-overlay hover:border-border-strong",
  ghost: "bg-transparent text-fg-muted border border-transparent hover:bg-bg-elevated hover:text-fg",
};

const sizes: Record<Size, string> = {
  md: "h-9 px-4 text-sm",
  lg: "h-11 px-6 text-base",
};

type CommonProps = { variant?: Variant; size?: Size; className?: string; children: React.ReactNode };

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: CommonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} {...rest}>
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "primary",
  size = "md",
  className,
  children,
  ...rest
}: CommonProps & React.AnchorHTMLAttributes<HTMLAnchorElement>) {
  return (
    <a className={cn(base, variants[variant], sizes[size], className)} {...rest}>
      {children}
    </a>
  );
}
