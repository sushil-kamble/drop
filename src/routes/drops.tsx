import * as React from "react"
import { useConvexAuth } from "convex/react"
import {
  Outlet,
  createFileRoute,
  useLocation,
  useRouter,
} from "@tanstack/react-router"
import { PageFrame, SiteHeader } from "@/components/site/layout"
import { DropsDashboardSkeleton } from "@/components/site/drops-loading"
import { PageInboxSkeleton } from "@/components/site/inbox-loading"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export const Route = createFileRoute("/drops")({
  component: DropsLayout,
})

function DropsLayout() {
  const router = useRouter()
  const location = useLocation()
  const { isAuthenticated, isLoading } = useConvexAuth()
  const isDashboardRoute = /^\/drops\/?$/.test(location.pathname)
  const isInboxRoute = /^\/drops\/[^/]+\/inbox\/?$/.test(location.pathname)

  React.useEffect(() => {
    if (isLoading || isAuthenticated) {
      return
    }

    void router.navigate({ to: "/login", replace: true })
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    if (isDashboardRoute) {
      return <DropsDashboardSkeleton />
    }

    if (isInboxRoute) {
      return <PageInboxSkeleton />
    }

    return (
      <div className="min-h-svh">
        <SiteHeader />
        <PageFrame className="pt-8">
          <Card className="border border-foreground/10 bg-background/82">
            <CardContent className="py-8">
              <div className="flex flex-col gap-4">
                <Skeleton className="h-6 w-56" />
                <Skeleton className="h-4 w-80" />
                <div className="mt-2 grid gap-4 sm:grid-cols-2">
                  <Skeleton className="h-32" />
                  <Skeleton className="h-32" />
                </div>
              </div>
            </CardContent>
          </Card>
        </PageFrame>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <Outlet />
}
