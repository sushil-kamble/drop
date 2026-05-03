const RESEND_EMAILS_API_URL = "https://api.resend.com/emails"
const DEFAULT_RESEND_FROM_EMAIL = "Drop <onboarding@resend.dev>"

function requiredEnv(name: "RESEND_API_KEY") {
  const value = process.env[name]
  if (!value) {
    throw new Error(`${name} is not set`)
  }
  return value
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;")
}

export async function sendPasswordResetEmail({
  to,
  resetUrl,
}: {
  to: string
  resetUrl: string
}) {
  const apiKey = requiredEnv("RESEND_API_KEY")
  const from = process.env.RESEND_FROM_EMAIL || DEFAULT_RESEND_FROM_EMAIL
  const escapedResetUrl = escapeHtml(resetUrl)

  const response = await fetch(RESEND_EMAILS_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to,
      subject: "Reset your Drop password",
      text: `Use this link to reset your Drop password: ${resetUrl}\n\nIf you did not ask for this, you can ignore this email.`,
      html: `
        <div style="font-family: Inter, Arial, sans-serif; color: #171717; line-height: 1.6;">
          <h1 style="font-size: 20px; margin: 0 0 12px;">Reset your Drop password</h1>
          <p>Use the link below to choose a new password for your Drop account.</p>
          <p>
            <a href="${escapedResetUrl}" style="display: inline-block; background: #171717; color: #ffffff; padding: 10px 14px; text-decoration: none;">
              Reset password
            </a>
          </p>
          <p style="font-size: 13px; color: #666666;">
            If the button does not work, paste this link into your browser:<br />
            <a href="${escapedResetUrl}" style="color: #171717;">${escapedResetUrl}</a>
          </p>
          <p style="font-size: 13px; color: #666666;">
            If you did not ask for this, you can safely ignore this email.
          </p>
        </div>
      `,
    }),
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(
      `Resend password reset email failed: ${response.status} ${body}`
    )
  }
}
