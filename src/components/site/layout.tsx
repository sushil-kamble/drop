import {
  ArrowRight,
  List,
  Plus,
  SignIn,
  SignOut,
  SquaresFour,
} from "@phosphor-icons/react"
import { useConvexAuth } from "convex/react"
import * as React from "react"
import { Link, useRouter } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { authClient } from "@/lib/auth-client"
import { cn } from "@/lib/utils"

export function BrandMark({ className }: { className?: string }) {
  return (
    <Link
      to="/"
      className={cn(
        "inline-flex items-center gap-2.5 text-sm font-semibold",
        className
      )}
    >
      <span className="flex size-8 items-center justify-center border border-foreground/15 bg-foreground font-heading text-base text-background">
        D
      </span>
      <span className="text-foreground/85">Drop</span>
    </Link>
  )
}

export function SiteHeader({
  rightSlot,
  className,
}: {
  rightSlot?: React.ReactNode
  className?: string
}) {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 border-b border-foreground/8 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/75",
        className
      )}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-8">
        <BrandMark />
        <nav className="hidden items-center gap-1 sm:flex sm:flex-wrap sm:justify-end">
          {rightSlot}
          <HeaderActions layout="desktop" />
        </nav>
        <MobileMenu rightSlot={rightSlot} />
      </div>
    </header>
  )
}

function MobileMenu({ rightSlot }: { rightSlot?: React.ReactNode }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="sm:hidden"
          aria-label="Open menu"
        >
          <List />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-56 sm:hidden"
      >
        {rightSlot ? (
          <>
            <div className="flex flex-col gap-1 p-1 [&_a]:w-full [&_button]:h-9 [&_button]:w-full [&_button]:justify-start [&_button]:px-2 [&_button]:text-xs">
              {rightSlot}
            </div>
            <DropdownMenuSeparator />
          </>
        ) : null}
        <HeaderActions layout="mobile" />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function HeaderActions({ layout }: { layout: "desktop" | "mobile" }) {
  const router = useRouter()
  const { isAuthenticated, isLoading } = useConvexAuth()

  if (isLoading) {
    if (layout === "mobile") {
      return (
        <DropdownMenuGroup>
          <DropdownMenuItem className="h-10 text-sm" disabled>
            Loading...
          </DropdownMenuItem>
        </DropdownMenuGroup>
      )
    }

    return (
      <Button variant="ghost" size="sm" disabled>
        Loading...
      </Button>
    )
  }

  if (!isAuthenticated) {
    if (layout === "mobile") {
      return (
        <DropdownMenuGroup>
          <DropdownMenuItem asChild className="h-10 text-sm">
            <Link to="/login">
              <SignIn data-icon="inline-start" />
              Log in
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      )
    }

    return (
      <Button asChild size="sm">
        <Link to="/login">
          <SignIn data-icon="inline-start" />
          Log in
        </Link>
      </Button>
    )
  }

  if (layout === "mobile") {
    return (
      <DropdownMenuGroup>
        <DropdownMenuItem asChild className="h-10 text-sm">
          <Link to="/drops/new">
            <Plus data-icon="inline-start" />
            New page
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild className="h-10 text-sm">
          <Link to="/drops">
            <SquaresFour data-icon="inline-start" />
            All Pages
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="h-10 text-sm"
          variant="destructive"
          onSelect={async () => {
            await authClient.signOut()
            await router.navigate({ to: "/", replace: true })
          }}
        >
          <SignOut data-icon="inline-start" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuGroup>
    )
  }

  return (
    <>
      <Button asChild size="sm">
        <Link to="/drops/new">
          <Plus data-icon="inline-start" />
          New page
        </Link>
      </Button>
      <Button asChild variant="ghost" size="sm">
        <Link to="/drops">
          <SquaresFour data-icon="inline-start" />
          All Pages
        </Link>
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={async () => {
          await authClient.signOut()
          await router.navigate({ to: "/", replace: true })
        }}
      >
        <SignOut data-icon="inline-start" />
        Logout
      </Button>
    </>
  )
}

export function HeroAction({
  to,
  children,
  variant = "default",
}: {
  to: string
  children: React.ReactNode
  variant?: "default" | "outline"
}) {
  return (
    <Button asChild variant={variant} size="lg" className="h-11 px-5 text-sm">
      <Link to={to}>
        {children}
        <ArrowRight data-icon="inline-end" />
      </Link>
    </Button>
  )
}

export function PageFrame({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <main
      className={cn(
        "mx-auto box-border w-full max-w-6xl px-4 pb-16 sm:px-8",
        className
      )}
    >
      {children}
    </main>
  )
}

export function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-sm font-medium text-muted-foreground">{children}</p>
}

export function FieldBlock({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-medium text-foreground">{label}</span>
      {children}
      {hint ? (
        <span className="text-xs text-muted-foreground">{hint}</span>
      ) : null}
    </label>
  )
}

export function FloatingNotice({ message }: { message: string | null }) {
  return (
    <div
      className={cn(
        "pointer-events-none fixed right-4 bottom-4 z-[60] transition-all duration-200",
        message ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      )}
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="border border-foreground/10 bg-background px-4 py-3 text-sm font-medium shadow-lg backdrop-blur">
        {message || ""}
      </div>
    </div>
  )
}
