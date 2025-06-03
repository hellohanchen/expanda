import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"
import { z } from "zod"

const profileSchema = z.object({
  username: z.string().min(1, "Username is required"),
  handle: z.string().min(1, "Handle is required")
    .regex(/^[a-zA-Z0-9_]+$/, "Handle can only contain letters, numbers, and underscores")
    .max(30, "Handle must be 30 characters or less"),
  name: z.string().min(1, "Name is required"),
  xUsername: z.string().optional(),
  mediumUsername: z.string().optional(),
  linkedinUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  githubUsername: z.string().optional(),
  websiteUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
})

export async function PATCH(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const validatedData = profileSchema.parse(body)

    // Check if username is unique
    const existingUsername = await prisma.user.findUnique({
      where: {
        username: validatedData.username,
        NOT: {
          id: session.user.id
        }
      }
    })

    if (existingUsername) {
      return new NextResponse(
        JSON.stringify({ error: "Username is already taken" }),
        { status: 400 }
      )
    }

    // Check if handle is unique
    const existingHandle = await prisma.user.findUnique({
      where: {
        handle: validatedData.handle,
        NOT: {
          id: session.user.id
        }
      }
    })

    if (existingHandle) {
      return new NextResponse(
        JSON.stringify({ error: "Handle is already taken" }),
        { status: 400 }
      )
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        username: validatedData.username,
        handle: validatedData.handle,
        name: validatedData.name,
        xUsername: validatedData.xUsername || null,
        mediumUsername: validatedData.mediumUsername || null,
        linkedinUrl: validatedData.linkedinUrl || null,
        githubUsername: validatedData.githubUsername || null,
        websiteUrl: validatedData.websiteUrl || null,
      },
    })

    return NextResponse.json(updatedUser)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.errors), { status: 400 })
    }

    return new NextResponse(
      JSON.stringify({ error: "Internal Server Error" }),
      { status: 500 }
    )
  }
} 