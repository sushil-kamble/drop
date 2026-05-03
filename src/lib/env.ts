function readEnv(
  name:
    | "VITE_SITE_URL"
    | "SITE_URL"
    | "VITE_CONVEX_URL"
    | "VITE_CONVEX_SITE_URL"
) {
  switch (name) {
    case "VITE_SITE_URL":
      return import.meta.env.VITE_SITE_URL || process.env.VITE_SITE_URL
    case "SITE_URL":
      return process.env.SITE_URL
    case "VITE_CONVEX_URL":
      return import.meta.env.VITE_CONVEX_URL || process.env.VITE_CONVEX_URL
    case "VITE_CONVEX_SITE_URL":
      return (
        import.meta.env.VITE_CONVEX_SITE_URL || process.env.VITE_CONVEX_SITE_URL
      )
  }
}

export function siteUrl() {
  return (
    readEnv("VITE_SITE_URL") || readEnv("SITE_URL") || "https://drop.1cc.in"
  )
}

export function convexUrl() {
  const url = readEnv("VITE_CONVEX_URL")
  if (!url) {
    throw new Error("VITE_CONVEX_URL is not set")
  }
  return url
}

export function convexSiteUrl() {
  const url = readEnv("VITE_CONVEX_SITE_URL")
  if (!url) {
    throw new Error("VITE_CONVEX_SITE_URL is not set")
  }
  return url
}
