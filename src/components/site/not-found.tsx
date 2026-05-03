import { Link } from "@tanstack/react-router"
import { PageFrame, SiteHeader } from "./layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function NotFoundView({
  title = "That page doesn’t exist.",
  description = "If you followed an old link, the page may have moved or been unpublished.",
}: {
  title?: string
  description?: string
}) {
  return (
    <div className="min-h-svh">
      <SiteHeader />
      <PageFrame className="pt-8">
        <Card className="max-w-xl border border-foreground/10 bg-background/80">
          <CardHeader>
            <CardTitle className="font-heading text-3xl">{title}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <p className="max-w-lg text-sm text-muted-foreground">{description}</p>
            <Button asChild className="w-fit">
              <Link to="/">Return home</Link>
            </Button>
          </CardContent>
        </Card>
      </PageFrame>
    </div>
  )
}
