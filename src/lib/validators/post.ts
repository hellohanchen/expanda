import { z } from "zod"

export const ContentMode = {
  HEADLINER: "HEADLINER",
  SHORT: "SHORT",
  FULL: "FULL",
} as const

export const createPostSchema = z.object({
  content: z.string()
    .min(1, "Content is required")
    .max(5000, "Content must be less than 5000 characters"),
  headliner: z
    .string()
    .max(50, "Headliner must be less than 50 characters")
    .optional(),
  shortContent: z
    .string()
    .min(50, "Short content must be at least 50 characters")
    .max(280, "Short content must be less than 280 characters")
    .optional(),
  fullContent: z
    .string()
    .min(280, "Full content must be at least 280 characters")
    .max(5000, "Full content must be less than 5000 characters")
    .optional(),
})

export const createCommentSchema = z.object({
  content: z.string()
    .min(1, "Comment cannot be empty")
    .max(5000, "Comment must be less than 5000 characters"),
  headliner: z
    .string()
    .max(50, "Headliner must be less than 50 characters")
    .optional(),
  shortContent: z
    .string()
    .min(50, "Short content must be at least 50 characters")
    .max(280, "Short content must be less than 280 characters")
    .optional(),
  fullContent: z
    .string()
    .min(280, "Full content must be at least 280 characters")
    .max(5000, "Full content must be less than 5000 characters")
    .optional(),
  postId: z.string(),
})

export const createQuoteSchema = z.object({
  content: z.string()
    .min(1, "Content is required")
    .max(5000, "Content must be less than 5000 characters"),
  headliner: z
    .string()
    .max(50, "Headliner must be less than 50 characters")
    .optional(),
  shortContent: z
    .string()
    .min(50, "Short content must be at least 50 characters")
    .max(280, "Short content must be less than 280 characters")
    .optional(),
  fullContent: z
    .string()
    .min(280, "Full content must be at least 280 characters")
    .max(5000, "Full content must be less than 5000 characters")
    .optional(),
  quotePostId: z.string(),
})

export type CreatePostInput = z.infer<typeof createPostSchema>
export type CreateCommentInput = z.infer<typeof createCommentSchema>
export type CreateQuoteInput = z.infer<typeof createQuoteSchema> 