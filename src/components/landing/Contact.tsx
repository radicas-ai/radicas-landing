"use client";

import { useRef, useState, type FormEvent } from "react";
import { Turnstile, type TurnstileInstance } from "@marsidev/react-turnstile";
import { useReveal } from "@/hooks/useReveal";
import { cn } from "@/lib/cn";
import { track } from "@/lib/analytics";
import { ARROW_RIGHT, Icon } from "./icons";
import { Footer } from "./Footer";
import reveal from "./reveal.module.css";
import styles from "./Contact.module.css";

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const PHONE_RE = /^[+\d][\d\s().-]{5,}$/;
const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

const FIELDS = [
  { key: "firstName", id: "bk-first", label: "First name", type: "text", auto: "given-name" },
  { key: "lastName", id: "bk-last", label: "Surname", type: "text", auto: "family-name" },
  { key: "email", id: "bk-email", label: "Work email", type: "email", auto: "email" },
  { key: "phone", id: "bk-phone", label: "Phone", type: "tel", auto: "tel", optional: true },
  { key: "company", id: "bk-co", label: "Company", type: "text", auto: "organization", wide: true },
] as const;

type FieldKey = (typeof FIELDS)[number]["key"];
type Values = Record<FieldKey, string>;

const EMPTY: Values = { firstName: "", lastName: "", email: "", phone: "", company: "" };

/** Mirrors the server: email by shape, phone optional-but-valid, the rest simply present. */
function invalid(key: FieldKey, value: string): boolean {
  const v = value.trim();
  if (key === "email") return !EMAIL_RE.test(v);
  if (key === "phone") return v !== "" && !PHONE_RE.test(v);
  return v === "";
}

function hint(bad: FieldKey[]): string {
  if (bad.length === 1 && bad[0] === "email") return "Enter a valid work email.";
  if (bad.length === 1 && bad[0] === "phone") return "Enter a valid phone number, or leave it blank.";
  return "Fill in the highlighted fields.";
}

export function Contact() {
  const cta = useReveal<HTMLDivElement>();
  const [values, setValues] = useState<Values>(EMPTY);
  const [bad, setBad] = useState<FieldKey[]>([]);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [captchaToken, setCaptchaToken] = useState("");
  const inputs = useRef<Partial<Record<FieldKey, HTMLInputElement | null>>>({});
  const turnstileRef = useRef<TurnstileInstance | null>(null);

  // Gate submit on a token only where a site key is configured; mirrors the server check.
  const captchaReady = !turnstileSiteKey || captchaToken !== "";

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const wrong = FIELDS.map((f) => f.key).filter((key) => invalid(key, values[key]));
    setBad(wrong);
    if (wrong.length > 0) {
      setMessage(hint(wrong));
      inputs.current[wrong[0]]?.focus();
      return;
    }

    const website = String(new FormData(event.currentTarget).get("website") ?? "");
    setStatus("submitting");
    setMessage("");

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: values.firstName.trim(),
          lastName: values.lastName.trim(),
          email: values.email.trim(),
          phone: values.phone.trim(),
          company: values.company.trim(),
          website,
          captchaToken,
        }),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !json.ok) throw new Error(json.error || "Something went wrong.");
      setStatus("success");
      setValues(EMPTY);
      track("lead_submit", { location: "contact" });
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      // A Turnstile token is single-use — reset so a retry gets a fresh one.
      setCaptchaToken("");
      turnstileRef.current?.reset();
    }
  }

  function edit(key: FieldKey, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setBad((prev) => prev.filter((k) => k !== key));
    setMessage("");
  }

  return (
    <section className={styles.section} id="contact" aria-label="Get started">
      <div className="wrap">
        <div
          ref={cta.ref}
          className={cn(styles.cta, reveal.rv, cta.seen && reveal.in)}
          style={cta.style}
        >
          <div className={cn("eyebrow", styles.kick7)}>Get started</div>
          <h2 className={styles.h7}>
            Every AI euro.
            <br />
            <em>Priced, proven, governed.</em>
          </h2>
          <p>A 30-minute call on your own functions. Leave your details and we&apos;ll be in touch.</p>

          {status === "success" ? (
            <div className={styles.received} role="status">
              <div className="eyebrow">Received</div>
              <p>Thanks — we have your details and will be in touch shortly to arrange a time.</p>
            </div>
          ) : (
            <form className={styles.book} onSubmit={onSubmit} noValidate>
              {FIELDS.map((f) => (
                <div
                  key={f.key}
                  className={cn(styles.fld, "wide" in f && styles.wide, bad.includes(f.key) && styles.bad)}
                >
                  <label htmlFor={f.id}>
                    {f.label}
                    {!("optional" in f) && <i aria-hidden="true">*</i>}
                  </label>
                  <input
                    id={f.id}
                    ref={(el) => {
                      inputs.current[f.key] = el;
                    }}
                    name={f.key}
                    type={f.type}
                    autoComplete={f.auto}
                    aria-invalid={bad.includes(f.key) || undefined}
                    value={values[f.key]}
                    onChange={(e) => edit(f.key, e.target.value)}
                  />
                </div>
              ))}
              <div className={styles.hp} aria-hidden="true">
                <label htmlFor="website">Website</label>
                <input id="website" name="website" tabIndex={-1} autoComplete="off" />
              </div>
              <button
                className={cn("btn btn-primary btn-lg", styles.wide)}
                type="submit"
                disabled={!captchaReady || status === "submitting"}
              >
                {status === "submitting" ? "Sending…" : "Book a call"}
              </button>
            </form>
          )}

          {turnstileSiteKey && status !== "success" && (
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
          </p>

          <a className={styles.direct} id="contact-direct" href="mailto:info@radicas.ai">
            Or contact us directly <Icon paths={ARROW_RIGHT} />
          </a>
          <div className={styles.fine}>30 minutes · European hosting · Backed by Vento</div>
        </div>

        <Footer />
      </div>
    </section>
  );
}
