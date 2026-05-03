# Drop

**A private inbox for the feedback people won't say out loud.**

Drop gives you a dedicated page where anyone can send you an anonymous note, question, complaint, or request — no account required, no public thread, no performative tone. You get the unfiltered signal. They get to be honest.

Live at [drop.1cc.in](https://drop.1cc.in)

---

## Why Drop

Most feedback tools are built around surveys, ratings, or public comments. Drop is built around a different premise: the most useful feedback is often the kind people won't put their name on.

- A team member won't tell their lead what's actually wrong in a one-on-one.
- A reader won't publicly critique an author they respect.
- A customer won't file a complaint if it means creating an account and a paper trail.

Drop removes the friction and the visibility. The sender stays anonymous. You get the real message.

---

## Features

**For page owners**

- **Multiple pages** — Create separate Drop pages for different contexts: one for your team, one for your community, one for a project.
- **Custom page identity** — Set a title, intro text, and a trust statement so contributors know what to expect and why it's safe.
- **Private inbox** — Only you see the submissions. No public feed, no comment threads.
- **Drop states** — Mark submissions as new, saved, in progress, or archived to stay organized.
- **Visibility control** — Hide individual drops from your inbox view without deleting them.
- **Shareable link** — Every page gets a unique URL. Share it anywhere.

**For contributors**

- **No account required** — Open the link, write the message, submit. Done.
- **Anonymous by design** — No IP logging displayed, no identity tied to the submission.
- **Mobile-friendly** — Works cleanly on any device.
- **Low friction** — One required field (your message), one optional field (context). That's it.

---

## Setup

### Prerequisites

- Node.js 20+
- pnpm (`npm i -g pnpm`)
- A [Convex](https://convex.dev) account
- A [Resend](https://resend.com) account (for password reset emails)

### 1. Clone and install

```bash
git clone https://github.com/your-org/drop.git
cd drop
pnpm install
```

### 2. Create a Convex project

```bash
pnpm exec convex dev
```

Follow the prompts to log in and create a new project. This writes a `.env.local` file with your `CONVEX_DEPLOYMENT` value.

### 3. Configure local environment

Create `.env.local` in the project root:

```env
VITE_CONVEX_URL=https://your-deployment.convex.cloud
VITE_CONVEX_SITE_URL=https://your-deployment.convex.site
VITE_SITE_URL=http://localhost:3001
```

### 4. Set Convex environment variables

```bash
# Required for auth
pnpm exec convex env set BETTER_AUTH_SECRET $(openssl rand -hex 32)

# Required for password reset emails
pnpm exec convex env set RESEND_API_KEY re_your_key

# Required so reset links point at the right origin
pnpm exec convex env set SITE_URL http://localhost:3001

# Optional: use a verified custom sender instead of Resend's default
# pnpm exec convex env set RESEND_FROM_EMAIL noreply@yourdomain.com
```

### 5. Start development

```bash
pnpm dev
```

Runs Convex dev and Vite dev concurrently. App is at `http://localhost:3001`.

---

## Project commands

```bash
pnpm dev          # Start Convex dev + Vite dev (port 3001)
pnpm build        # Production build (loads .env.production)
pnpm typecheck    # TypeScript strict check
pnpm lint         # ESLint
pnpm test         # Vitest
pnpm format       # Prettier
pnpm deploy:prod  # Build + deploy to Cloudflare Workers
```

---

## Deployment

### App (Cloudflare Workers)

Create `.env.production` with your production URLs (public only, no secrets):

```env
VITE_CONVEX_URL=https://admired-hornet-946.convex.cloud
VITE_CONVEX_SITE_URL=https://admired-hornet-946.convex.site
VITE_SITE_URL=https://your-domain.com
```

Deploy:

```bash
pnpm deploy:prod
```

This runs `pnpm build && wrangler --cwd .output deploy`. URLs are inlined at build time; no runtime Worker vars are needed.

### Convex functions

```bash
tmp=$(mktemp) && printf 'CONVEX_DEPLOYMENT=admired-hornet-946\n' > "$tmp" && pnpm exec convex deploy --env-file "$tmp"; code=$?; rm -f "$tmp"; exit $code
```

Replace `admired-hornet-946` with your production deployment slug. Set production Convex env vars with `pnpm exec convex env set --prod KEY value`.

---

## Tech stack

| Layer | Technology |
|---|---|
| Frontend / SSR | TanStack Start, React 19, Vite 7, Nitro (cloudflare-module) |
| Styling | Tailwind CSS v4, shadcn/ui |
| Backend | Convex (queries, mutations, auth, email) |
| Auth | Better Auth via @convex-dev/better-auth |
| Email | Resend |
| Hosting | Cloudflare Workers + Assets |
| Package manager | pnpm |

---

## Environment variables reference

| Variable | Where | Required | Description |
|---|---|---|---|
| `VITE_CONVEX_URL` | `.env.local` / `.env.production` | Yes | Convex deployment URL |
| `VITE_CONVEX_SITE_URL` | `.env.local` / `.env.production` | Yes | Convex HTTP actions URL |
| `VITE_SITE_URL` | `.env.local` / `.env.production` | Yes | App origin (inlined at build) |
| `BETTER_AUTH_SECRET` | Convex env | Yes | Auth signing secret |
| `RESEND_API_KEY` | Convex env | Yes | Resend API key for emails |
| `SITE_URL` | Convex env | Yes | App origin for password reset links |
| `RESEND_FROM_EMAIL` | Convex env | No | Custom sender address |
