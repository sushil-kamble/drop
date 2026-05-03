import * as React from "react"
import { useConvexAuth } from "convex/react"
import { createFileRoute, useRouter } from "@tanstack/react-router"
import { PageFrame, SiteHeader } from "@/components/site/layout"
import { Card, CardContent } from "@/components/ui/card"

export const Route = createFileRoute("/inbox")({
  component: InboxRedirect,
})

function InboxRedirect() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useConvexAuth()

  React.useEffect(() => {
    if (isLoading) {
      return
    }

    void router.navigate({
      to: isAuthenticated ? "/drops" : "/login",
      replace: true,
    })
  }, [isAuthenticated, isLoading, router])

  return (
    <div className="min-h-svh">
      <SiteHeader />
      <PageFrame className="pt-8">
        <Card className="border border-foreground/10 bg-background/82">
          <CardContent className="py-10 text-sm text-foreground/70">
            Opening your pages...
          </CardContent>
        </Card>
      </PageFrame>
    </div>
  )
}
