import { NextResponse } from "next/server";
import { createLead, notionConfigured } from "@/lib/notion";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface LeadBody {
  firstName?: unknown;
  lastName?: unknown;
  email?: unknown;
  company?: unknown; // honeypot
  captchaToken?: unknown; // Cloudflare Turnstile
}

const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;

// Verify a Turnstile token with Cloudflare. Returns true when verification passes,
// or when no secret is configured (dev/preview fallback — mirrors notionConfigured).
async function verifyTurnstile(token: string, remoteip: string | null): Promise<boolean> {
  if (!turnstileSecret) return true;
  if (!token) return false;
  try {
    const params = new URLSearchParams({ secret: turnstileSecret, response: token });
    if (remoteip) params.set("remoteip", remoteip);
    const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });
    const outcome = (await res.json()) as { success: boolean };
    return outcome.success === true;
  } catch (err) {
    console.error("[lead] Turnstile verification request failed:", err);
    return false;
  }
}

export async function POST(req: Request) {
  let body: LeadBody;
  try {
    body = (await req.json()) as LeadBody;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }

  // Honeypot — a filled "company" field means a bot. Pretend success, store nothing.
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return NextResponse.json({ ok: true });
  }

  // Captcha — block bots that get past the honeypot. No-op when no secret is set.
  const captchaToken = typeof body.captchaToken === "string" ? body.captchaToken : "";
  const remoteip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? null;
  if (!(await verifyTurnstile(captchaToken, remoteip))) {
    return NextResponse.json(
      { ok: false, error: "Captcha verification failed. Please retry." },
      { status: 400 },
    );
  }

  const firstName = typeof body.firstName === "string" ? body.firstName.trim() : "";
  const lastName = typeof body.lastName === "string" ? body.lastName.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim() : "";

  if (!firstName || !lastName) {
    return NextResponse.json({ ok: false, error: "Please enter your name." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json(
      { ok: false, error: "Please enter a valid email address." },
      { status: 400 },
    );
  }

  if (!notionConfigured) {
    // Don't lose the lead silently in dev/preview — log it and surface a clear server error.
    console.warn("[lead] Notion not configured — lead not stored:", { firstName, lastName, email });
    return NextResponse.json(
      { ok: false, error: "Submissions aren't connected yet. Please email us or book a demo." },
      { status: 503 },
    );
  }

  try {
    await createLead({ firstName, lastName, email });
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[lead] Failed to write to Notion:", err);
    return NextResponse.json(
      { ok: false, error: "We couldn't save that just now. Please try again shortly." },
      { status: 502 },
    );
  }
}
