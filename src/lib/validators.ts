import { z } from "zod"
import { DEFAULT_PAGE_COPY } from "./product"

export const emailSchema = z.object({
  email: z.email("Enter a valid email address."),
})

export const authCredentialsSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z
    .string()
    .min(8, "Use at least 8 characters.")
    .max(128, "Keep the password under 128 characters."),
})

export const passwordResetSchema = z
  .object({
    password: z
      .string()
      .min(8, "Use at least 8 characters.")
      .max(128, "Keep the password under 128 characters."),
    confirmPassword: z.string(),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "The passwords do not match.",
    path: ["confirmPassword"],
  })

export const pageProfileSchema = z.object({
  displayName: z
    .string()
    .trim()
    .min(2, "Use at least 2 characters.")
    .max(48, "Keep your name under 48 characters."),
  pageTitle: z
    .string()
    .trim()
    .min(10, "Give people a little more context.")
    .max(120, "Keep the title under 120 characters."),
  intro: z
    .string()
    .trim()
    .min(40, "A short invitation helps people trust the page.")
    .max(320, "Keep the intro under 320 characters."),
  trustStatement: z
    .string()
    .trim()
    .min(12, "Add a short trust statement.")
    .max(140, "Keep the trust statement under 140 characters."),
})

export const pageUpdateSchema = pageProfileSchema.extend({
  pageId: z.string(),
})

export const pageProfileDefaults = {
  displayName: "",
  pageTitle: DEFAULT_PAGE_COPY.pageTitle,
  intro: DEFAULT_PAGE_COPY.intro,
  trustStatement: DEFAULT_PAGE_COPY.trustStatement,
}

export const publicSubmissionSchema = z.object({
  slug: z.string().trim().min(1),
  message: z
    .string()
    .trim()
    .min(6, "A short description is enough.")
    .max(700, "Keep this under 700 characters."),
  details: z
    .string()
    .trim()
    .max(1000, "Keep the extra details under 1000 characters.")
    .optional(),
})

export const submissionStateSchema = z.object({
  submissionId: z.string(),
  state: z.enum(["new", "saved", "in_progress", "archived"]),
})

export const hideSubmissionSchema = z.object({
  submissionId: z.string(),
})

export const pageIdSchema = z.object({
  pageId: z.string(),
})
