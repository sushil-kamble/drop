import { createFileRoute } from "@tanstack/react-router"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { PageFrame, SiteHeader } from "@/components/site/layout"

export const Route = createFileRoute("/terms")({
  component: TermsPage,
})

function TermsPage() {
  return (
    <div className="min-h-svh">
      <SiteHeader />
      <PageFrame className="pt-8">
        <Card className="max-w-3xl border border-foreground/10 bg-background/82">
          <CardHeader>
            <CardTitle className="font-heading text-4xl">Terms</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 text-sm leading-7 text-foreground/72">
            <p>
              Drop is intended for respectful, lawful use. Page owners can hide
              abusive, irrelevant, or spammy submissions from their inbox.
            </p>
            <p>
              The service is provided as-is during MVP. Page owners decide how to use
              the submissions they receive.
            </p>
          </CardContent>
        </Card>
      </PageFrame>
    </div>
  )
}
