import * as React from "react"
import { useMutation, useQuery } from "convex/react"
import { ArrowLeft, ArrowSquareOut, LinkSimple } from "@phosphor-icons/react"
import { Link, createFileRoute } from "@tanstack/react-router"
import { api } from "../../convex/_generated/api"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { PageFrame, SiteHeader } from "@/components/site/layout"
import { PageInboxSkeleton } from "@/components/site/inbox-loading"
import { formatLocalDateTime } from "@/lib/dates"
import { buildShareUrl } from "@/lib/product"
import { siteUrl } from "@/lib/env"

export const Route = createFileRoute("/drops/$pageId/inbox")({
  component: PageInbox,
})

function PageInbox() {
  const { pageId } = Route.useParams()
  const data = useQuery(api.builders.getPageInbox, { pageId } as any)
  const markVisited = useMutation(api.builders.recordPageInboxVisit)
  const [selectedId, setSelectedId] = React.useState<string | null>(null)
  const [mobileShowDetail, setMobileShowDetail] = React.useState(false)
  const visitedPageIdRef = React.useRef<string | null>(null)
  const shareUrl = data ? buildShareUrl(siteUrl(), data.page.slug) : ""
  const selected = data
    ? data.submissions.find((submission) => submission._id === selectedId) ||
      data.submissions[0]
    : null

  const loadedPageId = data?.page._id ?? null
  React.useEffect(() => {
    if (!loadedPageId) {
      return
    }
    if (visitedPageIdRef.current === loadedPageId) {
      return
    }
    visitedPageIdRef.current = loadedPageId
    void markVisited({ pageId: loadedPageId } as any)
  }, [loadedPageId, markVisited])

  React.useEffect(() => {
    if (!data) {
      return
    }

    if (!selectedId && data.submissions[0]) {
      setSelectedId(data.submissions[0]._id)
    }
  }, [data, selectedId])

  if (!data) {
    return <PageInboxSkeleton />
  }

  if (!selected) {
    return (
      <div className="min-h-svh">
        <SiteHeader />
        <PageFrame className="flex flex-col gap-4 pt-6">
          <InboxBackButton />
          <InboxHeaderCard data={data} shareUrl={shareUrl} />
          <Card className="border border-foreground/10 bg-background/82">
            <CardHeader>
              <CardTitle className="font-heading text-2xl sm:text-3xl">
                This inbox is still empty.
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 text-sm text-muted-foreground">
              <p>Share the page and invite anything worth sending through:</p>
              <ul className="flex list-disc flex-col gap-2 pl-5">
                <li>A request someone has been meaning to send.</li>
                <li>
                  A note, complaint, or question they would rather share
                  privately.
                </li>
                <li>
                  A short message that does not fit a public post or a long DM.
                </li>
              </ul>
            </CardContent>
          </Card>
        </PageFrame>
      </div>
    )
  }

  return (
    <div className="min-h-svh">
      <SiteHeader />

      <PageFrame className="flex flex-col gap-4 pt-6">
        <InboxBackButton />
        <InboxHeaderCard data={data} shareUrl={shareUrl} />

        <section className="grid gap-4 xl:grid-cols-[20rem_minmax(0,1fr)]">
          <div
            className={`flex flex-col gap-2 ${mobileShowDetail ? "hidden xl:flex" : ""}`}
          >
            {data.submissions.map((submission) => {
              const active = submission._id === selected._id
              return (
                <button
                  key={submission._id}
                  type="button"
                  className={`flex flex-col gap-2 border p-3 text-left transition-colors duration-150 ${
                    active
                      ? "border-foreground/20 bg-foreground/5"
                      : "border-foreground/8 bg-background/72 hover:border-foreground/14 hover:bg-foreground/2"
                  }`}
                  onClick={() => {
                    setSelectedId(submission._id)
                    setMobileShowDetail(true)
                  }}
                >
                  <p className="line-clamp-3 text-sm leading-6 text-foreground/80">
                    {submission.problem}
                  </p>
                  <span className="text-[11px] text-muted-foreground italic">
                    {formatLocalDateTime(submission.submittedAt)}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Detail panel — full width on mobile when shown, always visible on xl */}
          <Card
            className={`border border-foreground/10 bg-background/82 ${!mobileShowDetail ? "hidden xl:flex xl:flex-col" : ""}`}
          >
            <CardHeader className="gap-4">
              {/* Back button: mobile only */}
              <Button
                variant="ghost"
                size="sm"
                className="w-fit xl:hidden"
                onClick={() => setMobileShowDetail(false)}
              >
                <ArrowLeft data-icon="inline-start" />
                Back to list
              </Button>
            </CardHeader>
            <CardContent className="flex flex-col gap-5 text-sm leading-7 text-foreground/80">
              <section>
                <p className="text-xs font-medium text-muted-foreground">
                  Message
                </p>
                <p className="pt-2 text-base leading-8">{selected.problem}</p>
              </section>
              <Separator />
              <section>
                <p className="text-xs font-medium text-muted-foreground">
                  Details
                </p>
                <p className="pt-2">
                  {selected.context || "No extra details were added."}
                </p>
              </section>
              <CardDescription className="text-[11px] italic">
                {formatLocalDateTime(selected.submittedAt)}
              </CardDescription>
            </CardContent>
          </Card>
        </section>
      </PageFrame>
    </div>
  )
}

function InboxBackButton() {
  return (
    <Button asChild variant="ghost" size="sm" className="w-fit px-0">
      <Link to="/drops">
        <ArrowLeft data-icon="inline-start" />
        Back to all pages
      </Link>
    </Button>
  )
}

function InboxHeaderCard({
  data,
  shareUrl,
}: {
  data: {
    page: { pageTitle: string; intro: string; slug: string }
    submissions: Array<unknown>
    hiddenCount: number
  }
  shareUrl: string
}) {
  return (
    <section className="flex flex-wrap items-center gap-x-10 gap-y-3 border border-foreground/10 bg-background/72 px-4 py-3">
      <div className="min-w-[16rem] flex-1">
        <p className="truncate text-sm font-medium text-foreground/88">
          {data.page.pageTitle}
        </p>
        <p className="line-clamp-2 max-w-3xl text-xs leading-5 text-muted-foreground">
          {data.page.intro}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        <div className="flex h-7 items-center gap-1 border-r border-foreground/10 pr-3 text-sm text-foreground/80">
          <span className="font-medium text-foreground">
            {data.submissions.length}
          </span>
          <span>visible drops</span>
        </div>
        <div className="flex h-7 items-center gap-1 border-r border-foreground/10 pr-3 text-sm text-foreground/80">
          <span className="font-medium text-foreground">
            {data.hiddenCount}
          </span>
          <span>hidden</span>
        </div>
        <Button asChild variant="outline" size="sm">
          <a href={shareUrl} target="_blank" rel="noreferrer">
            <ArrowSquareOut data-icon="inline-start" />
            <span className="hidden sm:inline">Open public page</span>
            <span className="sm:hidden">Open</span>
          </a>
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={async () => {
            await navigator.clipboard.writeText(shareUrl)
          }}
        >
          <LinkSimple data-icon="inline-start" />
          Copy link
        </Button>
      </div>
    </section>
  )
}
