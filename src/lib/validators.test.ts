import { describe, expect, it } from "vitest"
import {
  authCredentialsSchema,
  pageProfileSchema,
  pageUpdateSchema,
  publicSubmissionSchema,
} from "./validators"

describe("validators", () => {
  it("validates a new page profile", () => {
    const parsed = pageProfileSchema.parse({
      displayName: "Sushil",
      pageTitle: "Drop anything you want to send.",
      intro:
        "You can send a thought, request, complaint, note, question, or anything else. It’s anonymous and private.",
      trustStatement: "Anonymous and private. Only this page owner can see it.",
    })

    expect(parsed.displayName).toBe("Sushil")
  })

  it("validates page updates with a page id", () => {
    const parsed = pageUpdateSchema.parse({
      pageId: "abc123",
      displayName: "Sushil",
      pageTitle: "Drop anything you want to send.",
      intro:
        "You can send a thought, request, complaint, note, question, or anything else. It’s anonymous and private.",
      trustStatement: "Anonymous and private. Only this page owner can see it.",
    })

    expect(parsed.pageId).toBe("abc123")
  })

  it("rejects too-short public submissions", () => {
    expect(() =>
      publicSubmissionSchema.parse({
        slug: "sushil",
        message: "bad",
        details: "",
      })
    ).toThrow()
  })

  it("rejects short passwords", () => {
    expect(() =>
      authCredentialsSchema.parse({
        email: "test@example.com",
        password: "short",
      })
    ).toThrow()
  })
})
