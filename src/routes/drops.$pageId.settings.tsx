import * as React from "react"
import { useMutation, useQuery } from "convex/react"
import { ArrowSquareOut, Tray } from "@phosphor-icons/react"
import { Link, createFileRoute } from "@tanstack/react-router"
import { api } from "../../convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FieldBlock, PageFrame, SiteHeader } from "@/components/site/layout"
import { buildShareUrl } from "@/lib/product"
import { siteUrl } from "@/lib/env"

export const Route = createFileRoute("/drops/$pageId/settings")({
  component: PageSettings,
})

function PageSettings() {
  const { pageId } = Route.useParams()
  const page = useQuery(api.builders.getPageSettings, { pageId } as any)
  const savePage = useMutation(api.builders.updatePage)
  const [form, setForm] = React.useState({
    pageId,
    displayName: "",
    pageTitle: "",
    intro: "",
    trustStatement: "",
  })
  const [error, setError] = React.useState("")
  const [saved, setSaved] = React.useState(false)
  const [isPending, startTransition] = React.useTransition()
  const shareUrl = buildShareUrl(siteUrl(), page.slug)

  React.useEffect(() => {
    if (!page) {
      return
    }

    setForm({
      pageId: page._id,
      displayName: page.displayName,
      pageTitle: page.pageTitle,
      intro: page.intro,
      trustStatement: page.trustStatement,
    })
  }, [page])

  if (!page) {
    return (
      <div className="min-h-svh">
        <SiteHeader />
        <PageFrame className="pt-8">
          <Card className="border border-foreground/10 bg-background/82">
            <CardContent className="py-10 text-sm text-foreground/70">
              Loading settings...
            </CardContent>
          </Card>
        </PageFrame>
      </div>
    )
  }

  return (
    <div className="min-h-svh">
      <SiteHeader
        rightSlot={
          <Button asChild variant="ghost" size="sm">
            <Link to="/drops/$pageId/inbox" params={{ pageId: page._id }}>
              <Tray data-icon="inline-start" />
              Inbox
            </Link>
          </Button>
        }
      />

      <PageFrame className="grid gap-6 pt-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <Card className="border border-foreground/10 bg-background/82">
          <CardHeader>
            <CardTitle className="font-heading text-4xl">
              Page settings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              className="flex flex-col gap-5"
              onSubmit={(event) => {
                event.preventDefault()
                setError("")
                setSaved(false)

                startTransition(async () => {
                  try {
                    await savePage(form as any)
                    setSaved(true)
                  } catch (submissionError) {
                    setError(
                      submissionError instanceof Error
                        ? submissionError.message
                        : "Could not save this page."
                    )
                  }
                })
              }}
            >
              <FieldBlock label="Page owner name">
                <Input
                  value={form.displayName}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      displayName: event.target.value,
                    }))
                  }
                />
              </FieldBlock>

              <FieldBlock label="Headline">
                <Input
                  value={form.pageTitle}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      pageTitle: event.target.value,
                    }))
                  }
                />
              </FieldBlock>

              <FieldBlock label="Intro">
                <Textarea
                  rows={4}
                  value={form.intro}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      intro: event.target.value,
                    }))
                  }
                />
              </FieldBlock>

              <FieldBlock label="Trust statement">
                <Textarea
                  rows={3}
                  value={form.trustStatement}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      trustStatement: event.target.value,
                    }))
                  }
                />
              </FieldBlock>

              {error ? (
                <p className="text-sm text-destructive" role="alert">
                  {error}
                </p>
              ) : null}

              {saved ? (
                <p className="text-sm text-foreground/70">Saved.</p>
              ) : null}

              <Button
                type="submit"
                size="lg"
                className="h-11"
                disabled={isPending}
              >
                {isPending ? "Saving..." : "Save changes"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border border-foreground/10 bg-foreground/3">
          <CardHeader>
            <CardTitle>Shareable link</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 text-sm text-foreground/72">
            <p className="break-all">{shareUrl}</p>
            <Button asChild variant="outline" size="sm" className="w-fit">
              <a href={shareUrl} target="_blank" rel="noreferrer">
                <ArrowSquareOut data-icon="inline-start" />
                Open page
              </a>
            </Button>
          </CardContent>
        </Card>
      </PageFrame>
    </div>
  )
}
