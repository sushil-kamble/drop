import { createClient } from "@convex-dev/better-auth"
import { convex } from "@convex-dev/better-auth/plugins"
import { betterAuth } from "better-auth"
import { query } from "./_generated/server"
import authConfig from "./auth.config"
import { components } from "./_generated/api"
import { sendPasswordResetEmail } from "./email"
import type { GenericCtx } from "@convex-dev/better-auth"
import type { DataModel } from "./_generated/dataModel"

const siteUrl = process.env.SITE_URL!

export const authComponent = createClient<DataModel>(components.betterAuth)

const LOCALHOST_ORIGIN_PATTERN = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i
const DEVELOPMENT_PORTS = [3000, 3001, 3010, 5173, 8787]

function isLocalDevelopmentOrigin(origin: string) {
  return LOCALHOST_ORIGIN_PATTERN.test(origin)
}

function getTrustedOrigins(request?: Request | null) {
  const origins = new Set<string>([siteUrl])

  if (process.env.NODE_ENV !== "production") {
    for (const host of ["localhost", "127.0.0.1"]) {
      for (const port of DEVELOPMENT_PORTS) {
        origins.add(`http://${host}:${port}`)
      }
    }

    const requestOrigin = request?.headers.get("origin")
    if (requestOrigin && isLocalDevelopmentOrigin(requestOrigin)) {
      origins.add(requestOrigin)
    }

    if (request?.url) {
      const urlOrigin = new URL(request.url).origin
      if (isLocalDevelopmentOrigin(urlOrigin)) {
        origins.add(urlOrigin)
      }
    }
  }

  return Array.from(origins)
}

export const createAuth = (ctx: GenericCtx<DataModel>) => {
  return betterAuth({
    baseURL: siteUrl,
    trustedOrigins: (request) => getTrustedOrigins(request),
    database: authComponent.adapter(ctx),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: false,
      autoSignIn: true,
      minPasswordLength: 8,
      revokeSessionsOnPasswordReset: true,
      sendResetPassword: async ({ user, url }) => {
        void sendPasswordResetEmail({
          to: user.email,
          resetUrl: url,
        }).catch((error: unknown) => {
          console.error("Could not send password reset email", error)
        })
      },
    },
    plugins: [convex({ authConfig })],
  })
}

export const getCurrentAuthUser = query({
  args: {},
  handler: async (ctx) => {
    return authComponent.getAuthUser(ctx)
  },
})
