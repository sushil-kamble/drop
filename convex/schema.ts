import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

const storedDropState = v.union(
  v.literal("new"),
  v.literal("saved"),
  v.literal("in_progress"),
  v.literal("building"),
  v.literal("archived")
)

const dropVisibility = v.union(v.literal("visible"), v.literal("hidden"))

export default defineSchema({
  drop_builders: defineTable({
    authUserId: v.string(),
    email: v.optional(v.string()),
    displayName: v.string(),
    slug: v.string(),
    pageTitle: v.string(),
    intro: v.string(),
    trustStatement: v.string(),
    isPublished: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
    lastInboxViewedAt: v.optional(v.number()),
  })
    .index("by_authUserId", ["authUserId"])
    .index("by_slug", ["slug"]),

  drop_submissions: defineTable({
    builderId: v.id("drop_builders"),
    problem: v.string(),
    context: v.optional(v.string()),
    state: storedDropState,
    visibility: dropVisibility,
    submittedAt: v.number(),
    updatedAt: v.number(),
    source: v.literal("anonymous_web"),
    abuseFingerprint: v.optional(v.string()),
    referrerHost: v.optional(v.string()),
  })
    .index("by_builder_submittedAt", ["builderId", "submittedAt"])
    .index("by_builder_state_submittedAt", ["builderId", "state", "submittedAt"]),

  drop_rate_limit_buckets: defineTable({
    key: v.string(),
    kind: v.union(v.literal("submit")),
    count: v.number(),
    windowStart: v.number(),
    expiresAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_key", ["key"])
    .index("by_expiresAt", ["expiresAt"]),

  drop_events: defineTable({
    kind: v.string(),
    occurredAt: v.number(),
    builderId: v.optional(v.id("drop_builders")),
    submissionId: v.optional(v.id("drop_submissions")),
    slug: v.optional(v.string()),
    state: v.optional(storedDropState),
    source: v.optional(v.string()),
  })
    .index("by_builder_occurredAt", ["builderId", "occurredAt"])
    .index("by_kind_occurredAt", ["kind", "occurredAt"]),

  // Preserve existing prediction-game indexes on the shared Convex project.
  prediction_participants: defineTable(v.any())
    .index("by_challenge", ["challengeId"])
    .index("by_challenge_username", ["challengeId", "usernameLower"])
    .index("by_challenge_uuid", ["challengeId", "uuid"]),

  prediction_predictions: defineTable(v.any())
    .index("by_participant", ["participantId"])
    .index("by_participant_question", ["participantId", "questionId"])
    .index("by_challenge", ["challengeId"]),

  prediction_participantDevices: defineTable(v.any())
    .index("by_challenge_uuid", ["challengeId", "uuid"])
    .index("by_participant", ["participantId"]),

  prediction_questions: defineTable(v.any()).index("by_challenge_order", [
    "challengeId",
    "order",
  ]),

  prediction_winnerMessages: defineTable(v.any())
    .index("by_medal", ["medal"])
    .index("by_medal_sportKey", ["medal", "sportKey"]),
})
