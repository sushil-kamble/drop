import * as React from "react"
import { Link, createFileRoute } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { FieldBlock, PageFrame, SiteHeader } from "@/components/site/layout"
import { authClient } from "@/lib/auth-client"
import { siteUrl } from "@/lib/env"
import { emailSchema } from "@/lib/validators"

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPasswordPage,
})

function ForgotPasswordPage() {
  const [email, setEmail] = React.useState("")
  const [error, setError] = React.useState("")
  const [isSubmitted, setIsSubmitted] = React.useState(false)
  const [isPending, startTransition] = React.useTransition()

  return (
    <div className="min-h-svh">
      <SiteHeader />
      <PageFrame className="flex justify-center pt-8 sm:pt-12">
        <Card className="w-full max-w-xl border border-foreground/10 bg-background/82">
          <CardHeader>
            <CardTitle className="font-heading text-3xl sm:text-4xl">
              Reset your password.
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            {isSubmitted ? (
              <>
                <p className="text-sm leading-7 text-muted-foreground">
                  If a Drop account exists for that email, we sent a password
                  reset link. The link will take you back here to choose a new
                  password.
                </p>
                <Button asChild size="lg" className="h-11">
                  <Link to="/login">Back to login</Link>
                </Button>
              </>
            ) : (
              <>
                <p className="text-sm leading-7 text-muted-foreground">
                  Enter the email attached to your Drop account and we will send
                  reset instructions.
                </p>
                <form
                  className="flex flex-col gap-4"
                  onSubmit={(event) => {
                    event.preventDefault()
                    setError("")

                    const parsed = emailSchema.safeParse({ email })
                    if (!parsed.success) {
                      setError(
                        parsed.error.issues[0]?.message ??
                          "Enter a valid email address."
                      )
                      return
                    }

                    startTransition(async () => {
                      const result = await authClient.requestPasswordReset({
                        email: parsed.data.email,
                        redirectTo: `${siteUrl()}/reset-password`,
                      })

                      if (result.error) {
                        setError(
                          result.error.message ??
                            "Could not send reset instructions."
                        )
                        return
                      }

                      setIsSubmitted(true)
                    })
                  }}
                >
                  <FieldBlock
                    label="Email"
                    hint="Use the email address attached to your Drop account."
                  >
                    <Input
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                    />
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
                    {isPending ? "Sending..." : "Send reset link"}
                  </Button>
                </form>
              </>
            )}
          </CardContent>
        </Card>
      </PageFrame>
    </div>
  )
}
