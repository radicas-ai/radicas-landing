# CLAUDE.md — Radicas Landing

Marketing landing for **Radicas — the layer underneath**. Next.js 16 (App Router),
React 19, Tailwind v4, pnpm. Dark-first design system: periwinkle `#7571EB`,
Geist / Geist Mono, Archivo Black wordmark — match the existing components, don't
invent styles. Run with `pnpm dev` (copy `.env.example` → `.env.local` first);
verify with `pnpm build` and `pnpm typecheck`. The contact form writes to the
Notion CRM (see README for env vars); never commit secrets.

## Design source (ADR-023 in radicas-nursery)

Canonical product decisions live in Notion; `../radicas-nursery` is the local
mirror + design workshop: platform invariants in `docs/invariants/big-picture.md`
(read-only mirror of Notion) and ADRs in `docs/architecture/ADR-*.md`. Marketing
claims about the product must not contradict those invariants — check before
writing product copy. Design and decide there; implement here. Pointers only —
never copy invariant text into this repo.
