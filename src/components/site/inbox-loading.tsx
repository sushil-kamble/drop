import { Link } from "@tanstack/react-router"
import { ArrowLeft } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { PageFrame, SiteHeader } from "@/components/site/layout"

export function PageInboxSkeleton() {
  return (
    <div className="min-h-svh">
      <SiteHeader />
      <PageFrame className="flex flex-col gap-4 pt-6">
        <InboxSkeletonBackButton />
        <section className="flex flex-wrap items-center gap-x-10 gap-y-3 border border-foreground/10 bg-background/72 px-4 py-3">
          <div className="min-w-[16rem] flex-1">
            <Skeleton className="h-5 w-64 max-w-full" />
            <Skeleton className="mt-2 h-4 w-full max-w-3xl" />
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="flex h-7 items-center gap-1 border-r border-foreground/10 pr-3">
              <Skeleton className="h-4 w-24" />
            </div>
            <div className="flex h-7 items-center gap-1 border-r border-foreground/10 pr-3">
              <Skeleton className="h-4 w-16" />
            </div>
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-8 w-24" />
          </div>
        </section>
        <div className="grid gap-4 xl:grid-cols-[20rem_minmax(0,1fr)]">
          <div className="flex flex-col gap-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="border border-foreground/8 bg-background/72 p-3"
              >
                <Skeleton className="h-4 w-full" />
                <Skeleton className="mt-2 h-4 w-5/6" />
                <Skeleton className="mt-2 h-3.5 w-28" />
              </div>
            ))}
          </div>
          <Card className="hidden border border-foreground/10 bg-background/82 xl:flex xl:flex-col">
            <CardHeader className="gap-4">
              <div className="h-8 xl:hidden" />
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <section>
                <Skeleton className="h-4 w-16" />
                <Skeleton className="mt-3 h-5 w-full" />
                <Skeleton className="mt-3 h-5 w-5/6" />
                <Skeleton className="mt-3 h-5 w-2/3" />
              </section>
              <div className="h-px bg-foreground/10" />
              <section>
                <Skeleton className="h-4 w-16" />
                <Skeleton className="mt-3 h-4 w-full" />
                <Skeleton className="mt-3 h-4 w-3/4" />
              </section>
              <Skeleton className="h-3.5 w-28" />
            </CardContent>
          </Card>
        </div>
      </PageFrame>
    </div>
  )
}

function InboxSkeletonBackButton() {
  return (
    <Button asChild variant="ghost" size="sm" className="w-fit px-0">
      <Link to="/drops">
        <ArrowLeft data-icon="inline-start" />
        Back to all pages
      </Link>
    </Button>
  )
}
