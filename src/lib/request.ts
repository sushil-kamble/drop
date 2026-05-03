export function clientIp(request: Request) {
  const forwarded = request.headers.get("cf-connecting-ip")
  if (forwarded) {
    return forwarded
  }

  const xForwardedFor = request.headers.get("x-forwarded-for")
  if (!xForwardedFor) {
    return "unknown"
  }

  return xForwardedFor.split(",")[0]?.trim() || "unknown"
}

export function referrerHost(request: Request) {
  const referrer = request.headers.get("referer")
  if (!referrer) {
    return undefined
  }

  try {
    return new URL(referrer).host
  } catch {
    return undefined
  }
}

export async function sha256(input: string) {
  const bytes = new TextEncoder().encode(input)
  const digest = await crypto.subtle.digest("SHA-256", bytes)
  return Array.from(new Uint8Array(digest))
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("")
}
