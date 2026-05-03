import { describe, expect, it } from "vitest"
import { buildShareUrl, isReservedSlug, normalizeSlug } from "./product"

describe("product helpers", () => {
  it("normalizes slugs into lowercase kebab-case", () => {
    expect(normalizeSlug("  Sushil's Drop Page  ")).toBe("sushils-drop-page")
  })

  it("detects reserved slugs", () => {
    expect(isReservedSlug("login")).toBe(true)
    expect(isReservedSlug("settings")).toBe(true)
    expect(isReservedSlug("maker-notes")).toBe(false)
  })

  it("builds share URLs", () => {
    expect(buildShareUrl("https://drop.1cc.in/", "sushil")).toBe(
      "https://drop.1cc.in/sushil"
    )
  })
})
