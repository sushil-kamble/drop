import { LinkSimple } from "@phosphor-icons/react"
import * as React from "react"
import { Link, createFileRoute, useRouter } from "@tanstack/react-router"
import { useQuery } from "convex/react"
import { api } from "../../convex/_generated/api"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { PageFrame, SiteHeader } from "@/components/site/layout"
import { DropsDashboardSkeleton } from "@/components/site/drops-loading"
import { formatLocalDateTime } from "@/lib/dates"
import { siteUrl } from "@/lib/env"
import { buildShareUrl } from "@/lib/product"

export const Route = createFileRoute("/drops/")({
  component: DropsDashboardPage,
})

function DropsDashboardPage() {
  const router = useRouter()
  const pages = useQuery(api.builders.listMyPages, {})
  const [copiedPageId, setCopiedPageId] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (pages && pages.length === 0) {
      void router.navigate({ to: "/drops/new", replace: true })
    }
  }, [pages, router])

  if (!pages) {
    return <DropsDashboardSkeleton />
  }

  return (
    <div className="min-h-svh">
      <SiteHeader />

      <PageFrame className="flex flex-col gap-6 pt-6">
        <Card className="border border-foreground/10 bg-background/82">
          <CardHeader>
            <p className="text-xs font-medium text-muted-foreground">
              Your pages
            </p>
            <CardTitle className="font-heading text-2xl leading-tight sm:text-3xl">
              Private pages for anything people want to send.
            </CardTitle>
          </CardHeader>
        </Card>

        <section className="grid gap-4 lg:grid-cols-2">
          {pages.map((page) => {
            const shareUrl = buildShareUrl(siteUrl(), page.slug)

            return (
              <Card
                key={page._id}
                role="link"
                tabIndex={0}
                className="cursor-pointer border border-foreground/10 bg-background/82 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-foreground/20 hover:bg-foreground/[0.025] hover:shadow-[0_14px_36px_rgba(49,34,24,0.08)] focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
                onClick={() => {
                  void router.navigate({
                    to: "/drops/$pageId/inbox",
                    params: { pageId: page._id },
                  })
                }}
                onKeyDown={(event) => {
                  if (event.key !== "Enter" && event.key !== " ") {
                    return
                  }

                  event.preventDefault()
                  void router.navigate({
                    to: "/drops/$pageId/inbox",
                    params: { pageId: page._id },
                  })
                }}
              >
                <CardHeader className="gap-3">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle className="font-heading text-xl leading-tight sm:text-2xl">
                        {page.pageTitle}
                      </CardTitle>
                    </div>
                  </div>
                  <CardDescription className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
                    <span>
                      {page.visibleCount} visible drops, {page.hiddenCount}{" "}
                      hidden
                    </span>
                    {page.lastSubmissionAt ? (
                      <span className="text-[11px] italic">
                        last activity{" "}
                        {formatLocalDateTime(page.lastSubmissionAt)}
                      </span>
                    ) : (
                      <span>no submissions yet</span>
                    )}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  <p className="line-clamp-3 text-sm leading-6 text-foreground/76">
                    {page.intro}
                  </p>
                  {page.recentSubmissions.length > 0 ? (
                    <div className="flex flex-col">
                      <p className="text-xs font-medium text-muted-foreground">
                        Recent drops
                      </p>
                      {page.recentSubmissions.map(
                        (submission: {
                          _id: string
                          problem: string
                          submittedAt: number
                        }) => (
                          <div
                            key={submission._id}
                            className="flex items-center justify-between gap-4 border-b border-foreground/8 py-2 last:border-b-0"
                          >
                            <p className="min-w-0 flex-1 truncate text-sm leading-6 text-foreground/80">
                              {submission.problem}
                            </p>
                            <p className="shrink-0 text-[11px] text-muted-foreground italic">
                              {formatLocalDateTime(submission.submittedAt)}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  ) : null}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      asChild
                      size="sm"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <Link
                        to="/drops/$pageId/inbox"
                        params={{ pageId: page._id }}
                      >
                        Open inbox
                      </Link>
                    </Button>
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      onClick={(event) => event.stopPropagation()}
                    >
                      <Link
                        to="/drops/$pageId/settings"
                        params={{ pageId: page._id }}
                      >
                        Edit page
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={async (event) => {
                        event.stopPropagation()
                        await navigator.clipboard.writeText(shareUrl)
                        setCopiedPageId(page._id)
                        window.setTimeout(() => setCopiedPageId(null), 1800)
                      }}
                    >
                      <LinkSimple data-icon="inline-start" />
                      {copiedPageId === page._id ? "Copied" : "Share link"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </section>
      </PageFrame>
    </div>
  )
}
