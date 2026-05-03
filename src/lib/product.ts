export const RESERVED_SLUGS = new Set([
  "api",
  "drops",
  "inbox",
  "login",
  "settings",
  "start",
  "terms",
])

export const DROP_STATES = ["new", "saved", "in_progress", "archived"] as const

export type DropState = (typeof DROP_STATES)[number]

export const DROP_STATE_LABELS: Record<DropState, string> = {
  new: "New",
  saved: "Saved",
  in_progress: "In progress",
  archived: "Archived",
}

export const DEFAULT_PAGE_COPY = {
  pageTitle: "Drop anything you want to send.",
  intro:
    "You can send a thought, request, complaint, note, question, or anything else. It’s anonymous and private.",
  trustStatement:
    "Anonymous and private. No name or email required. Only this page owner can see it.",
}

export function normalizeSlug(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")
}

export function isReservedSlug(slug: string) {
  return RESERVED_SLUGS.has(normalizeSlug(slug))
}

export function buildShareUrl(origin: string, slug: string) {
  return `${origin.replace(/\/$/, "")}/${slug}`
}
