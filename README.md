# Radicas Landing

Marketing landing for **Radicas — the layer underneath**. Next.js 16 (App Router) · React 19 ·
Tailwind v4, built on the Radicas design system (dark-first, periwinkle `#7571EB`, Geist / Geist
Mono, Archivo Black wordmark).

## Develop

```bash
pnpm install
cp .env.example .env.local   # fill in the values below
pnpm dev                     # http://localhost:3000
```

`pnpm build` produces the production build; `pnpm typecheck` runs `tsc --noEmit`.

## Environment

| Variable                  | Required | Purpose                                                        |
| ------------------------- | -------- | -------------------------------------------------------------- |
| `NOTION_TOKEN`            | yes\*    | Notion internal-integration secret (server-only).             |
| `NOTION_ORGS_DB_ID`       | yes\*    | Id of the "🏢 Organizations" database.                        |
| `NOTION_PEOPLE_DB_ID`     | yes\*    | Id of the "👥 People" database.                               |
| `NOTION_ACTIVITY_DB_ID`   | yes\*    | Id of the "⚙️ Activity log" database.                         |
| `NEXT_PUBLIC_BOOKING_URL` | no       | Calendly/Cal.com link for "Book a demo". Falls back to `#contact`. |
| `NEXT_PUBLIC_GA_ID`       | no       | GA4 measurement id (`G-XXXXXXXXXX`). Omit to disable analytics. |

\* Without all three Notion db vars the contact form still validates input but returns a clear
"not connected" message instead of storing the lead.

## Notion CRM setup

The form writes into the relational **CRM** (`🏢 Organizations` ← `👥 People` → `⚙️ Activity log`).
Each submit upserts the Organization (deduped by email domain), upserts the Person, and appends a
touchpoint to the Activity log — mirroring the "Notion Org Capture" browser extension. To let the
live site write to it:

1. Create an internal integration at <https://www.notion.so/my-integrations> (or reuse the CRM
   integration) and copy its secret into `NOTION_TOKEN`.
2. Share **all three** databases with the integration: open each → **•••** → **Connections** → add
   your integration. Put their ids (the 32-char hash in each URL) into `NOTION_ORGS_DB_ID`,
   `NOTION_PEOPLE_DB_ID`, `NOTION_ACTIVITY_DB_ID`.
3. In the Activity log, add a **`Web form`** option to the **`Channel`** select (the code writes
   this exact value).

What each submit writes:

- **People**: `Name`, `Email`, `Title` (job title), `Role = Prospect`, `Source = Inbound`,
  `Connection Status = Engaged`, and a relation to the Organization. An existing person (matched by
  email) is never overwritten — only empty `Organization`/`Title` are backfilled.
- **Organizations**: created only for corporate domains (free/consumer email hosts are skipped),
  with `Name` (from the Company field or the domain), `Domain`, and `Type = Prospect`.
- **Activity log**: `Channel = Web form`, `Outcome = Follow-up needed`, a `Next Step`, dated today,
  linked to the person.

The form has a hidden honeypot field (`website`); submissions that fill it are silently dropped.

## Analytics

GA4 loads via `@next/third-parties` only when `NEXT_PUBLIC_GA_ID` is set. Custom events:
`cta_book_demo` (nav / hero / contact) and `lead_submit`.

## Deploy

Vercel-ready. Set the environment variables in the project settings; the App Router lead handler
runs on the Node.js runtime.
