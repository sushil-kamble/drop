import * as React from "react"
import { Link, createFileRoute, useRouter } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { FieldBlock, PageFrame, SiteHeader } from "@/components/site/layout"
import { authClient } from "@/lib/auth-client"
import { passwordResetSchema } from "@/lib/validators"

export const Route = createFileRoute("/reset-password")({
  validateSearch: (search) => ({
    token: typeof search.token === "string" ? search.token : "",
    error: typeof search.error === "string" ? search.error : "",
  }),
  component: ResetPasswordPage,
})

function ResetPasswordPage() {
  const router = useRouter()
  const { token, error: tokenError } = Route.useSearch()
  const [password, setPassword] = React.useState("")
  const [confirmPassword, setConfirmPassword] = React.useState("")
  const [fieldError, setFieldError] = React.useState("")
  const [error, setError] = React.useState("")
  const [isPending, startTransition] = React.useTransition()

  const hasUsableToken = Boolean(token) && !tokenError

  return (
    <div className="min-h-svh">
      <SiteHeader />
      <PageFrame className="flex justify-center pt-8 sm:pt-12">
        <Card className="w-full max-w-xl border border-foreground/10 bg-background/82">
          <CardHeader>
            <CardTitle className="font-heading text-3xl sm:text-4xl">
              Choose a new password.
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            {!hasUsableToken ? (
              <>
                <p className="text-sm leading-7 text-muted-foreground">
                  This reset link is missing, invalid, or expired. Request a new
                  password reset link to continue.
                </p>
                <Button asChild size="lg" className="h-11">
                  <Link to="/forgot-password">Request new link</Link>
                </Button>
              </>
            ) : (
              <>
                <p className="text-sm leading-7 text-muted-foreground">
                  Use at least 8 characters. After the reset, your other active
                  sessions will be signed out.
                </p>
                <form
                  className="flex flex-col gap-4"
                  onSubmit={(event) => {
                    event.preventDefault()
                    setError("")
                    setFieldError("")

                    const parsed = passwordResetSchema.safeParse({
                      password,
                      confirmPassword,
                    })

                    if (!parsed.success) {
                      setFieldError(
                        parsed.error.issues[0]?.message ??
                          "Check your new password."
                      )
                      return
                    }

                    startTransition(async () => {
                      const result = await authClient.resetPassword({
                        newPassword: parsed.data.password,
                        token,
                      })

                      if (result.error) {
                        setError(
                          result.error.message ??
                            "Could not reset your password."
                        )
                        return
                      }

                      await router.navigate({ to: "/login", replace: true })
                    })
                  }}
                >
                  <FieldBlock
                    label="New password"
                    hint="Use at least 8 characters."
                  >
                    <Input
                      type="password"
                      required
                      autoComplete="new-password"
                      placeholder="At least 8 characters"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                    />
                  </FieldBlock>

                  <FieldBlock
                    label="Confirm password"
                    hint="Repeat the new password."
                  >
                    <Input
                      type="password"
                      required
                      autoComplete="new-password"
                      placeholder="Repeat your password"
                      value={confirmPassword}
                      onChange={(event) =>
                        setConfirmPassword(event.target.value)
                      }
                    />
                  </FieldBlock>

                  {fieldError ? (
                    <p className="text-sm text-destructive" role="alert">
                      {fieldError}
                    </p>
                  ) : null}

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
                    {isPending ? "Resetting..." : "Reset password"}
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
