"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { track } from "@/lib/analytics";
import { Wordmark } from "./Mark";

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
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
        scrolled
          ? "border-border bg-carbon-900/80 backdrop-blur-md"
          : "border-transparent bg-transparent",
      )}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-8 px-5">
        <a href="#top" aria-label="Radicas home">
          <Wordmark />
        </a>

        <a
          href={bookingUrl || "#contact"}
          target={bookingUrl ? "_blank" : undefined}
          rel={bookingUrl ? "noopener noreferrer" : undefined}
          onClick={() => track("cta_book_demo", { location: "nav" })}
          className="group inline-flex h-9 items-center gap-2 rounded-md bg-brand-primary px-4 text-sm font-medium text-carbon-050 transition-all hover:bg-brand-primary-hover hover:shadow-glow"
        >
          Book a demo <span className="arrow">→</span>
        </a>
      </nav>
    </header>
  );
}
