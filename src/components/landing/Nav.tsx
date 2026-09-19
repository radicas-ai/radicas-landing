"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { RadicasLogo } from "@/components/landing/Brand";
import { BURGER, Icon } from "@/components/landing/icons";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { track } from "@/lib/analytics";
import { cn } from "@/lib/cn";
import styles from "./Nav.module.css";

const SECTIONS = [
  { id: "process", label: "Process" },
  { id: "functions", label: "Functions" },
  { id: "platform", label: "Platform" },
  { id: "ai", label: "Copilot" },
  { id: "framework", label: "Framework" },
  { id: "integrations", label: "Integrations" },
];

export function Nav() {
  const reduced = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  // A band, not a ratio: an intersection ratio is a function of section height, so any
  // height change anywhere flipped the active link. Membership of a band is not.
  useEffect(() => {
    const inBand = new Set<string>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) inBand.add(entry.target.id);
          else inBand.delete(entry.target.id);
        }
        let best: string | null = null;
        for (let i = SECTIONS.length - 1; i >= 0; i -= 1) {
          if (inBand.has(SECTIONS[i].id)) {
            best = SECTIONS[i].id;
            break;
          }
        }
        setActive(best);
      },
      { threshold: 0, rootMargin: "-60px 0px -55% 0px" },
    );
    for (const { id } of SECTIONS) {
      const section = document.getElementById(id);
      if (section) io.observe(section);
    }
    return () => io.disconnect();
  }, []);

  function book() {
    setOpen(false);
    track("cta_book_demo", { location: "nav" });
    // `preventScroll` does not interrupt the anchor scroll, so there is nothing to wait for.
    requestAnimationFrame(() => document.getElementById("bk-email")?.focus({ preventScroll: true }));
  }

  function contact(event: MouseEvent<HTMLAnchorElement>) {
    setOpen(false);
    const direct = document.getElementById("contact-direct");
    if (!direct) return;
    event.preventDefault();
    direct.scrollIntoView({ behavior: reduced ? "auto" : "smooth", block: "center" });
    direct.focus({ preventScroll: true });
  }

  return (
    <header className={cn(styles.nav, open && styles.open)}>
      <div className="wrap">
        <a className={styles.logo} href="#top" aria-label="Radicas home">
          <RadicasLogo />
        </a>
        <nav className={styles.links} aria-label="Primary" id="nav-links">
          {SECTIONS.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className={cn(active === id && styles.on)}
              aria-current={active === id ? "true" : undefined}
              onClick={() => setOpen(false)}
            >
              {label}
            </a>
          ))}
          <a className={styles.mOnly} href="#contact" onClick={contact}>
            Contact us
          </a>
        </nav>
        <div className={styles.cta}>
          <a className={styles.signin} href="#contact" onClick={contact}>
            Contact us
          </a>
          <a className="btn btn-primary" href="#contact" onClick={book}>
            Book a demo
          </a>
          <button
            className={styles.burger}
            type="button"
            aria-label="Menu"
            aria-expanded={open}
            aria-controls="nav-links"
            onClick={() => setOpen((o) => !o)}
          >
            <Icon paths={BURGER} />
          </button>
        </div>
      </div>
    </header>
  );
}
