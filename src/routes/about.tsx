import { ArrowSquareOut } from "@phosphor-icons/react"
import { createFileRoute } from "@tanstack/react-router"
import { Separator } from "@/components/ui/separator"
import { PageFrame, SiteHeader } from "@/components/site/layout"

export const Route = createFileRoute("/about")({
  component: AboutPage,
})

function AboutPage() {
  return (
    <div className="min-h-svh">
      <SiteHeader />
      <PageFrame className="pt-8 sm:pt-14">
        <div className="flex max-w-2xl flex-col gap-12">
          <div className="flex flex-col gap-4">
            <h1 className="font-heading text-4xl leading-[0.96] tracking-[-0.02em] text-foreground sm:text-5xl">
              About Drop
            </h1>
            <p className="text-base leading-7 text-muted-foreground">
              A private inbox for the feedback people won't say out loud.
            </p>
          </div>

          <Separator className="opacity-40" />

          <div className="flex flex-col gap-4">
            <h2 className="font-heading text-xl text-foreground">
              What it is
            </h2>
            <div className="flex flex-col gap-3 text-sm leading-7 text-muted-foreground">
              <p>
                Drop gives you a dedicated page where anyone can send an
                anonymous note, question, complaint, or request. No account
                required for the sender. No public thread. No social layer.
              </p>
              <p>
                The most useful feedback is often the kind people won't put
                their name on. Drop removes the friction and the visibility so
                you get the real message.
              </p>
            </div>
          </div>

          <Separator className="opacity-40" />

          <div className="flex flex-col gap-6">
            <h2 className="font-heading text-xl text-foreground">Made by</h2>
            <div className="grid gap-3 sm:grid-cols-3">
              <AttributionCard
                label="Creator"
                value="Sushil Kamble"
                href="https://github.com/sushil-kamble/"
              />
              <AttributionCard
                label="Source"
                value="sushil-kamble/drop"
                href="https://github.com/sushil-kamble/drop"
              />
              <AttributionCard
                label="Part of"
                value="1cc.in"
                href="https://www.1cc.in/"
              />
            </div>
          </div>
        </div>
      </PageFrame>
    </div>
  )
}

function AttributionCard({
  label,
  value,
  href,
}: {
  label: string
  value: string
  href: string
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col gap-2 border border-foreground/10 bg-background/72 p-4 transition-colors hover:border-foreground/20 hover:bg-background/90"
    >
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="flex items-center gap-1.5 text-sm font-medium text-foreground">
        {value}
        <ArrowSquareOut className="size-3.5 opacity-0 transition-opacity group-hover:opacity-60" />
      </p>
    </a>
  )
}
