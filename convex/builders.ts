import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { authComponent } from "./auth"

const RESERVED_SLUGS = new Set([
  "api",
  "drops",
  "inbox",
  "login",
  "settings",
  "start",
  "terms",
])

function normalizeSlug(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")
}

function buildRandomSlug() {
  return crypto.randomUUID().replace(/-/g, "").slice(0, 10)
}

async function generateUniqueSlug(ctx: any) {
  for (let attempt = 0; attempt < 500; attempt += 1) {
    const candidate = buildRandomSlug()

    if (RESERVED_SLUGS.has(candidate)) {
      continue
    }

    const existing = await ctx.db
      .query("drop_builders")
      .withIndex("by_slug", (q: any) => q.eq("slug", candidate))
      .unique()

    if (!existing) {
      return candidate
    }
  }

  throw new Error("Could not generate a page link right now")
}

function normalizeSubmissionState(
  state: "new" | "saved" | "in_progress" | "building" | "archived"
) {
  return state === "building" ? "in_progress" : state
}

async function requireViewer(ctx: any) {
  return authComponent.getAuthUser(ctx)
}

async function requireOwnedPage(ctx: any, pageId: string) {
  const viewer = await requireViewer(ctx)
  const page = await ctx.db.get(pageId)

  if (!page || page.authUserId !== viewer._id) {
    throw new Error("Page not found")
  }

  return { page, viewer }
}

async function insertEvent(
  ctx: any,
  event: {
    kind: string
    builderId?: string
    submissionId?: string
    slug?: string
    state?: "new" | "saved" | "in_progress" | "building" | "archived"
    source?: string
  }
) {
  await ctx.db.insert("drop_events", {
    ...event,
    occurredAt: Date.now(),
  })
}

async function buildPageSummary(ctx: any, page: any) {
  const submissions = await ctx.db
    .query("drop_submissions")
    .withIndex("by_builder_submittedAt", (q: any) =>
      q.eq("builderId", page._id)
    )
    .order("desc")
    .collect()

  const visibleSubmissions = submissions.filter(
    (submission: any) => submission.visibility === "visible"
  )

  return {
    ...page,
    visibleCount: visibleSubmissions.length,
    hiddenCount: submissions.length - visibleSubmissions.length,
    lastSubmissionAt: visibleSubmissions[0]?.submittedAt,
    recentSubmissions: visibleSubmissions
      .slice(0, 2)
      .map((submission: any) => ({
        _id: submission._id,
        problem: submission.problem,
        submittedAt: submission.submittedAt,
        state: normalizeSubmissionState(submission.state),
      })),
  }
}

export const listMyPages = query({
  args: {},
  handler: async (ctx) => {
    const viewer = await requireViewer(ctx)
    const pages = await ctx.db
      .query("drop_builders")
      .withIndex("by_authUserId", (q) => q.eq("authUserId", viewer._id))
      .collect()

    const summaries = await Promise.all(
      pages.map((page: any) => buildPageSummary(ctx, page))
    )

    return summaries.sort((left, right) => right.updatedAt - left.updatedAt)
  },
})

export const getPageInbox = query({
  args: {
    pageId: v.id("drop_builders"),
  },
  handler: async (ctx, args) => {
    const { page } = await requireOwnedPage(ctx, args.pageId)
    const submissions = await ctx.db
      .query("drop_submissions")
      .withIndex("by_builder_submittedAt", (q) => q.eq("builderId", page._id))
      .order("desc")
      .collect()

    const visibleSubmissions = submissions
      .filter((submission) => submission.visibility === "visible")
      .map((submission) => ({
        ...submission,
        state: normalizeSubmissionState(submission.state),
      }))

    return {
      page,
      submissions: visibleSubmissions,
      hiddenCount: submissions.length - visibleSubmissions.length,
    }
  },
})

export const getPageSettings = query({
  args: {
    pageId: v.id("drop_builders"),
  },
  handler: async (ctx, args) => {
    const { page } = await requireOwnedPage(ctx, args.pageId)
    return page
  },
})

export const getPublicPage = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const page = await ctx.db
      .query("drop_builders")
      .withIndex("by_slug", (q) => q.eq("slug", normalizeSlug(args.slug)))
      .unique()

    if (!page || !page.isPublished) {
      return null
    }

    return {
      id: page._id,
      ownerDisplayName: page.displayName,
      slug: page.slug,
      title: page.pageTitle,
      intro: page.intro,
      trustStatement: page.trustStatement,
    }
  },
})

export const createPage = mutation({
  args: {
    displayName: v.string(),
    pageTitle: v.string(),
    intro: v.string(),
    trustStatement: v.string(),
  },
  handler: async (ctx, args) => {
    const viewer = await requireViewer(ctx)
    const slug = await generateUniqueSlug(ctx)

    const now = Date.now()
    const pageId = await ctx.db.insert("drop_builders", {
      authUserId: viewer._id,
      email: viewer.email,
      displayName: args.displayName.trim(),
      slug,
      pageTitle: args.pageTitle.trim(),
      intro: args.intro.trim(),
      trustStatement: args.trustStatement.trim(),
      isPublished: true,
      createdAt: now,
      updatedAt: now,
    })

    await insertEvent(ctx, {
      kind: "page_created",
      builderId: pageId,
      slug,
    })

    const createdPage = await ctx.db.get(pageId)
    if (!createdPage) {
      throw new Error("Could not create this page")
    }

    return createdPage
  },
})

export const updatePage = mutation({
  args: {
    pageId: v.id("drop_builders"),
    displayName: v.string(),
    pageTitle: v.string(),
    intro: v.string(),
    trustStatement: v.string(),
  },
  handler: async (ctx, args) => {
    const { page, viewer } = await requireOwnedPage(ctx, args.pageId)
    const slug = page.slug

    const now = Date.now()
    await ctx.db.patch(page._id, {
      authUserId: viewer._id,
      email: viewer.email,
      displayName: args.displayName.trim(),
      slug,
      pageTitle: args.pageTitle.trim(),
      intro: args.intro.trim(),
      trustStatement: args.trustStatement.trim(),
      isPublished: true,
      updatedAt: now,
    })

    await insertEvent(ctx, {
      kind: "page_updated",
      builderId: page._id,
      slug,
    })

    const updatedPage = await ctx.db.get(page._id)
    if (!updatedPage) {
      throw new Error("Could not update this page")
    }

    return updatedPage
  },
})

export const recordPageInboxVisit = mutation({
  args: {
    pageId: v.id("drop_builders"),
  },
  handler: async (ctx, args) => {
    const { page } = await requireOwnedPage(ctx, args.pageId)
    const now = Date.now()
    await ctx.db.patch(page._id, { lastInboxViewedAt: now, updatedAt: now })
    await insertEvent(ctx, {
      kind: "page_inbox_viewed",
      builderId: page._id,
      slug: page.slug,
    })
    return { ok: true }
  },
})
