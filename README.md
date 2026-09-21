# Radicas Landing

Marketing landing for **Radicas — the layer underneath**. Next.js 16 (App Router) · React 19 ·
Tailwind v4, built on the Radicas design system (light-first, periwinkle `#7571EB`, signal cyan
`#00E5FF`, Geist / Geist Mono, the vector wordmark).

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
| `NOTION_LEADS_DB_ID`      | yes\*    | Id of the "🌐 Website leads" database.                        |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | no | Cloudflare Turnstile site key. Omit to skip the captcha. |
| `TURNSTILE_SECRET_KEY`    | no       | Cloudflare Turnstile secret (server-only). Omit to skip the captcha. |
| `NEXT_PUBLIC_GA_ID`       | no       | GA4 measurement id (`G-XXXXXXXXXX`). Omit to disable analytics. |

\* Without both Notion vars the contact form still validates input but returns a clear
"not connected" message instead of storing the lead.

## Website leads

The form writes into **🌐 Website leads** (Business & Strategy → Go-to-Market → CRM), a
quarantine queue for contacts submitted by strangers. **Nothing is written to the CRM
itself** — 🏢 Organizations, 👥 People and ⚙️ Activity log are only ever written by a human
promoting a lead, which keeps unverified form input out of the registry.

To let the live site write to it:

1. Create an internal integration at <https://www.notion.so/my-integrations> (or reuse the CRM
   integration) and copy its secret into `NOTION_TOKEN`.
2. Share the database with the integration: open it → **•••** → **Connections** → add your
   integration. Put its id (the 32-char hash in the URL) into `NOTION_LEADS_DB_ID`.

What each submit writes — one row per submission, never merged:

`Name` (first + surname, or the email when both are blank), `First name`, `Surname`, `Email`
(lowercased), `Phone`, `Company`, `Domain` (from the email), `Consumer email` (ticked for gmail,
outlook and friends), `Submitted` (server timestamp) and `Status = New`. `Notes` is left for
whoever triages the queue.

A repeat submission from the same address is a new row on purpose: two submissions are something
triage should see, not something to silently merge.

The form has a hidden honeypot field (`website`); submissions that fill it are silently dropped.
When both Turnstile keys are set the submitted token is verified server-side; without them the
captcha is skipped.

## Analytics

GA4 loads via `@next/third-parties` only when `NEXT_PUBLIC_GA_ID` is set. Custom events:
`cta_book_demo` (nav) and `lead_submit` (contact).

## Deploy

Vercel-ready. Set the environment variables in the project settings; the App Router lead handler
runs on the Node.js runtime.
