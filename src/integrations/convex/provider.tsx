import { ConvexBetterAuthProvider } from "@convex-dev/better-auth/react"
import { ConvexReactClient } from "convex/react"
import { authClient } from "@/lib/auth-client"
import { convexUrl } from "@/lib/env"

const convex = new ConvexReactClient(convexUrl(), {
  unsavedChangesWarning: false,
})

export default function AppConvexProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ConvexBetterAuthProvider client={convex} authClient={authClient}>
      {children}
    </ConvexBetterAuthProvider>
  )
}
