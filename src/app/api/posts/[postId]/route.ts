import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

interface RouteContext {
  params: Promise<{
    postId: string
  }>
}

export async function GET(request: Request, context: RouteContext) {
  const params = await context.params
  const { postId } = params

  try {
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        author: true,
        likes: {
          select: {
            userId: true,
          },
        },
        comments: {
          include: {
            author: true,
            likes: {
              select: {
                userId: true,
              },
            },
            comments: true,
            reposts: true,
          },
        },
        reposts: true,
        quotePost: {
          include: {
            author: true,
            likes: {
              select: {
                userId: true,
              },
            },
            comments: true,
            reposts: true,
          },
        },
        repostPost: {
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
            parentPost: {
              include: {
                author: true,
              },
            },
          },
        },
        parentPost: {
          include: {
            author: true,
          },
        },
      },
    })

    if (!post) {
      return new NextResponse("Post not found", { status: 404 })
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error("[POST_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 