import { v } from "convex/values"
import { mutation } from "./_generated/server"

export const recordPublicEvent = mutation({
  args: {
    slug: v.string(),
    kind: v.union(v.literal("public_page_view"), v.literal("submission_started")),
  },
  handler: async (ctx, args) => {
    const page = await ctx.db
      .query("drop_builders")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique()

    if (!page || !page.isPublished) {
      return { ok: false }
    }

    await ctx.db.insert("drop_events", {
      kind: args.kind,
      occurredAt: Date.now(),
      builderId: page._id,
      slug: page.slug,
      source: "anonymous_web",
    })

    return { ok: true }
  },
})
