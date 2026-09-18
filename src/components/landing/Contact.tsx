"use client";

import { useRef, useState, type FormEvent } from "react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { cn } from "@/lib/cn";
import { track } from "@/lib/analytics";
import { bookingUrl } from "@/lib/site";
import { ARROW_RIGHT, Icon } from "./icons";
import { Footer } from "./Footer";
import styles from "./Contact.module.css";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

export function Contact() {
  const [email, setEmail] = useState("");
  const [bad, setBad] = useState(false);
  const [message, setMessage] = useState("");
  const [blockedUrl, setBlockedUrl] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const turnstileRef = useRef<TurnstileInstance | null>(null);

  // Gate submit on a token only where a site key is configured; mirrors the server check.
  const captchaReady = !turnstileSiteKey || captchaToken !== "";

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = email.trim();
    setBlockedUrl("");

    if (!EMAIL_RE.test(value)) {
      setBad(true);
      setMessage("Enter a work email to pick a time.");
      inputRef.current?.focus();
      return;
    }
    setBad(false);

    const website = String(new FormData(event.currentTarget).get("website") ?? "");

    // Opened inside the user gesture, before any await, so popup blockers stay quiet.
    const url = `${bookingUrl}${bookingUrl.includes("?") ? "&" : "?"}email=${encodeURIComponent(value)}`;
    const win = window.open(url, "_blank", "noopener");

    // The booking is what matters — a CRM failure never reaches the visitor.
    fetch("/api/lead", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      keepalive: true,
      body: JSON.stringify({ email: value, website, captchaToken }),
    })
      .then((res) => {
        if (!res.ok) console.error("[contact] lead not saved:", res.status);
      })
      .catch((err) => console.error("[contact] lead not saved:", err));

    track("lead_submit", { location: "contact" });
    setMessage("The calendar opened in a new tab. Pick a time that suits you.");
    if (!win) setBlockedUrl(url);
    setEmail("");

    // A Turnstile token is single-use — reset so the next submit gets a fresh one.
    setCaptchaToken("");
    turnstileRef.current?.reset();
  }

  return (
    <section className={styles.section} id="contact" aria-label="Get started">
      <div className="wrap">
        <div className={styles.cta}>
          <div className={cn("eyebrow", styles.kick7)}>Book a call</div>
          <h2 className={styles.h7}>
            Every AI euro.
            <br />
            <em>Priced, proven, governed.</em>
          </h2>
          <p>A 30-minute call on your own functions. Leave your work email and pick a time.</p>

          <form className={cn(styles.book, bad && styles.bad)} onSubmit={onSubmit} noValidate>
            <label className="sr" htmlFor="bk-email">
              Work email
            </label>
            <input
              id="bk-email"
              ref={inputRef}
              name="email"
              type="email"
              required
              placeholder="Work email*"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setBad(false);
                setMessage("");
                setBlockedUrl("");
              }}
            />
            <div className={styles.hp} aria-hidden="true">
              <label htmlFor="website">Website</label>
              <input id="website" name="website" tabIndex={-1} autoComplete="off" />
            </div>
            <button className="btn btn-primary btn-lg" type="submit" disabled={!captchaReady}>
              Book a demo
            </button>
          </form>

          {turnstileSiteKey && (
            <div className={styles.captcha}>
              <Turnstile
                ref={turnstileRef}
                siteKey={turnstileSiteKey}
                onSuccess={setCaptchaToken}
                onExpire={() => setCaptchaToken("")}
                onError={() => setCaptchaToken("")}
                options={{ appearance: "interaction-only", theme: "light" }}
              />
            </div>
          )}

          <p className={styles.bkMsg} aria-live="polite">
            {message}
            {blockedUrl !== "" && (
              <>
                {" "}
                If your browser blocked it,{" "}
                <a href={blockedUrl} target="_blank" rel="noopener noreferrer">
                  open the calendar here
                </a>
                .
              </>
            )}
          </p>

          <a className={styles.direct} id="contact-direct" href="mailto:sales@radicas.ai">
            Or contact us directly <Icon paths={ARROW_RIGHT} />
          </a>
          <div className={styles.fine}>30 minutes · European hosting · Backed by Vento</div>
        </div>

        <Footer />
      </div>
    </section>
  );
}
