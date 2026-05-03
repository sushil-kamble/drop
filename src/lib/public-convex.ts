import { ConvexHttpClient } from "convex/browser"
import { convexUrl } from "./env"

export function createPublicConvexClient() {
  return new ConvexHttpClient(convexUrl())
}
