import { prisma } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextResponse } from "next/server"
import { z } from "zod"

const quoteSchema = z.object({
  postId: z.string(),
  headliner: z.string().min(1, "Headliner is required").max(150, "Headliner is too long"),
  shortContent: z.string().min(1, "Content is required").max(280, "Content is too long"),
  fullContent: z.string().optional(),
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const validatedData = quoteSchema.parse(body)

    // Check if the post exists
    const originalPost = await prisma.post.findUnique({
      where: { id: validatedData.postId },
    })

    if (!originalPost) {
      return new NextResponse("Post not found", { status: 404 })
    }

    // Create the quote post
    const quote = await prisma.post.create({
      data: {
        authorId: session.user.id,
        headliner: validatedData.headliner,
        shortContent: validatedData.shortContent,
        fullContent: validatedData.fullContent || null,
        quotePostId: validatedData.postId,
        published: true,
      },
      include: {
        author: true,
        likes: {
          select: {
            userId: true,
          },
        },
        comments: true,
        reposts: true,
        quotePost: {
          include: {
            author: true,
          },
        },
      },
    })

    return NextResponse.json(quote)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.errors), { status: 400 })
    }

    return new NextResponse("Internal Server Error", { status: 500 })
  }
} 