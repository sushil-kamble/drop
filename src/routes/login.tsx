import * as React from "react"
import { useConvexAuth, useQuery } from "convex/react"
import { Link, createFileRoute, useRouter } from "@tanstack/react-router"
import { api } from "../../convex/_generated/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { FieldBlock, PageFrame, SiteHeader } from "@/components/site/layout"
import { authClient } from "@/lib/auth-client"
import { authCredentialsSchema } from "@/lib/validators"

export const Route = createFileRoute("/login")({
  component: LoginPage,
})

function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [isPending, startTransition] = React.useTransition()
  const [mode, setMode] = React.useState<"sign-in" | "sign-up">("sign-in")
  const [error, setError] = React.useState("")
  const { isAuthenticated, isLoading } = useConvexAuth()
  const pages = useQuery(
    api.builders.listMyPages,
    isAuthenticated ? {} : "skip"
  )

  React.useEffect(() => {
    if (!isAuthenticated || !pages) {
      return
    }

    void router.navigate({
      to: pages.length > 0 ? "/drops" : "/start",
      replace: true,
    })
  }, [isAuthenticated, pages, router])

  if (isAuthenticated) {
    return (
      <div className="min-h-svh">
        <SiteHeader />
        <PageFrame className="flex justify-center pt-8 sm:pt-12">
          <Card className="w-full max-w-xl border border-foreground/10 bg-background/82">
            <CardContent className="py-8">
              <div className="flex flex-col gap-3">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-72" />
                <Skeleton className="mt-2 h-10 w-full" />
              </div>
            </CardContent>
          </Card>
        </PageFrame>
      </div>
    )
  }

  return (
    <div className="min-h-svh">
      <SiteHeader />
      <PageFrame className="flex justify-center pt-8 sm:pt-12">
        <Card className="w-full max-w-xl border border-foreground/10 bg-background/82">
          <CardHeader>
            <CardTitle className="font-heading text-3xl sm:text-4xl">
              Open your Drop pages.
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <p className="text-sm leading-7 text-muted-foreground">
              Use your email and password to sign in. New accounts can create
              their first private page right after signing up.
            </p>
            {isLoading ? (
              <div className="flex items-center gap-2">
                <Skeleton className="size-4 rounded-full" />
                <span className="text-xs text-muted-foreground">
                  Checking your session...
                </span>
              </div>
            ) : null}

            <div className="grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant={mode === "sign-in" ? "default" : "outline"}
                className="h-10"
                onClick={() => {
                  setMode("sign-in")
                  setError("")
                }}
              >
                Sign in
              </Button>
              <Button
                type="button"
                variant={mode === "sign-up" ? "default" : "outline"}
                className="h-10"
                onClick={() => {
                  setMode("sign-up")
                  setError("")
                }}
              >
                Create account
              </Button>
            </div>

            <form
              className="flex flex-col gap-4"
              onSubmit={(event) => {
                event.preventDefault()
                setError("")

                startTransition(async () => {
                  const parsed = authCredentialsSchema.safeParse({
                    email,
                    password,
                  })

                  if (!parsed.success) {
                    setError(
                      parsed.error.issues[0]?.message ?? "Check your details."
                    )
                    return
                  }

                  const callbackURL = mode === "sign-up" ? "/start" : "/drops"
                  const result =
                    mode === "sign-up"
                      ? await authClient.signUp.email({
                          email: parsed.data.email,
                          password: parsed.data.password,
                          name: parsed.data.email.split("@")[0] || "Builder",
                          callbackURL,
                        })
                      : await authClient.signIn.email({
                          email: parsed.data.email,
                          password: parsed.data.password,
                          callbackURL,
                        })

                  if (result.error) {
                    setError(
                      result.error.message ??
                        (mode === "sign-up"
                          ? "Could not create your account."
                          : "Could not sign you in.")
                    )
                    return
                  }

                  await router.navigate({ to: callbackURL })
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

              <FieldBlock label="Password" hint="Use at least 8 characters.">
                <Input
                  type="password"
                  required
                  autoComplete={
                    mode === "sign-up" ? "new-password" : "current-password"
                  }
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
              </FieldBlock>

              {mode === "sign-in" ? (
                <Link
                  to="/forgot-password"
                  className="w-fit text-sm font-medium text-primary underline-offset-4 hover:underline"
                >
                  Forgot password?
                </Link>
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
                {isPending
                  ? mode === "sign-up"
                    ? "Creating account..."
                    : "Signing in..."
                  : mode === "sign-up"
                    ? "Create account"
                    : "Sign in"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </PageFrame>
    </div>
  )
}
