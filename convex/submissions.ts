import { v } from "convex/values"
import { mutation } from "./_generated/server"
import { authComponent } from "./auth"

function normalizeSubmissionState(
  state: "new" | "saved" | "in_progress" | "building" | "archived"
) {
  return state === "building" ? "in_progress" : state
}

async function requireViewer(ctx: any) {
  return authComponent.getAuthUser(ctx)
}

async function requireOwnedSubmission(ctx: any, submissionId: string) {
  const viewer = await requireViewer(ctx)
  const submission = await ctx.db.get(submissionId)

  if (!submission) {
    throw new Error("Submission not found")
  }

  const page = await ctx.db.get(submission.builderId)
  if (!page || page.authUserId !== viewer._id) {
    throw new Error("Submission not found")
  }

  return { submission, page }
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

export const bumpRateLimit = mutation({
  args: {
    key: v.string(),
    kind: v.literal("submit"),
    max: v.number(),
    windowMs: v.number(),
  },
  handler: async (ctx, args) => {
    const now = Date.now()
    const existing = await ctx.db
      .query("drop_rate_limit_buckets")
      .withIndex("by_key", (q) => q.eq("key", args.key))
      .unique()

    if (!existing || existing.expiresAt <= now) {
      if (existing) {
        await ctx.db.delete(existing._id)
      }

      await ctx.db.insert("drop_rate_limit_buckets", {
        key: args.key,
        kind: args.kind,
        count: 1,
        windowStart: now,
        expiresAt: now + args.windowMs,
        updatedAt: now,
      })

      return { allowed: true, remaining: args.max - 1 }
    }

    if (existing.count >= args.max) {
      return { allowed: false, remaining: 0 }
    }

    await ctx.db.patch(existing._id, {
      count: existing.count + 1,
      updatedAt: now,
    })

    return { allowed: true, remaining: args.max - (existing.count + 1) }
  },
})

export const submitPublicDrop = mutation({
  args: {
    slug: v.string(),
    message: v.string(),
    details: v.optional(v.string()),
    abuseFingerprint: v.optional(v.string()),
    referrerHost: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const page = await ctx.db
      .query("drop_builders")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique()

    if (!page || !page.isPublished) {
      throw new Error("This page is not available")
    }

    const now = Date.now()
    const submissionId = await ctx.db.insert("drop_submissions", {
      builderId: page._id,
      problem: args.message.trim(),
      context: args.details?.trim() || undefined,
      state: "new",
      visibility: "visible",
      submittedAt: now,
      updatedAt: now,
      source: "anonymous_web",
      abuseFingerprint: args.abuseFingerprint,
      referrerHost: args.referrerHost,
    })

    await insertEvent(ctx, {
      kind: "drop_submitted",
      builderId: page._id,
      submissionId,
      slug: page.slug,
      state: "new",
      source: "anonymous_web",
    })

    return { ok: true, submissionId }
  },
})

export const setSubmissionState = mutation({
  args: {
    submissionId: v.id("drop_submissions"),
    state: v.union(
      v.literal("new"),
      v.literal("saved"),
      v.literal("in_progress"),
      v.literal("archived")
    ),
  },
  handler: async (ctx, args) => {
    const { submission, page } = await requireOwnedSubmission(ctx, args.submissionId)

    await ctx.db.patch(submission._id, {
      state: args.state,
      updatedAt: Date.now(),
    })

    await insertEvent(ctx, {
      kind: "drop_state_changed",
      builderId: page._id,
      submissionId: submission._id,
      slug: page.slug,
      state: args.state,
    })

    return { ok: true }
  },
})

export const hideSubmission = mutation({
  args: {
    submissionId: v.id("drop_submissions"),
  },
  handler: async (ctx, args) => {
    const { submission, page } = await requireOwnedSubmission(ctx, args.submissionId)

    await ctx.db.patch(submission._id, {
      visibility: "hidden",
      updatedAt: Date.now(),
    })

    await insertEvent(ctx, {
      kind: "drop_hidden",
      builderId: page._id,
      submissionId: submission._id,
      slug: page.slug,
      state: normalizeSubmissionState(submission.state),
    })

    return { ok: true }
  },
})
