"use client";

import { useEffect, useState, type MouseEvent } from "react";
import { RadicasLogo } from "@/components/landing/Brand";
import { BURGER, Icon } from "@/components/landing/icons";
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
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const ratios = new Map<string, number>();
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) ratios.set(entry.target.id, entry.intersectionRatio);
        let best: string | null = null;
        let top = 0;
        for (const [id, ratio] of ratios) {
          if (ratio > top) {
            top = ratio;
            best = id;
          }
        }
        setActive(top > 0.15 ? best : null);
      },
      { threshold: [0, 0.15, 0.3, 0.5, 0.7] },
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
    // The contact form is rendered further down the page; wait for the anchor scroll to land.
    window.setTimeout(() => document.getElementById("bk-email")?.focus({ preventScroll: true }), 500);
  }

  function contact(event: MouseEvent<HTMLAnchorElement>) {
    setOpen(false);
    const direct = document.getElementById("contact-direct");
    if (!direct) return;
    event.preventDefault();
    direct.scrollIntoView({ behavior: "smooth", block: "center" });
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
