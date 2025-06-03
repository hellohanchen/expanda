import { z } from "zod"

const envSchema = z.object({
  GOOGLE_ID: z.string().optional(),
  GOOGLE_SECRET: z.string().optional(),
})

export const env = envSchema.parse({
  GOOGLE_ID: process.env.GOOGLE_ID,
  GOOGLE_SECRET: process.env.GOOGLE_SECRET,
}) 