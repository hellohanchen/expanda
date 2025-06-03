import { prisma } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const userId = searchParams.get("userId")

  if (!userId) {
    return new NextResponse("Missing userId", { status: 400 })
  }

  try {
    const quotes = await prisma.post.findMany({
      where: {
        authorId: userId,
        quotePostId: { not: null },
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
        quotePost: {
          include: {
            author: true,
          },
        },
      },
    })

    return NextResponse.json(quotes)
  } catch (error) {
    return new NextResponse("Internal Server Error", { status: 500 })
  }
} 