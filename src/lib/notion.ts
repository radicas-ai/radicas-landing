import { APIErrorCode, APIResponseError, Client, isFullPage } from "@notionhq/client";

const token = process.env.NOTION_TOKEN;
const orgsDbId = process.env.NOTION_ORGS_DB_ID;
const peopleDbId = process.env.NOTION_PEOPLE_DB_ID;
const activityDbId = process.env.NOTION_ACTIVITY_DB_ID;

/** True when the integration token and all three CRM databases are configured. */
export const notionConfigured = Boolean(token && orgsDbId && peopleDbId && activityDbId);

const notion = token ? new Client({ auth: token }) : null;

// Exact select/multi_select option names — must match the CRM schema character-for-character.
// Writing an unknown name would silently auto-create a junk option in the shared CRM, so these
// are the single source of truth and are never built from user input.
const ORG_TYPE_PROSPECT = "Prospect"; // Organizations.Type (multi_select)
const PERSON_ROLE_PROSPECT = "Prospect"; // People.Role (multi_select)
const PERSON_SOURCE_INBOUND = "Inbound"; // People.Source (select)
const PERSON_STATUS_ENGAGED = "Engaged"; // People.Connection Status (select)
const ACTIVITY_CHANNEL_WEBFORM = "Web form"; // Activity log.Channel (select) — pre-created manually
const ACTIVITY_OUTCOME_FOLLOWUP = "Follow-up needed"; // Activity log.Outcome (select)
const ACTIVITY_NEXT_STEP = "Reply to landing form request";

// Free/consumer email hosts — a contact on one of these is not tied to a company, so no
// Organization is created. Exact-host matches; wildcard bases (gmx.*, yandex.*) are handled below.
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
  jobTitle?: string;
}

export interface CrmResult {
  /** true when at least the Person was persisted (the lead is recoverable in the CRM). */
  ok: boolean;
  personId?: string;
  organizationId?: string | null;
  /** steps that failed but did not lose the lead, for logging (e.g. "organization", "activity"). */
  degraded: string[];
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
 * Normalize a stored Domain URL (or bare host) to a comparable host: lowercase, no scheme,
 * no leading "www.", no path/port. Used to turn Notion's inconsistent Domain values
 * ("https://acme.com", "https://www.acme.com/") into an exact key for dedup.
 */
function normalizeHost(hostOrUrl: string): string | null {
  const raw = hostOrUrl.trim();
  if (!raw) return null;
  try {
    const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    const host = new URL(withScheme).hostname.toLowerCase();
    return host.replace(/^www\./, "") || null;
  } catch {
    return null;
  }
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

/**
 * Find an existing Organization by email domain, or create one. Dedup is two-phase: a coarse
 * "Domain contains bareDomain" filter narrows candidates, then an exact normalizeHost match in
 * code rejects false positives (e.g. "data.com" ⊂ "nttdata.com"). Returns the page id.
 */
async function upsertOrganization(bareDomain: string, companyName?: string): Promise<string> {
  if (!notion || !orgsDbId) throw new Error("Notion Organizations DB not configured.");

  const found = await nRetry(() =>
    notion.databases.query({
      database_id: orgsDbId,
      filter: { property: "Domain", url: { contains: bareDomain } },
      page_size: 25,
    }),
  );

  for (const page of found.results) {
    if (!isFullPage(page)) continue;
    const prop = page.properties["Domain"];
    const stored = prop?.type === "url" ? prop.url : null;
    if (stored && normalizeHost(stored) === bareDomain) return page.id;
  }

  const name = companyName?.trim() || bareDomain;
  const created = await nRetry(() =>
    notion.pages.create({
      parent: { database_id: orgsDbId },
      properties: {
        Name: { title: [{ text: { content: name } }] },
        Domain: { url: `https://${bareDomain}` },
        Type: { multi_select: [{ name: ORG_TYPE_PROSPECT }] },
      },
    }),
  );
  return created.id;
}

/** Look up a Person by exact (lowercased) email. Returns the id plus which fields are empty. */
async function findPersonByEmail(
  emailLower: string,
): Promise<{ id: string; hasOrganization: boolean; hasTitle: boolean } | null> {
  if (!notion || !peopleDbId) throw new Error("Notion People DB not configured.");

  const found = await nRetry(() =>
    notion.databases.query({
      database_id: peopleDbId,
      filter: { property: "Email", email: { equals: emailLower } },
      page_size: 1,
    }),
  );

  const page = found.results[0];
  if (!page || !isFullPage(page)) return null;

  const orgProp = page.properties["Organization"];
  const titleProp = page.properties["Title"];
  const hasOrganization = orgProp?.type === "relation" && orgProp.relation.length > 0;
  const hasTitle = titleProp?.type === "rich_text" && titleProp.rich_text.length > 0;
  return { id: page.id, hasOrganization, hasTitle };
}

/**
 * Create the Person, or patch an existing one non-destructively: only fill Organization (if the
 * relation is empty) and Title (if blank). Never touches Source/Role/Connection Status. Skips the
 * update entirely when there is nothing to fill. Returns the page id.
 */
async function upsertPerson(input: {
  emailLower: string;
  fullName: string;
  jobTitle?: string;
  organizationId: string | null;
}): Promise<string> {
  if (!notion || !peopleDbId) throw new Error("Notion People DB not configured.");
  const { emailLower, fullName, jobTitle, organizationId } = input;

  const existing = await findPersonByEmail(emailLower);
  if (existing) {
    const fillOrg = organizationId && !existing.hasOrganization;
    const fillTitle = jobTitle && !existing.hasTitle;
    if (fillOrg || fillTitle) {
      await nRetry(() =>
        notion.pages.update({
          page_id: existing.id,
          properties: {
            ...(fillOrg ? { Organization: { relation: [{ id: organizationId }] } } : {}),
            ...(fillTitle ? { Title: { rich_text: [{ text: { content: jobTitle } }] } } : {}),
          },
        }),
      );
    }
    return existing.id;
  }

  const created = await nRetry(() =>
    notion.pages.create({
      parent: { database_id: peopleDbId },
      properties: {
        Name: { title: [{ text: { content: fullName } }] },
        Email: { email: emailLower },
        Role: { multi_select: [{ name: PERSON_ROLE_PROSPECT }] },
        Source: { select: { name: PERSON_SOURCE_INBOUND } },
        "Connection Status": { select: { name: PERSON_STATUS_ENGAGED } },
        ...(jobTitle ? { Title: { rich_text: [{ text: { content: jobTitle } }] } } : {}),
        ...(organizationId ? { Organization: { relation: [{ id: organizationId }] } } : {}),
      },
    }),
  );
  return created.id;
}

/** Append a "Web form" touchpoint to the Activity log, linked to the Person. Create-only. */
async function logActivity(input: { personId: string; fullName: string }): Promise<string> {
  if (!notion || !activityDbId) throw new Error("Notion Activity log DB not configured.");
  const { personId, fullName } = input;
  const today = new Date().toISOString().slice(0, 10);

  const created = await nRetry(() =>
    notion.pages.create({
      parent: { database_id: activityDbId },
      properties: {
        Title: { title: [{ text: { content: `Landing form — ${fullName}` } }] },
        Date: { date: { start: today } },
        Channel: { select: { name: ACTIVITY_CHANNEL_WEBFORM } },
        Outcome: { select: { name: ACTIVITY_OUTCOME_FOLLOWUP } },
        "Next Step": { rich_text: [{ text: { content: ACTIVITY_NEXT_STEP } }] },
        Person: { relation: [{ id: personId }] },
      },
    }),
  );
  return created.id;
}

/**
 * Persist a landing lead into the relational CRM: upsert Organization (by email domain) →
 * upsert Person → log an Activity touchpoint. Never throws on partial failure; the Person is the
 * anchor, so Organization and Activity degrade gracefully. Returns a CrmResult the route reads.
 */
export async function createLeadInCrm(input: LeadInput): Promise<CrmResult> {
  const emailLower = input.email.toLowerCase();
  // The one-field booking form sends an email only; it is the Person title then.
  const fullName = [input.firstName, input.lastName].filter(Boolean).join(" ").trim() || emailLower;
  const bareDomain = extractEmailDomain(emailLower);
  const corporate = bareDomain !== null && !isPublicEmailProvider(bareDomain);
  const degraded: string[] = [];

  // Organization is best-effort: a failure here must not block the Person (which holds the email).
  let organizationId: string | null = null;
  if (corporate && bareDomain) {
    try {
      organizationId = await upsertOrganization(bareDomain, input.company);
    } catch (err) {
      console.error("[lead] Organization upsert failed:", err);
      degraded.push("organization");
    }
  }

  // Person is the anchor — if this fails the lead is not persisted.
  let personId: string;
  try {
    personId = await upsertPerson({
      emailLower,
      fullName,
      jobTitle: input.jobTitle?.trim() || undefined,
      organizationId,
    });
  } catch (err) {
    console.error("[lead] Person upsert failed:", err);
    return { ok: false, organizationId, degraded: [...degraded, "person"] };
  }

  // Activity is a pure best-effort touchpoint; the lead is already saved as a Person.
  try {
    await logActivity({ personId, fullName });
  } catch (err) {
    console.error("[lead] Activity log failed:", err);
    degraded.push("activity");
  }

  return { ok: true, personId, organizationId, degraded };
}
