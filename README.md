# Drop

## Local development

Run both the Convex dev process and the TanStack client together:

```bash
pnpm dev
```

This starts:

- `pnpm dev:server` -> `convex dev`
- `pnpm dev:client` -> `vite dev --port 3000`

The Convex dev process uses the deployment configured in [`.env.local`](./.env.local), which is currently `dev:giddy-salmon-79`.

## Password reset emails

Password reset emails are sent through Resend from the Better Auth server
configuration. Set these Convex environment variables before using the reset
flow:

```bash
npx convex env set RESEND_API_KEY re_your_key
npx convex env set RESEND_FROM_EMAIL "Drop <no-reply@your-domain.com>"
```

The reset links use `SITE_URL`, so keep that value pointed at the current app
origin for local development and production.
