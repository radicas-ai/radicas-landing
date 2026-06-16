"use client";

// Proposal 2 nav — wordmark left, section links center/right, primary CTA right.
// Sticky + blur on scroll. Mobile collapses links to a sheet.
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { track } from "@/lib/analytics";
import { Wordmark } from "@/components/ui/Mark";

const LINKS = [
  { href: "#what-it-does", label: "Product" },
  { href: "#ask", label: "How it works" },
  { href: "#security", label: "Security" },
];

export function NavV2() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const bookingUrl = process.env.NEXT_PUBLIC_BOOKING_URL;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b transition-colors duration-200",
        scrolled || open
          ? "border-border bg-carbon-900/85 backdrop-blur-md"
          : "border-transparent bg-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-8 px-5">
        <a href="#top" aria-label="Radicas home">
          <Wordmark />
        </a>

        <div className="hidden items-center gap-7 md:flex">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-fg-muted transition-colors hover:text-fg">
              {l.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <a
            href={bookingUrl || "#contact"}
            target={bookingUrl ? "_blank" : undefined}
            rel={bookingUrl ? "noopener noreferrer" : undefined}
            onClick={() => track("cta_book_demo", { location: "nav-v2" })}
            className="group hidden h-9 items-center gap-2 rounded-md bg-brand-primary px-4 text-sm font-medium text-carbon-050 transition-all hover:bg-brand-primary-hover hover:shadow-glow sm:inline-flex"
          >
            Book a demo <span className="arrow">→</span>
          </a>
          <button
            type="button"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((o) => !o)}
            className="grid h-9 w-9 place-items-center rounded-md border border-border text-fg-muted md:hidden"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              {open ? <path d="M6 6l12 12M6 18 18 6" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </nav>

      {/* mobile sheet */}
      {open && (
        <div className="border-t border-border bg-carbon-900/95 px-5 py-4 md:hidden">
          <div className="flex flex-col gap-1">
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-2.5 text-sm text-fg-muted transition-colors hover:bg-bg-elevated hover:text-fg"
              >
                {l.label}
              </a>
            ))}
            <a
              href={bookingUrl || "#contact"}
              target={bookingUrl ? "_blank" : undefined}
              rel={bookingUrl ? "noopener noreferrer" : undefined}
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex h-10 items-center justify-center gap-2 rounded-md bg-brand-primary px-4 text-sm font-medium text-carbon-050"
            >
              Book a demo <span className="arrow">→</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
