import { prisma } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextResponse } from "next/server"
import { z } from "zod"

const repostSchema = z.object({
  postId: z.string(),
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 })
    }

    const body = await req.json()
    const validatedData = repostSchema.parse(body)

    // Check if the post exists
    const originalPost = await prisma.post.findUnique({
      where: { id: validatedData.postId },
      include: {
        author: true,
      },
    })

    if (!originalPost) {
      return new NextResponse("Post not found", { status: 404 })
    }

    // Check if user has already reposted this post
    const existingRepost = await prisma.post.findFirst({
      where: {
        authorId: session.user.id,
        repostPostId: validatedData.postId,
      },
    })

    if (existingRepost) {
      // If already reposted, delete the repost (toggle behavior)
      await prisma.post.delete({
        where: { id: existingRepost.id },
      })
      return NextResponse.json({ reposted: false })
    }

    // Create the repost
    const repost = await prisma.post.create({
      data: {
        authorId: session.user.id,
        repostPostId: validatedData.postId,
        published: true,
        headliner: "",  // Empty for reposts
        shortContent: "", // Empty for reposts
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
          },
        },
      },
    })

    return NextResponse.json({ reposted: true, post: repost })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new NextResponse(JSON.stringify(error.errors), { status: 400 })
    }

    return new NextResponse("Internal Error", { status: 500 })
  }
} 