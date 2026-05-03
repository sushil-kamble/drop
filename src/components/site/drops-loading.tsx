import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { PageFrame, SiteHeader } from "@/components/site/layout"

export function DropsDashboardSkeleton() {
  return (
    <div className="min-h-svh">
      <SiteHeader />
      <PageFrame className="flex flex-col gap-6 pt-6">
        <Card className="border border-foreground/10 bg-background/82">
          <CardHeader>
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-1 h-8 w-80 sm:w-[28rem]" />
            <Skeleton className="mt-1 h-4 w-64" />
          </CardHeader>
        </Card>
        <div className="grid gap-4 lg:grid-cols-2">
          <PageCardSkeleton />
          <PageCardSkeleton />
        </div>
      </PageFrame>
    </div>
  )
}

function PageCardSkeleton() {
  return (
    <Card className="border border-foreground/10 bg-background/82">
      <CardHeader className="gap-3">
        <Skeleton className="h-7 w-56" />
        <div className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-3.5 w-32" />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex flex-col">
          <Skeleton className="mb-2 h-3.5 w-20" />
          {[1, 2].map((i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-4 border-b border-foreground/8 py-2 last:border-b-0"
            >
              <Skeleton className="h-4 min-w-0 flex-1" />
              <Skeleton className="h-3.5 w-24 shrink-0" />
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-7 w-24" />
          <Skeleton className="h-7 w-20" />
          <Skeleton className="h-7 w-24" />
        </div>
      </CardContent>
    </Card>
  )
}
