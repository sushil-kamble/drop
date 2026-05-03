import * as React from "react"
import { useMutation, useQuery } from "convex/react"
import { LockSimple, ShieldCheck } from "@phosphor-icons/react"
import { createFileRoute } from "@tanstack/react-router"
import { api } from "../../convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { NotFoundView } from "@/components/site/not-found"
import { PublicPageSkeleton } from "@/components/site/public-page-loading"
import { FieldBlock, PageFrame, SiteHeader } from "@/components/site/layout"

export const Route = createFileRoute("/$slug")({
  component: PublicPage,
})

function PublicPage() {
  const { slug } = Route.useParams()
  const page = useQuery(api.builders.getPublicPage, { slug })
  const trackPublicEvent = useMutation(api.telemetry.recordPublicEvent)
  const [step, setStep] = React.useState<"form" | "done">("form")
  const [message, setMessage] = React.useState("")
  const [details, setDetails] = React.useState("")
  const [error, setError] = React.useState("")
  const [isPending, startTransition] = React.useTransition()
  const startedTracking = React.useRef(false)

  React.useEffect(() => {
    if (!page) {
      return
    }

    void trackPublicEvent({
      slug: page.slug,
      kind: "public_page_view",
    })
  }, [page, trackPublicEvent])

  if (page === undefined) {
    return <PublicPageSkeleton />
  }

  if (!page) {
    return <NotFoundView />
  }

  return (
    <div className="min-h-svh">
      <SiteHeader />
      <PageFrame className="grid gap-8 pt-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <section className="flex flex-col gap-6">
          <div className="max-w-2xl border border-foreground/10 bg-background/65 px-4 py-3 text-sm leading-6 text-foreground/78">
            <p className="font-medium text-foreground">
              You are sending this anonymously to {page.ownerDisplayName}.
            </p>
            <p>{page.trustStatement}</p>
          </div>

          <Card className="border border-foreground/10 bg-background/82">
            <CardHeader>
              <CardTitle className="font-heading text-3xl sm:text-4xl">
                {step === "form" ? page.title : "Dropped."}
              </CardTitle>
              {step === "form" ? (
                <p className="max-w-3xl text-sm leading-6 text-foreground/72">
                  {page.intro}
                </p>
              ) : null}
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              {step === "form" ? (
                <form
                  className="flex flex-col gap-5"
                  onSubmit={(event) => {
                    event.preventDefault()
                    setError("")

                    startTransition(async () => {
                      const response = await fetch("/api/drops", {
                        method: "POST",
                        headers: {
                          "content-type": "application/json",
                        },
                        body: JSON.stringify({
                          slug: page.slug,
                          message,
                          details,
                        }),
                      })

                      const payload = (await response.json()) as {
                        error?: string
                      }
                      if (!response.ok) {
                        setError(payload.error ?? "Could not send your drop.")
                        return
                      }

                      setMessage("")
                      setDetails("")
                      setStep("done")
                    })
                  }}
                >
                  <FieldBlock
                    label="Your answer"
                    hint="A short message is enough. You do not need to phrase it perfectly."
                  >
                    <Textarea
                      required
                      rows={5}
                      value={message}
                      onFocus={() => {
                        if (startedTracking.current) {
                          return
                        }

                        startedTracking.current = true
                        void trackPublicEvent({
                          slug: page.slug,
                          kind: "submission_started",
                        })
                      }}
                      onChange={(event) => setMessage(event.target.value)}
                      placeholder="Example: I meant to tell you this earlier, but the signup flow was confusing on mobile."
                    />
                  </FieldBlock>

                  <FieldBlock
                    label="Add details if you want"
                    hint="Anything extra that would help explain it."
                  >
                    <Textarea
                      rows={4}
                      value={details}
                      onChange={(event) => setDetails(event.target.value)}
                      placeholder="Optional"
                    />
                  </FieldBlock>

                  <p className="text-xs text-muted-foreground">
                    {page.trustStatement}
                  </p>

                  {error ? (
                    <p className="text-sm text-destructive" role="alert">
                      {error}
                    </p>
                  ) : null}

                  <Button
                    type="submit"
                    size="lg"
                    className="h-11"
                    disabled={isPending}
                  >
                    {isPending ? "Dropping..." : "Send anonymously"}
                  </Button>
                </form>
              ) : null}

              {step === "done" ? (
                <div className="flex flex-col gap-5">
                  <p className="text-sm leading-7 text-foreground/72">
                    This was sent anonymously. Only {page.ownerDisplayName} can
                    see it. Thanks for sending it through.
                  </p>
                  <Button
                    size="lg"
                    className="h-11 w-fit"
                    onClick={() => setStep("form")}
                  >
                    Submit another drop
                  </Button>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </section>

        <aside className="flex flex-col gap-4">
          <Card className="border border-foreground/10 bg-foreground/3">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <ShieldCheck className="size-5" />
                Trust notes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-2 text-sm leading-6 text-foreground/72">
                <li className="border border-foreground/10 bg-background/50 px-3 py-2">
                  {page.trustStatement}
                </li>
                <li className="border border-foreground/10 bg-background/50 px-3 py-2">
                  No account required.
                </li>
                <li className="border border-foreground/10 bg-background/50 px-3 py-2">
                  Multiple drops are welcome, even if they overlap or come in
                  short bursts.
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border border-foreground/10 bg-foreground/3">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <LockSimple className="size-5" />
                Why this exists
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-7 text-foreground/72">
              {page.intro}
            </CardContent>
          </Card>
        </aside>
      </PageFrame>
    </div>
  )
}
