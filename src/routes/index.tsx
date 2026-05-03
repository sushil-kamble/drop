import {
  ArrowSquareOut,
  LockSimple,
  PaperPlaneTilt,
} from "@phosphor-icons/react"
import { Link, createFileRoute } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { HeroAction, PageFrame, SiteHeader } from "@/components/site/layout"

export const Route = createFileRoute("/")({
  component: LandingPage,
})

function LandingPage() {
  return (
    <div className="min-h-svh">
      <SiteHeader />

      <PageFrame className="flex flex-col gap-10 pt-8 sm:gap-16 sm:pt-12">
        <section className="flex flex-col gap-5 py-6 sm:py-10">
          <div className="flex max-w-4xl flex-col gap-4">
            <h1 className="max-w-4xl font-heading text-4xl leading-[0.96] tracking-[-0.02em] text-balance text-foreground sm:text-6xl lg:text-7xl">
              Drop anything you want to send.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
              Drop gives anyone a private page where people can send anonymous
              notes, requests, complaints, questions, or anything else that does
              not belong in a public feed.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <HeroAction to="/drops/new">Create page</HeroAction>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-11 px-4 text-sm sm:px-5"
            >
              <Link to="/drops">
                All pages
                <ArrowSquareOut data-icon="inline-end" />
              </Link>
            </Button>
          </div>
        </section>

        <section className="border border-foreground/10 bg-background/72">
          <div className="grid divide-y divide-foreground/8 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <FeatureHighlight
              title="Anonymous by default"
              description="People can send without a name or email."
            />
            <FeatureHighlight
              title="Private to the owner"
              description="Every drop lands in your private inbox."
            />
            <FeatureHighlight
              title="Many pages"
              description="Create separate pages for separate needs."
            />
          </div>
        </section>

        <section>
          <Card className="overflow-hidden border border-foreground/10 bg-background/80 backdrop-blur">
            <CardHeader className="border-b border-foreground/8">
              <CardTitle className="font-heading text-2xl">
                How it feels
              </CardTitle>
              <CardDescription>
                Lighter than a form. More private than a public post.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 pt-4 md:grid-cols-3">
              <PreviewBubble
                label="Public page"
                body="Drop anything you want to send. Anonymous and private."
              />
              <PreviewBubble
                label="Contributor"
                body="I meant to send this earlier. The handoff doc is missing the one thing everyone asks for."
              />
              <PreviewBubble
                label="Private inbox"
                body="The page owner reads it privately, saves it, and keeps the useful ones close."
              />
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-4 sm:grid-cols-3">
          <PrincipleCard
            icon={<LockSimple className="size-5" />}
            title="Private first"
            description="Privacy language is upfront. No name or email is required to send a drop."
          />
          <PrincipleCard
            icon={<PaperPlaneTilt className="size-5" />}
            title="Simple to send"
            description="One required message field. Extra details stay optional."
          />
          <PrincipleCard
            icon={<ArrowSquareOut className="size-5" />}
            title="Made for sharing"
            description="Create a page fast, share a clean link, and start receiving drops immediately."
          />
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <Card className="border border-foreground/10 bg-background/75">
            <CardHeader>
              <CardTitle className="font-heading text-2xl sm:text-3xl">
                For page owners
              </CardTitle>
              <CardDescription>
                A calm private inbox for whatever people need to send.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 text-sm leading-7 text-muted-foreground">
              <p>
                Create one page or many. Each page gets its own public link,
                private inbox, and lightweight states: new, saved, in progress,
                archived.
              </p>
              <Separator />
              <p>
                No public forum. No social layer to moderate. Just clean,
                page-specific inboxes you can actually keep up with.
              </p>
            </CardContent>
          </Card>

          <Card className="border border-foreground/10 bg-background/75">
            <CardHeader>
              <CardTitle className="font-heading text-2xl sm:text-3xl">
                For contributors
              </CardTitle>
              <CardDescription>
                A low-pressure place to send something real.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4 text-sm leading-7 text-muted-foreground">
              <p>
                Send a note, request, complaint, question, reminder, or
                something harder to phrase in public. It can be short, rough,
                and unfinished.
              </p>
              <Separator />
              <p>
                Each drop is private to the page owner. Submission is fast,
                mobile-first, and designed to feel personal instead of
                performative.
              </p>
            </CardContent>
          </Card>
        </section>
      </PageFrame>
    </div>
  )
}

function FeatureHighlight({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <div className="flex flex-col gap-2 p-4 sm:p-5">
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="text-sm leading-6 text-muted-foreground">{description}</p>
    </div>
  )
}

function PrincipleCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <Card className="border border-foreground/10 bg-background/72">
      <CardHeader className="gap-3">
        <div className="flex size-10 items-center justify-center border border-foreground/10 bg-foreground/4">
          {icon}
        </div>
        <CardTitle className="text-sm font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-sm leading-relaxed text-muted-foreground">
        {description}
      </CardContent>
    </Card>
  )
}

function PreviewBubble({ label, body }: { label: string; body: string }) {
  return (
    <div className="flex flex-col gap-1.5 border border-foreground/8 bg-foreground/2 p-3">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="text-sm leading-6 text-foreground/80">{body}</p>
    </div>
  )
}
