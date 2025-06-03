import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const cursor = searchParams.get("cursor")
  const limit = parseInt(searchParams.get("limit") ?? "10")

  try {
    const posts = await prisma.post.findMany({
      take: limit,
      skip: cursor ? 1 : 0,
      cursor: cursor ? { id: cursor } : undefined,
      where: {
        published: true,
        parentPostId: null,
      },
      orderBy: {
        createdAt: "desc",
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

    const nextCursor = posts[limit - 1]?.id

    return NextResponse.json({
      posts,
      nextCursor,
    })
  } catch (error) {
    console.error("[POSTS_GET]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
} 