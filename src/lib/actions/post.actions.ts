'use server'

import { prisma } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import type { Post } from "@/generated/prisma"

export async function getLatestPosts(cursor?: string) {
  const take = 20

  return await prisma.post.findMany({
    where: {
      published: true,
    },
    orderBy: {
      createdAt: 'desc'
    },
    take,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
          username: true,
          handle: true,
        }
      },
      likes: {
        select: {
          userId: true,
        },
      },
      comments: {
        where: {
          published: true,
        },
      },
      quoted: {
        where: {
          published: true,
        },
      },
      reposts: {
        select: {
          authorId: true,
        },
      },
      parentPost: {
        include: {
          author: true,
        }
      },
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
        },
      },
    },
  })
}

export async function toggleLike(postId: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return { error: "You must be logged in to like posts" }
  }

  try {
    // Try to delete the like first
    try {
      await prisma.like.delete({
        where: {
          postId_userId: {
            postId,
            userId: session.user.id,
          },
        },
      })
      // If deletion succeeds, it means the post was liked, and we just unliked it
      revalidatePath('/')
      revalidatePath(`/post/${postId}`)
      return { success: true, action: 'unliked' }
    } catch {
      // If deletion fails, it means the like doesn't exist, so create it
      await prisma.like.create({
        data: {
          postId,
          userId: session.user.id,
        },
      })
      revalidatePath('/')
      revalidatePath(`/post/${postId}`)
      return { success: true, action: 'liked' }
    }
  } catch (error) {
    console.error('Error toggling like:', error)
    return { error: "Failed to toggle like" }
  }
}

export async function isLikedByUser(postId: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return false
  }

  const like = await prisma.like.findUnique({
    where: {
      postId_userId: {
        postId,
        userId: session.user.id,
      },
    },
  })

  return !!like
}

export async function getPost(postId: string): Promise<{ error?: string; data?: Post }> {
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
          },
          orderBy: {
            createdAt: "desc",
          },
        },
        reposts: {
          select: {
            authorId: true,
          },
        },
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
          }
        },
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
          }
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
          }
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

export async function getFollowingPosts(cursor?: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return []
  }

  const take = 20

  // First get the list of users we're following
  const following = await prisma.follow.findMany({
    where: {
      followerId: session.user.id
    },
    select: {
      followingId: true
    }
  })

  const followingIds = following.map(f => f.followingId)

  return await prisma.post.findMany({
    where: {
      published: true,
      OR: [
        // Posts from followed users
        {
          authorId: {
            in: followingIds
          }
        },
        // User's own posts
        {
          authorId: session.user.id
        }
      ]
    },
    orderBy: {
      createdAt: 'desc'
    },
    take,
    skip: cursor ? 1 : 0,
    cursor: cursor ? { id: cursor } : undefined,
    include: {
      author: {
        select: {
          id: true,
          name: true,
          image: true,
          username: true,
          handle: true,
        }
      },
      likes: {
        select: {
          userId: true,
        },
      },
      comments: {
        where: {
          published: true,
        },
      },
      quoted: {
        where: {
          published: true,
        },
      },
      reposts: {
        select: {
          authorId: true,
        },
      },
      parentPost: {
        include: {
          author: true,
        }
      },
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
        },
      },
    },
  })
} 