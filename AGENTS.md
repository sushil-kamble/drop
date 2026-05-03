# AGENTS.md

## Project

Drop is a TanStack Start + React app backed by Convex and deployed to Cloudflare Workers at:

- Production app: `https://drop.1cc.in`
- Production Convex: `https://admired-hornet-946.convex.cloud`
- Dev Convex: `https://giddy-salmon-79.convex.cloud`

## Stack

- Package manager: `pnpm`
- Frontend/SSR: TanStack Start, React, Vite, Nitro
- Styling: Tailwind CSS
- Backend/database/auth functions: Convex
- Auth: Better Auth via `@convex-dev/better-auth`
- Hosting: Cloudflare Workers + Assets

## Key paths

- `src/routes/` — file-based routes
- `src/components/site/layout.tsx` — shared header, mobile menu, page frame, layout helpers
- `src/components/ui/` — reusable UI primitives
- `src/lib/env.ts` — app/site/Convex URL resolution
- `convex/` — Convex schema, queries, mutations, auth, email logic
- `convex/email.ts` — Resend password reset email sender
- `vite.config.ts` — Nitro Cloudflare module preset

## Local development

```bash
pnpm dev
```

This runs Convex dev and Vite client together.

Useful checks:

```bash
pnpm lint
pnpm build
pnpm test
pnpm typecheck
```

Run at least `pnpm lint` before committing. Run `pnpm build` before deploy-related changes.

## Environment notes

Local `.env` / `.env.local` are intentionally gitignored. Do not commit secrets.

Important env vars:

- `VITE_SITE_URL` / `SITE_URL`
- `VITE_CONVEX_URL`
- `VITE_CONVEX_SITE_URL`
- `BETTER_AUTH_SECRET` in Convex env
- `RESEND_API_KEY` in Convex env

`RESEND_FROM_EMAIL` should normally be unset. The app falls back to Resend's default sender (`Drop <onboarding@resend.dev>`). Only set it if a verified custom sender is desired.

Check Convex env:

```bash
pnpm exec convex env list
pnpm exec convex env list --prod
```

Unset Resend sender if needed:

```bash
pnpm exec convex env remove RESEND_FROM_EMAIL
pnpm exec convex env remove --prod RESEND_FROM_EMAIL
```

## Deployment

Production deploy target is **drop.1cc.in**, not the `workers.dev` URL.

Use:

```bash
pnpm deploy:prod
```

This script:

1. Builds with production URLs:
   - `VITE_SITE_URL=https://drop.1cc.in`
   - `SITE_URL=https://drop.1cc.in`
   - `VITE_CONVEX_URL=https://admired-hornet-946.convex.cloud`
   - `VITE_CONVEX_SITE_URL=https://admired-hornet-946.convex.site`
2. Deploys the generated Cloudflare Worker/Assets to the custom domain `drop.1cc.in`.

For Convex function changes, deploy prod Convex explicitly:

```bash
tmp=$(mktemp) && printf 'CONVEX_DEPLOYMENT=admired-hornet-946\n' > "$tmp" && pnpm exec convex deploy --env-file "$tmp"; code=$?; rm -f "$tmp"; exit $code
```

`pnpm exec convex deploy` may prompt because local env points to dev; use the explicit deployment command above in non-interactive agent sessions.

Verify production after deploy:

```bash
curl -I https://drop.1cc.in
```

## Git workflow

- Do not commit unless the user asks.
- If committing, keep messages short and imperative.
- Push only when requested.
- Never commit `.env`, `.env.local`, `.output`, `.wrangler`, or generated deployment artifacts.

## Implementation notes

- Shared navigation lives in `src/components/site/layout.tsx`; avoid duplicating default header actions via route `rightSlot` unless the action is page-specific.
- Public share URLs should use `siteUrl()` from `src/lib/env.ts` and production must resolve to `https://drop.1cc.in`.
- Password reset links use `SITE_URL` from Convex env for backend/auth flows.
