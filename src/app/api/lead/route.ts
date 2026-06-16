import { NextResponse } from "next/server";
import { createLead, notionConfigured } from "@/lib/notion";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface LeadBody {
  firstName?: unknown;
  lastName?: unknown;
  email?: unknown;
  company?: unknown; // honeypot
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
