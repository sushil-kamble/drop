import { v } from "convex/values"
import { mutation } from "./_generated/server"
import { authComponent } from "./auth"

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
      visibility: "visible",
      submittedAt: now,
      updatedAt: now,
      abuseFingerprint: args.abuseFingerprint,
      referrerHost: args.referrerHost,
    })

    return { ok: true, submissionId }
  },
})

export const hideSubmission = mutation({
  args: {
    submissionId: v.id("drop_submissions"),
  },
  handler: async (ctx, args) => {
    const { submission } = await requireOwnedSubmission(ctx, args.submissionId)

    await ctx.db.patch(submission._id, {
      visibility: "hidden",
      updatedAt: Date.now(),
    })

    return { ok: true }
  },
})
