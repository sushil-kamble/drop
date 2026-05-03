import * as React from "react"
import { createFileRoute, useRouter } from "@tanstack/react-router"
import { useConvexAuth, useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import { PageFrame, SiteHeader } from "@/components/site/layout"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export const Route = createFileRoute("/start")({
  component: StartRedirect,
})

function StartRedirect() {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useConvexAuth()
  const pages = useQuery(
    api.builders.listMyPages,
    isAuthenticated ? {} : "skip"
  )

  React.useEffect(() => {
    if (isLoading) {
      return
    }

    if (!isAuthenticated) {
      void router.navigate({ to: "/login", replace: true })
      return
    }

    if (!pages) {
      return
    }

    void router.navigate({
      to: pages.length > 0 ? "/drops" : "/drops/new",
      replace: true,
    })
  }, [isAuthenticated, isLoading, pages, router])

  return (
    <div className="min-h-svh">
      <SiteHeader />
      <PageFrame className="pt-8">
        <Card className="border border-foreground/10 bg-background/82">
          <CardContent className="py-8">
            <div className="flex flex-col gap-3">
              <Skeleton className="h-5 w-44" />
              <Skeleton className="h-4 w-64" />
            </div>
          </CardContent>
        </Card>
      </PageFrame>
    </div>
  )
}
