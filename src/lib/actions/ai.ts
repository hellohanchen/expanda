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

function extractContent(text: string): { headliner?: string; shortContent?: string } {
  const result: { headliner?: string; shortContent?: string } = {}
  
  // Extract headliner - matches "Headliner: " followed by text in quotes or just text
  const headlinerMatch = text.match(/Headliner:\s*"?([^"\n]+)"?/)
  if (headlinerMatch) {
    result.headliner = headlinerMatch[1].trim()
  }
  
  // Extract summary - matches "Summary: " followed by text in quotes or just text
  const summaryMatch = text.match(/Summary:\s*"?([^"\n]+)"?/)
  if (summaryMatch) {
    result.shortContent = summaryMatch[1].trim()
  }
  
  return result
}

export async function generateContent(data: z.infer<typeof generateSchema>): Promise<GenerateResponse> {
  try {
    const validatedData = generateSchema.parse(data)

    const messages = [
      {
        role: "System",
        message: "You are a content summarizer. For headliner requests, respond with 'Headliner: \"your text\"'. For both headliner and summary requests, respond with 'Headliner: \"your text\"' followed by 'Summary: \"your text\"' on the next line."
      },
      {
        role: "User",
        message: validatedData.mode === "headliner"
          ? `Generate a catchy headliner (max 50 characters) for this content: ${validatedData.content}`
          : `Generate a catchy headliner (max 50 characters) and a concise summary (max 280 characters) for this content: ${validatedData.content}`
      }
    ]

    const response = await fetch('https://api.cohere.ai/v1/chat', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.COHERE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'command-light',
        message: messages[1].message,
        chat_history: [messages[0]],
        temperature: 0.3,
      }),
    })

    if (!response.ok) {
      throw new Error(`Cohere API error: ${response.statusText}`)
    }

    const result = await response.json()
    const aiResponse = result.text.trim()
    
    const extracted = extractContent(aiResponse)
    
    if (!extracted.headliner) {
      console.error('Failed to extract headliner from AI response:', aiResponse)
      return { error: 'Failed to generate content' }
    }

    return {
      headliner: extracted.headliner.slice(0, 50),
      shortContent: validatedData.mode === "both" ? extracted.shortContent?.slice(0, 280) : undefined,
    }
  } catch (error) {
    console.error('AI generation error:', error)
    return { error: error instanceof Error ? error.message : 'Failed to generate content' }
  }
} 