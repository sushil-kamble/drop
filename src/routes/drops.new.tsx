import * as React from "react"
import { useMutation } from "convex/react"
import { Link, createFileRoute, useRouter } from "@tanstack/react-router"
import { api } from "../../convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { FieldBlock, PageFrame, SiteHeader } from "@/components/site/layout"
import { pageProfileDefaults, pageProfileSchema } from "@/lib/validators"

export const Route = createFileRoute("/drops/new")({
  component: NewDropPage,
})

function NewDropPage() {
  const router = useRouter()
  const createDropPage = useMutation(api.builders.createPage)
  const [form, setForm] = React.useState(pageProfileDefaults)
  const [fieldErrors, setFieldErrors] = React.useState<
    Partial<Record<keyof typeof pageProfileDefaults, string>>
  >({})
  const [error, setError] = React.useState("")
  const [isPending, startTransition] = React.useTransition()

  return (
    <div className="min-h-svh">
      <SiteHeader
        rightSlot={
          <Button asChild variant="ghost" size="sm">
            <Link to="/drops">All pages</Link>
          </Button>
        }
      />
      <PageFrame className="pt-6 sm:pt-10">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,28rem)]">
          <Card className="border border-foreground/10 bg-background/84">
            <CardHeader>
              <p className="text-xs font-medium text-muted-foreground">
                New page
              </p>
              <CardTitle className="font-heading text-3xl sm:text-4xl">
                Create a private page in one short sitting.
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form
                className="flex flex-col gap-5"
                onSubmit={(event) => {
                  event.preventDefault()
                  setError("")
                  setFieldErrors({})

                  const parsed = pageProfileSchema.safeParse(form)
                  if (!parsed.success) {
                    const nextErrors: Partial<
                      Record<keyof typeof pageProfileDefaults, string>
                    > = {}

                    for (const issue of parsed.error.issues) {
                      const field = issue.path[0]
                      if (typeof field === "string" && !(field in nextErrors)) {
                        nextErrors[field as keyof typeof pageProfileDefaults] =
                          issue.message
                      }
                    }

                    setFieldErrors(nextErrors)
                    return
                  }

                  startTransition(async () => {
                    try {
                      const page = await createDropPage(parsed.data as any)
                      await router.navigate({
                        to: "/drops/$pageId/inbox",
                        params: { pageId: page._id },
                      })
                    } catch (submissionError) {
                      setError(
                        submissionError instanceof Error
                          ? submissionError.message
                          : "Could not create your page."
                      )
                    }
                  })
                }}
              >
                <FieldBlock
                  label="Page owner name"
                  hint="This is the name people will see on the page."
                >
                  <Input
                    value={form.displayName}
                    onChange={(event) => {
                      const displayName = event.target.value
                      setForm((current) => ({
                        ...current,
                        displayName,
                      }))
                      setFieldErrors((current) => ({
                        ...current,
                        displayName: undefined,
                      }))
                    }}
                    placeholder="Sushil"
                  />
                  {fieldErrors.displayName ? (
                    <p className="text-sm text-destructive" role="alert">
                      {fieldErrors.displayName}
                    </p>
                  ) : null}
                </FieldBlock>

                <FieldBlock
                  label="Headline"
                  hint="Tell people what kind of page this is."
                >
                  <Input
                    value={form.pageTitle}
                    onChange={(event) => {
                      setForm((current) => ({
                        ...current,
                        pageTitle: event.target.value,
                      }))
                      setFieldErrors((current) => ({
                        ...current,
                        pageTitle: undefined,
                      }))
                    }}
                  />
                  {fieldErrors.pageTitle ? (
                    <p className="text-sm text-destructive" role="alert">
                      {fieldErrors.pageTitle}
                    </p>
                  ) : null}
                </FieldBlock>

                <FieldBlock
                  label="Intro"
                  hint="Set the tone for what people can send here."
                >
                  <Textarea
                    rows={4}
                    value={form.intro}
                    onChange={(event) => {
                      setForm((current) => ({
                        ...current,
                        intro: event.target.value,
                      }))
                      setFieldErrors((current) => ({
                        ...current,
                        intro: undefined,
                      }))
                    }}
                  />
                  {fieldErrors.intro ? (
                    <p className="text-sm text-destructive" role="alert">
                      {fieldErrors.intro}
                    </p>
                  ) : null}
                </FieldBlock>

                <FieldBlock
                  label="Trust statement"
                  hint="Make privacy and visibility explicit."
                >
                  <Textarea
                    rows={3}
                    value={form.trustStatement}
                    onChange={(event) => {
                      setForm((current) => ({
                        ...current,
                        trustStatement: event.target.value,
                      }))
                      setFieldErrors((current) => ({
                        ...current,
                        trustStatement: undefined,
                      }))
                    }}
                  />
                  {fieldErrors.trustStatement ? (
                    <p className="text-sm text-destructive" role="alert">
                      {fieldErrors.trustStatement}
                    </p>
                  ) : null}
                </FieldBlock>

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
                  {isPending ? "Creating..." : "Create page"}
                </Button>
              </form>
            </CardContent>
          </Card>

          <Card className="border border-foreground/10 bg-foreground/3">
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 text-sm text-muted-foreground">
              <p className="text-xs leading-6 text-muted-foreground">
                The page link is generated automatically when the page is
                created. It is not based on the page owner name and may use a
                short random ID.
              </p>
              <div className="border border-foreground/10 bg-background/82 p-4">
                <p className="text-xs font-medium text-muted-foreground">
                  Public page
                </p>
                <h2 className="pt-3 font-heading text-3xl leading-tight">
                  {form.pageTitle}
                </h2>
                <p className="pt-3 leading-7">{form.intro}</p>
                <p className="pt-4 text-sm font-medium text-foreground">
                  {form.trustStatement}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </PageFrame>
    </div>
  )
}
