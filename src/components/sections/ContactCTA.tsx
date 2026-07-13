"use client";

import { useState } from "react";
import { cn } from "@/lib/cn";
import { track } from "@/lib/analytics";
import { BookDemoButton } from "@/components/ui/BookDemoButton";

type Status = "idle" | "submitting" | "success" | "error";

const inputCls =
  "h-10 w-full rounded-md border border-border bg-bg px-3.5 text-sm text-fg placeholder:text-fg-subtle " +
  "transition-colors hover:border-border-strong focus:border-brand-primary focus:outline-none " +
  "focus:ring-2 focus:ring-brand-primary/40";

type ContactProps = {
  eyebrow?: string;
  heading?: React.ReactNode;
  body?: React.ReactNode;
};

export function ContactCTA({ eyebrow, heading, body }: ContactProps = {}) {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string>("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setError("");

    const form = e.currentTarget;
    const data = new FormData(form);
    const payload = {
      firstName: String(data.get("firstName") || "").trim(),
      lastName: String(data.get("lastName") || "").trim(),
      email: String(data.get("email") || "").trim(),
      company: String(data.get("company") || ""), // honeypot
    };

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !json.ok) throw new Error(json.error || "Something went wrong.");
      setStatus("success");
      track("lead_submit", { location: "contact" });
      form.reset();
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <section id="contact" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20 sm:py-28">
      <div className="grid gap-12 rounded-xl border border-border bg-bg-elevated p-6 sm:p-10 lg:grid-cols-2 lg:items-center">
        {/* copy */}
        <div>
          <p className="eyebrow text-fg-subtle">{eyebrow ?? "get the layer"}</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
            {heading ?? "See Radicas on your stack."}
          </h2>
          <p className="mt-4 max-w-md text-md text-fg-muted">
            {body ?? (
              <>
                Book a working session and we&apos;ll map your AI spend, agents, and policy posture —
                or leave your details and we&apos;ll reach out.
              </>
            )}
          </p>
          <div className="mt-6">
            <BookDemoButton location="contact" />
          </div>
        </div>

        {/* form */}
        {status === "success" ? (
          <div className="flex flex-col items-start justify-center rounded-lg border border-semantic-allow/30 bg-semantic-allow/10 p-6">
            <div className="font-mono text-2xs uppercase tracking-caps text-semantic-allow">
              Received
            </div>
            <p className="mt-2 text-md text-fg">
              Thanks — you&apos;re on the list. We&apos;ll be in touch shortly.
            </p>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="firstName" className="text-sm font-medium text-fg">
                  First name
                </label>
                <input id="firstName" name="firstName" required autoComplete="given-name" className={inputCls} placeholder="Ada" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label htmlFor="lastName" className="text-sm font-medium text-fg">
                  Last name
                </label>
                <input id="lastName" name="lastName" required autoComplete="family-name" className={inputCls} placeholder="Lovelace" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-fg">
                Work email
              </label>
              <input id="email" name="email" type="email" required autoComplete="email" className={inputCls} placeholder="ada@company.com" />
            </div>

            {/* honeypot — hidden from humans */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <label htmlFor="company">Company</label>
              <input id="company" name="company" tabIndex={-1} autoComplete="off" />
            </div>

            {status === "error" && (
              <p className="text-sm text-semantic-deny">{error}</p>
            )}

            <button
              type="submit"
              disabled={status === "submitting"}
              className={cn(
                "group inline-flex h-11 items-center justify-center gap-2 rounded-md bg-brand-primary px-6 text-base font-medium text-carbon-050",
                "transition-all hover:bg-brand-primary-hover hover:shadow-glow",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary focus-visible:ring-offset-2 focus-visible:ring-offset-bg-elevated",
                "disabled:cursor-not-allowed disabled:opacity-50",
              )}
            >
              {status === "submitting" ? "Sending…" : "Request access"}
              <span className="arrow">→</span>
            </button>
            <p className="font-mono text-2xs text-fg-subtle">
              We&apos;ll only use this to contact you about Radicas.
            </p>
          </form>
        )}
      </div>
    </section>
  );
}
