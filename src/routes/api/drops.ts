import { createFileRoute } from "@tanstack/react-router"
import { api } from "../../../convex/_generated/api"
import { createPublicConvexClient } from "@/lib/public-convex"
import { clientIp, referrerHost, sha256 } from "@/lib/request"
import { publicSubmissionSchema } from "@/lib/validators"

export const Route = createFileRoute("/api/drops")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const body = publicSubmissionSchema.parse(await request.json())
          const ip = clientIp(request)
          const client = createPublicConvexClient()
          const fingerprint = await sha256(
            [body.slug, ip, request.headers.get("user-agent") ?? "unknown"].join("|")
          )

          const rateLimit = await client.mutation(api.submissions.bumpRateLimit, {
            key: fingerprint,
            kind: "submit",
            max: 5,
            windowMs: 15 * 60 * 1000,
          })

          if (!rateLimit.allowed) {
            return Response.json(
              {
                error:
                  "You’ve submitted a few already. Please wait a little before sending another drop.",
              },
              { status: 429 }
            )
          }

          const result = await client.mutation(api.submissions.submitPublicDrop, {
            slug: body.slug,
            message: body.message,
            details: body.details,
            abuseFingerprint: fingerprint,
            referrerHost: referrerHost(request),
          })

          return Response.json(result)
        } catch (error) {
          const message =
            error instanceof Error ? error.message : "Could not submit this drop."
          return Response.json({ error: message }, { status: 400 })
        }
      },
    },
  },
})
