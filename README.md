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
| `NOTION_LEADS_DB_ID`      | yes\*    | Id of the "Radicas — Leads" database.                         |
| `NEXT_PUBLIC_BOOKING_URL` | no       | Calendly/Cal.com link for "Book a demo". Falls back to `#contact`. |
| `NEXT_PUBLIC_GA_ID`       | no       | GA4 measurement id (`G-XXXXXXXXXX`). Omit to disable analytics. |

\* Without the Notion vars the contact form still validates input but returns a clear
"not connected" message instead of storing the lead.

## Notion CRM setup

The **"Radicas — Leads"** database is already created. To let the live site write to it:

1. Create an internal integration at <https://www.notion.so/my-integrations> and copy its secret
   into `NOTION_TOKEN`.
2. Open the Leads database → **•••** → **Connections** → add your integration.
3. Put the database id (the 32-char hash in its URL) into `NOTION_LEADS_DB_ID`.

Leads land with `Source = Landing` and `Status = New`. The form has a hidden honeypot field;
submissions that fill it are silently dropped.

## Analytics

GA4 loads via `@next/third-parties` only when `NEXT_PUBLIC_GA_ID` is set. Custom events:
`cta_book_demo` (nav / hero / contact) and `lead_submit`.

## Deploy

Vercel-ready. Set the environment variables in the project settings; the App Router lead handler
runs on the Node.js runtime.
