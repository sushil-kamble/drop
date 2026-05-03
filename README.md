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
configuration. Set this Convex environment variable before using the reset flow:

```bash
npx convex env set RESEND_API_KEY re_your_key
```

By default, emails are sent from Resend's default sender. Set `RESEND_FROM_EMAIL`
only if you want to use a verified custom sender.

The reset links use `SITE_URL`, so keep that value pointed at the current app
origin for local development and production.
