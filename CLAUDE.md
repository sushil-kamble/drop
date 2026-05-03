# CLAUDE.md

Project-level instructions for Claude Code agents working in this repo. Sibling to `AGENTS.md` (read that for the human-facing overview); this file is the agent operating manual.

## Stack snapshot

- TanStack Start + React 19 + Vite 7, SSR via Nitro `cloudflare-module` preset
- Tailwind CSS v4, shadcn/ui primitives in `src/components/ui/`
- Convex (queries, mutations, schema, auth, email) in `convex/`
- Auth: Better Auth via `@convex-dev/better-auth`
- Hosting: Cloudflare Workers + Assets at `drop.1cc.in`
- Package manager: **pnpm** (do not use npm/yarn)

## Commands you will actually run

```bash
pnpm dev          # convex dev + vite dev (port 3001) concurrently
pnpm build        # production build (auto-loads .env.production)
pnpm typecheck    # tsc --noEmit
pnpm lint         # eslint
pnpm test         # vitest run
pnpm format       # prettier write
pnpm deploy:prod  # build + wrangler deploy to drop.1cc.in
```

Run `pnpm typecheck` and `pnpm lint` before declaring a task done. Do not run `pnpm deploy:prod` unless the user explicitly asks.

## Environment model

Three independent layers — keep them straight:

| Layer | Source | Vars |
|---|---|---|
| Vite build-time (inlined) | `.env`, `.env.local`, `.env.production` | `VITE_SITE_URL`, `VITE_CONVEX_URL`, `VITE_CONVEX_SITE_URL` |
| Cloudflare Worker runtime | none required | (all client-side URLs are inlined at build) |
| Convex deployment env | `convex env set [--prod]` | `BETTER_AUTH_SECRET`, `RESEND_API_KEY`, `SITE_URL`, optionally `RESEND_FROM_EMAIL` |

Notes:

- `vite build` defaults to `mode=production` and loads `.env.production`. Mode-specific files override `.env.local`, so committed prod URLs win during `pnpm build`.
- `.env.production` holds **only public URLs**. Never put secrets there.
- `.env` and `.env.local` are gitignored; they hold dev URLs plus `BETTER_AUTH_SECRET` and `RESEND_API_KEY` that `convex dev` reads.
- `SITE_URL` in `convex/auth.ts` is the *Convex* env var (set via `convex env set --prod`), not a Worker var. Don't confuse the two.
- `siteUrl()` in `src/lib/env.ts` falls through `VITE_SITE_URL` → `SITE_URL` → `https://drop.1cc.in`. The hardcoded fallback exists so the worker stays env-free.

## Deployment

App deploy:

```bash
pnpm deploy:prod
```

This is `pnpm build && wrangler --cwd .output deploy --domain drop.1cc.in`. Production URLs come from `.env.production`, inlined at build. Do not pass `--var` — runtime worker vars are not needed.

Convex function deploy (separate from app deploy):

```bash
tmp=$(mktemp) && printf 'CONVEX_DEPLOYMENT=admired-hornet-946\n' > "$tmp" && pnpm exec convex deploy --env-file "$tmp"; code=$?; rm -f "$tmp"; exit $code
```

Use the temp-file pattern in non-interactive sessions because local `.env` points at dev Convex; bare `pnpm exec convex deploy` will prompt.

Post-deploy smoke test:

```bash
curl -I https://drop.1cc.in
```

## Code conventions

- TypeScript strict; path alias `@/*` → `src/*`.
- File-based routes in `src/routes/`. Use TanStack Router patterns already in the file when adding new ones.
- Shared layout/navigation lives in `src/components/site/layout.tsx`. Don't duplicate default header actions via route `rightSlot` unless the action is page-specific.
- Public share URLs go through `siteUrl()` in `src/lib/env.ts`. Never hardcode `https://drop.1cc.in` in app code (the fallback in `env.ts` is the *only* allowed hardcode).
- Password reset / auth-email links use `SITE_URL` from Convex env (see `convex/auth.ts`).
- shadcn/ui primitives in `src/components/ui/` — extend, don't fork.
- Default to no comments. Add one only when *why* is non-obvious.

## Things to not do

- Do not add `--var` flags to deploy. They were removed because VITE_* vars are inlined at build time and worker runtime needs nothing.
- Do not commit `.env`, `.env.local`, `.output/`, `.wrangler/`, `.nitro/`, or any generated artifacts.
- Do not put secrets in `.env.production`.
- Do not run `pnpm deploy:prod`, `convex deploy`, or `git push` unless the user asks.
- Do not switch package manager. pnpm only.
- Do not introduce a new state library or routing system; stick with TanStack Router + Convex React Query bindings.

## Verifying changes

For typescript-only changes: `pnpm typecheck`.
For UI changes: start `pnpm dev`, exercise the affected route in a browser, and report what you actually saw — don't claim success from a passing build alone.
For Convex schema/function changes: `pnpm typecheck` covers types; behavior must be tested against the dev deployment via `pnpm dev`.

## Repo signals (where to look first)

- New page → add a route in `src/routes/`, mirror an existing one
- New Convex function → add to the appropriate file in `convex/`, schema in `convex/schema.ts`
- Auth behavior → `convex/auth.ts` + Better Auth config; `src/lib/auth-server.ts` for the SSR client
- URL/env resolution → `src/lib/env.ts` is the only place that reads env directly
- Email sending → `convex/email.ts` (Resend HTTP API)
