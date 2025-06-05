'use server'

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { createPostSchema, type CreatePostInput, createCommentSchema, type CreateCommentInput, createQuoteSchema, type CreateQuoteInput } from "@/lib/validators/post"
import { revalidatePath } from "next/cache"
import type { Post } from "@/generated/prisma"

export async function createPost(data: CreatePostInput): Promise<{ error?: string; data?: Post }> {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return {
      error: "Unauthorized",
    }
  }

  try {
    const validatedData = createPostSchema.parse(data)

    // Determine which content to use based on the content length
    const contentLength = validatedData.content.length
    const postData = {
      headliner: "",
      shortContent: "",
      fullContent: null as string | null,
      authorId: session.user.id,
    }

    if (contentLength <= 50) {
      postData.headliner = validatedData.content
    } else if (contentLength <= 280) {
      postData.headliner = validatedData.headliner || validatedData.content.slice(0, 50)
      postData.shortContent = validatedData.content
    } else {
      postData.headliner = validatedData.headliner || validatedData.content.slice(0, 50)
      postData.shortContent = validatedData.shortContent || validatedData.content.slice(0, 280)
      postData.fullContent = validatedData.content
    }

    const post = await prisma.post.create({
      data: postData,
      include: {
        author: true,
        likes: true,
        comments: true,
      },
    })

    revalidatePath("/")
    return { data: post }
  } catch (error) {
    if (error instanceof Error) {
      return {
        error: error.message,
      }
    }
    return {
      error: "Failed to create post",
    }
  }
}

export async function toggleLike(postId: string): Promise<{ error?: string; data?: { liked: boolean } }> {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return {
      error: "Unauthorized",
    }
  }

  try {
    const existingLike = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId,
          userId: session.user.id,
        },
      },
    })

    if (existingLike) {
      await prisma.like.delete({
        where: {
          postId_userId: {
            postId,
            userId: session.user.id,
          },
        },
      })
      revalidatePath("/")
      revalidatePath(`/post/${postId}`)
      return { data: { liked: false } }
    }

    await prisma.like.create({
      data: {
        postId,
        userId: session.user.id,
      },
    })

    revalidatePath("/")
    revalidatePath(`/post/${postId}`)
    return { data: { liked: true } }
  } catch (error) {
    if (error instanceof Error) {
      return {
        error: error.message,
      }
    }
    return {
      error: "Failed to toggle like",
    }
  }
}

export async function createComment(data: CreateCommentInput): Promise<{ error?: string; data?: Post }> {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return {
      error: "Unauthorized",
    }
  }

  try {
    const validatedData = createCommentSchema.parse(data)

    // Determine which content to use based on the content length
    const contentLength = validatedData.content.length
    const postData = {
      headliner: "",
      shortContent: "",
      fullContent: null as string | null,
      authorId: session.user.id,
      parentPostId: validatedData.postId,
    }

    if (contentLength <= 50) {
      // Headliner mode
      postData.headliner = validatedData.content
      postData.shortContent = validatedData.content
    } else if (contentLength <= 280) {
      // Short content mode
      postData.headliner = validatedData.headliner || validatedData.content.slice(0, 50)
      postData.shortContent = validatedData.content
    } else {
      // Full content mode
      postData.headliner = validatedData.headliner || validatedData.content.slice(0, 50)
      postData.shortContent = validatedData.shortContent || validatedData.content.slice(0, 280)
      postData.fullContent = validatedData.content
    }

    // Create a new post that represents the comment
    const comment = await prisma.post.create({
      data: postData,
      include: {
        author: true,
        likes: true,
        comments: true,
      },
    })

    revalidatePath(`/post/${validatedData.postId}`)
    return { data: comment }
  } catch (error) {
    if (error instanceof Error) {
      return {
        error: error.message,
      }
    }
    return {
      error: "Failed to create comment",
    }
  }
}

export async function repost(postId: string): Promise<{ error?: string; data?: Post }> {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return {
      error: "Unauthorized",
    }
  }

  try {
    // Check if the post exists
    const originalPost = await prisma.post.findUnique({
      where: { id: postId },
      include: { author: true },
    })

    if (!originalPost) {
      return {
        error: "Post not found",
      }
    }

    // Check if user has already reposted this post
    const existingRepost = await prisma.post.findFirst({
      where: {
        repostPostId: postId,
        authorId: session.user.id,
      },
    })

    if (existingRepost) {
      // Delete the repost if it exists
      await prisma.post.delete({
        where: { id: existingRepost.id },
      })
      revalidatePath("/")
      return { data: existingRepost }
    }

    // Create a new repost
    const repost = await prisma.post.create({
      data: {
        headliner: originalPost.headliner,
        shortContent: originalPost.shortContent,
        fullContent: originalPost.fullContent,
        authorId: session.user.id,
        repostPostId: postId,
      },
      include: {
        author: true,
        likes: true,
        comments: true,
        repostPost: {
          include: {
            author: true,
          },
        },
      },
    })

    revalidatePath("/")
    return { data: repost }
  } catch (error) {
    if (error instanceof Error) {
      return {
        error: error.message,
      }
    }
    return {
      error: "Failed to repost",
    }
  }
}

export async function createQuote(data: CreateQuoteInput): Promise<{ error?: string; data?: Post }> {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return {
      error: "Unauthorized",
    }
  }

  try {
    const validatedData = createQuoteSchema.parse(data)

    // Determine which content to use based on the content length
    const contentLength = validatedData.content.length
    const postData = {
      headliner: "",
      shortContent: "",
      fullContent: null as string | null,
      authorId: session.user.id,
      quotePostId: validatedData.quotePostId,
    }

    if (contentLength <= 50) {
      postData.headliner = validatedData.content
    } else if (contentLength <= 280) {
      postData.headliner = validatedData.headliner || validatedData.content.slice(0, 50)
      postData.shortContent = validatedData.content
    } else {
      postData.headliner = validatedData.headliner || validatedData.content.slice(0, 50)
      postData.shortContent = validatedData.shortContent || validatedData.content.slice(0, 280)
      postData.fullContent = validatedData.content
    }

    const post = await prisma.post.create({
      data: postData,
      include: {
        author: true,
        likes: true,
        comments: true,
      },
    })

    revalidatePath("/")
    return { data: post }
  } catch (error) {
    if (error instanceof Error) {
      return {
        error: error.message,
      }
    }
    return {
      error: "Failed to create quote",
    }
  }
}

export async function getPost(postId: string): Promise<{ error?: string; data?: Post }> {
  try {
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        author: true,
        likes: true,
        comments: {
          where: {
            parentPostId: postId,
          },
          include: {
            author: true,
            likes: true,
            comments: true,
            quoted: true,
            reposts: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        quoted: true,
        reposts: true,
        repostPost: {
          include: {
            author: true,
            likes: true,
            comments: true,
            reposts: true,
            quotePost: {
              include: {
                author: true,
              },
            },
          },
        },
        quotePost: {
          include: {
            author: true,
            likes: true,
            comments: true,
            reposts: true,
          },
        },
        parentPost: {
          include: {
            author: true,
            likes: true,
            comments: true,
            reposts: true,
          },
        },
      },
    })

    if (!post) {
      return { error: "Post not found" }
    }

    return { data: post }
  } catch (error) {
    if (error instanceof Error) {
      return {
        error: error.message,
      }
    }
    return {
      error: "Failed to fetch post",
    }
  }
} 