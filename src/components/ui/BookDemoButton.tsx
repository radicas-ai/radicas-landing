"use client";

import { cn } from "@/lib/cn";
import { track } from "@/lib/analytics";
import { bookingUrl } from "@/lib/site";

const base =
  "group inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all duration-150 ease-out " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg";

/**
 * Opens the configured scheduler (NEXT_PUBLIC_BOOKING_URL) in a new tab. When unset, falls back to
 * the on-page contact form so the CTA always does something.
 */
export function BookDemoButton({
  location,
  size = "lg",
  className,
}: {
  location: string;
  size?: "md" | "lg";
  className?: string;
}) {
  const sizing = size === "lg" ? "h-11 px-6 text-base" : "h-9 px-4 text-sm";

  return (
    <a
      href={bookingUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("cta_book_demo", { location })}
      className={cn(
        base,
        sizing,
        "bg-brand-primary text-carbon-050 hover:bg-brand-primary-hover hover:shadow-glow",
        className,
      )}
    >
      Book a demo <span className="arrow">→</span>
    </a>
  );
}
