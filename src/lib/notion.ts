import { APIErrorCode, APIResponseError, Client } from "@notionhq/client";

const token = process.env.NOTION_TOKEN;
const leadsDbId = process.env.NOTION_LEADS_DB_ID;

/** True when the integration token and the website leads database are configured. */
export const notionConfigured = Boolean(token && leadsDbId);

const notion = token ? new Client({ auth: token }) : null;

// Exact option name — must match the database schema character-for-character, because writing an
// unknown name silently auto-creates a junk option. Never built from user input.
const STATUS_NEW = "New"; // Status (select)

// Free/consumer email hosts. Whether a company can be derived from the domain is the first thing
// triage needs to know. Exact-host matches; wildcard bases are handled below.
const PUBLIC_EMAIL_DOMAINS = new Set([
  "gmail.com",
  "googlemail.com",
  "outlook.com",
  "hotmail.com",
  "live.com",
  "msn.com",
  "yahoo.com",
  "ymail.com",
  "icloud.com",
  "me.com",
  "mac.com",
  "proton.me",
  "protonmail.com",
  "pm.me",
  "aol.com",
  "web.de",
  "zoho.com",
  "hey.com",
  "fastmail.com",
]);
const PUBLIC_EMAIL_WILDCARD_BASES = ["gmx.", "yandex."];

export interface LeadInput {
  email: string; // already validated + trimmed by the route
  firstName?: string;
  lastName?: string;
  company?: string;
  phone?: string;
}

/** Lowercased email domain (the part after the last "@"), or null when malformed. */
function extractEmailDomain(email: string): string | null {
  const at = email.lastIndexOf("@");
  if (at === -1) return null;
  const domain = email.slice(at + 1).trim().toLowerCase();
  return domain || null;
}

function isPublicEmailProvider(domain: string): boolean {
  if (PUBLIC_EMAIL_DOMAINS.has(domain)) return true;
  return PUBLIC_EMAIL_WILDCARD_BASES.some((base) => domain.startsWith(base));
}

/**
 * Retry a single Notion API call on 429 (rate limited), honoring Retry-After. A 429 means the
 * call was not processed, so retrying is safe even for creates. The rate bucket is shared with
 * the Chrome extension, so this is a real code path, not a theoretical one.
 */
async function nRetry<T>(fn: () => Promise<T>, attempts = 3): Promise<T> {
  let lastErr: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      if (!(err instanceof APIResponseError) || err.code !== APIErrorCode.RateLimited) throw err;
      const headers = err.headers as unknown as { get?: (name: string) => string | null } | undefined;
      const retryAfter = Number(headers?.get?.("retry-after"));
      const waitMs = Number.isFinite(retryAfter) && retryAfter > 0 ? retryAfter * 1000 : 1000 * (i + 1);
      await new Promise((resolve) => setTimeout(resolve, waitMs));
    }
  }
  throw lastErr;
}

function text(content: string) {
  return { rich_text: [{ text: { content } }] };
}

/**
 * Append a website submission to the quarantine database, exactly as typed. This is a raw queue,
 * not the CRM: every submit is its own row, because a second submission from the same person is
 * something triage should see rather than something to silently merge away. Promotion into
 * Organizations / People / Activity log stays a deliberate human step.
 */
export async function createLead(input: LeadInput): Promise<string> {
  if (!notion || !leadsDbId) throw new Error("Notion website leads DB not configured.");

  const email = input.email.toLowerCase();
  const name = [input.firstName, input.lastName].filter(Boolean).join(" ").trim() || email;
  const domain = extractEmailDomain(email);

  const created = await nRetry(() =>
    notion.pages.create({
      parent: { database_id: leadsDbId },
      properties: {
        Name: { title: [{ text: { content: name } }] },
        Email: { email },
        Status: { select: { name: STATUS_NEW } },
        Submitted: { date: { start: new Date().toISOString() } },
        ...(input.firstName ? { "First name": text(input.firstName) } : {}),
        ...(input.lastName ? { Surname: text(input.lastName) } : {}),
        ...(input.company ? { Company: text(input.company) } : {}),
        ...(input.phone ? { Phone: { phone_number: input.phone } } : {}),
        ...(domain
          ? { Domain: text(domain), "Consumer email": { checkbox: isPublicEmailProvider(domain) } }
          : {}),
      },
    }),
  );
  return created.id;
}
