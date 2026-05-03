import { convexBetterAuthReactStart } from "@convex-dev/better-auth/react-start"
import { convexSiteUrl, convexUrl } from "./env"

export const {
  handler,
  getToken,
  fetchAuthQuery,
  fetchAuthMutation,
  fetchAuthAction,
} = convexBetterAuthReactStart({
  convexUrl: convexUrl(),
  convexSiteUrl: convexSiteUrl(),
})
