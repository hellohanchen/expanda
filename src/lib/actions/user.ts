'use server'

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/db"
import { revalidatePath } from "next/cache"
import type { UserWithProfile } from "@/lib/types"

export async function toggleFollow(userId: string) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return { error: "You must be logged in to follow users" }
  }

  if (session.user.id === userId) {
    return { error: "You cannot follow yourself" }
  }

  try {
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: session.user.id,
          followingId: userId,
        },
      },
    })

    if (existingFollow) {
      await prisma.follow.delete({
        where: {
          followerId_followingId: {
            followerId: session.user.id,
            followingId: userId,
          },
        },
      })
    } else {
      await prisma.follow.create({
        data: {
          followerId: session.user.id,
          followingId: userId,
        },
      })
    }

    revalidatePath(`/profile/${userId}`)
    revalidatePath(`/profile/${userId}/followers`)
    revalidatePath(`/profile/${userId}/following`)
    return { success: true, following: !existingFollow }
  } catch (error) {
    console.error('Error toggling follow:', error)
    return { error: "Failed to update follow status" }
  }
}

export async function getFollowers(userId: string, page = 1) {
  try {
    const session = await getServerSession(authOptions)
    const currentUserId = session?.user?.id
    const take = 50
    const skip = (page - 1) * take

    const [followers, total] = await Promise.all([
      prisma.follow.findMany({
        where: {
          followingId: userId
        },
        select: {
          follower: {
            include: {
              posts: true,
              _count: {
                select: {
                  followers: true,
                  following: true,
                  posts: true
                }
              }
            }
          }
        },
        skip,
        take,
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.follow.count({
        where: {
          followingId: userId
        }
      })
    ]);

    // If there's a current user, get their follow relationships
    const followStatuses = currentUserId ? await prisma.follow.findMany({
      where: {
        followerId: currentUserId,
        followingId: {
          in: followers.map(f => f.follower.id)
        }
      },
      select: {
        followingId: true
      }
    }) : [];

    const followingSet = new Set(followStatuses.map(f => f.followingId));

    const users = followers.map(({ follower }) => ({
      ...follower,
      isFollowing: currentUserId ? followingSet.has(follower.id) : false,
      _count: {
        following: follower._count.followers,
        followers: follower._count.following,
        posts: follower._count.posts
      }
    })) as unknown as (UserWithProfile & { isFollowing: boolean })[];

    const totalPages = Math.ceil(total / take);

    return { 
      data: users,
      pagination: {
        total,
        pages: totalPages,
        currentPage: page
      }
    };
  } catch (error) {
    console.error('Error fetching followers:', error)
    return { error: "Failed to fetch followers" }
  }
}

export async function getFollowing(userId: string, page = 1) {
  try {
    const session = await getServerSession(authOptions)
    const currentUserId = session?.user?.id
    const take = 50
    const skip = (page - 1) * take

    const [following, total] = await Promise.all([
      prisma.follow.findMany({
        where: {
          followerId: userId
        },
        select: {
          following: {
            include: {
              posts: true,
              _count: {
                select: {
                  followers: true,
                  following: true,
                  posts: true
                }
              }
            }
          }
        },
        skip,
        take,
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.follow.count({
        where: {
          followerId: userId
        }
      })
    ]);

    // If there's a current user, get their follow relationships
    const followStatuses = currentUserId ? await prisma.follow.findMany({
      where: {
        followerId: currentUserId,
        followingId: {
          in: following.map(f => f.following.id)
        }
      },
      select: {
        followingId: true
      }
    }) : [];

    const followingSet = new Set(followStatuses.map(f => f.followingId));

    const users = following.map(({ following }) => ({
      ...following,
      isFollowing: currentUserId ? followingSet.has(following.id) : false,
      _count: {
        following: following._count.followers,
        followers: following._count.following,
        posts: following._count.posts
      }
    })) as unknown as (UserWithProfile & { isFollowing: boolean })[];

    return { 
      data: users,
      pagination: {
        total,
        pages: Math.ceil(total / take),
        currentPage: page
      }
    };
  } catch (error) {
    console.error('Error fetching following:', error)
    return { error: "Failed to fetch following" }
  }
} 