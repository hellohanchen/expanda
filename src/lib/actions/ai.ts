'use server'

import { z } from "zod"

const generateSchema = z.object({
  content: z.string().min(1, "Content is required"),
  mode: z.enum(["headliner", "both"]),
})

type GenerateResponse = {
  headliner?: string
  shortContent?: string
  error?: string
}

export async function generateContent(data: z.infer<typeof generateSchema>): Promise<GenerateResponse> {
  try {
    const validatedData = generateSchema.parse(data)

    const prompt = validatedData.mode === "headliner"
      ? `Generate a catchy headliner (max 50 characters) for the following content:\n\n${validatedData.content}\n\nFormat the response as JSON with a "headliner" field.`
      : `Generate a catchy headliner (max 50 characters) and a concise summary (max 280 characters) for the following content:\n\n${validatedData.content}\n\nFormat the response as JSON with "headliner" and "shortContent" fields.`

    const response = await fetch('https://api.cohere.ai/v1/generate', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.COHERE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'command-light',
        prompt,
        max_tokens: 200,
        temperature: 0.7,
        k: 0,
        stop_sequences: [],
        return_likelihoods: 'NONE',
      }),
    })

    if (!response.ok) {
      throw new Error(`Cohere API error: ${response.statusText}`)
    }

    const result = await response.json()
    
    try {
      // Parse the generated text as JSON
      const parsed = JSON.parse(result.generations[0].text)
      return {
        headliner: parsed.headliner?.slice(0, 50),
        shortContent: validatedData.mode === "both" ? parsed.shortContent?.slice(0, 280) : undefined,
      }
    } catch (error) {
      console.error('Failed to parse AI response:', error)
      return { error: 'Failed to parse AI response' }
    }
  } catch (error) {
    console.error('AI generation error:', error)
    return { error: error instanceof Error ? error.message : 'Failed to generate content' }
  }
} 