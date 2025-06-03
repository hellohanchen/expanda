import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")

  if (!userId) {
    return new NextResponse("Missing userId", { status: 400 })
  }

  try {
    const replies = await prisma.post.findMany({
      where: {
        authorId: userId,
        parentPostId: { not: null },
      },
      orderBy: {
        createdAt: "desc"
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
        parentPost: {
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
      },
    })

    return NextResponse.json(replies)
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 })
  }
} 