import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { PageFrame, SiteHeader } from "@/components/site/layout"

export function PublicPageSkeleton() {
  return (
    <div className="min-h-svh">
      <SiteHeader />
      <PageFrame className="grid gap-8 pt-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <section className="flex flex-col gap-6">
          <div className="max-w-2xl border border-foreground/10 bg-background/65 px-4 py-3">
            <Skeleton className="h-4 w-72 max-w-full" />
            <Skeleton className="mt-2 h-4 w-96 max-w-full" />
          </div>

          <Card className="border border-foreground/10 bg-background/82">
            <CardHeader>
              <Skeleton className="h-9 w-80 max-w-full" />
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-5">
                <FieldSkeleton rows={5} wide />
                <FieldSkeleton rows={4} />
                <Skeleton className="h-4 w-96 max-w-full" />
                <Skeleton className="h-11 w-full" />
              </div>
            </CardContent>
          </Card>
        </section>

        <aside className="flex flex-col gap-4">
          <Card className="border border-foreground/10 bg-foreground/3">
            <CardHeader className="pb-3">
              <div className="flex items-center gap-2">
                <Skeleton className="size-5" />
                <Skeleton className="h-5 w-24" />
              </div>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-2">
                {[1, 2, 3].map((i) => (
                  <li
                    key={i}
                    className="border border-foreground/10 bg-background/50 px-3 py-2"
                  >
                    <Skeleton className="h-4 w-full" />
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border border-foreground/10 bg-foreground/3">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Skeleton className="size-5" />
                <Skeleton className="h-5 w-32" />
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="mt-3 h-4 w-full" />
              <Skeleton className="mt-3 h-4 w-3/4" />
            </CardContent>
          </Card>
        </aside>
      </PageFrame>
    </div>
  )
}

function FieldSkeleton({
  rows,
  wide = false,
}: {
  rows: number
  wide?: boolean
}) {
  return (
    <div className="flex flex-col gap-2">
      <Skeleton className={wide ? "h-4 w-56" : "h-4 w-40"} />
      <Skeleton className={rows === 5 ? "h-32 w-full" : "h-28 w-full"} />
      <Skeleton className={wide ? "h-3.5 w-96 max-w-full" : "h-3.5 w-64"} />
    </div>
  )
}
