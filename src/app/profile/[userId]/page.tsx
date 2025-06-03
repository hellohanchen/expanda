import { prisma } from "@/lib/db"
import { notFound } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import type { PostWithAuthor, UserWithProfile } from "@/lib/types"
import { ProfilePageClient } from "./profile-page-client"
import type { User as PrismaUser, Post } from "@/generated/prisma"

interface ProfilePageProps {
  params: {
    userId: string
  }
}

async function getProfile(userId: string): Promise<UserWithProfile & { posts: PostWithAuthor[] }> {
  const session = await getServerSession(authOptions)
  
  const profile = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      followers: {
        where: {
          followerId: { not: userId }  // Get users following this profile
        },
        include: {
          follower: true,
        },
      },
      following: {
        where: {
          followingId: { not: userId }  // Get users this profile is following
        },
        include: {
          following: true,
        },
      },
      posts: {
        where: {
          published: true,
          parentPostId: null,
          quotePostId: null,
          repostPostId: null,
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
      },
      _count: {
        select: {
          followers: true,
          following: true,
          posts: true,
        },
      },
    },
  })

  if (!profile) {
    notFound()
  }

  // Get counts for different post types
  const [postsCount, repliesCount, quotesCount, repostsCount, followersCount, followingCount] = await Promise.all([
    prisma.post.count({
      where: {
        authorId: userId,
        published: true,
        parentPostId: null,
        quotePostId: null,
        repostPostId: null,
      },
    }),
    prisma.post.count({
      where: {
        authorId: userId,
        published: true,
        parentPostId: { not: null },
      },
    }),
    prisma.post.count({
      where: {
        authorId: userId,
        published: true,
        quotePostId: { not: null },
      },
    }),
    prisma.post.count({
      where: {
        authorId: userId,
        published: true,
        repostPostId: { not: null },
      },
    }),
    prisma.follow.count({
      where: {
        followingId: userId,
      },
    }),
    prisma.follow.count({
      where: {
        followerId: userId,
      },
    }),
  ])

  // Transform the data to match UserWithProfile type
  const userWithProfile = {
    ...profile,
    followers: profile.followers.map((f) => f.follower),
    following: profile.following.map((f) => f.following),
    profile: null,
    _count: {
      followers: followersCount,
      following: followingCount,
      posts: postsCount,
      replies: repliesCount,
      quotes: quotesCount,
      reposts: repostsCount,
    },
    posts: profile.posts.map(post => ({
      ...post,
      quoted: [],
      likes: post.likes.map(like => ({ userId: like.userId })),
      comments: post.comments || [],
      reposts: post.reposts || [],
      author: post.author,
      parentPost: post.parentPost || null,
      quotePost: post.quotePost || null,
      repostPost: post.repostPost || null
    })) as PostWithAuthor[],
  } as UserWithProfile & { posts: PostWithAuthor[] }

  return userWithProfile
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const resolvedParams = await params
  const { userId } = resolvedParams

  const [profile, session] = await Promise.all([
    getProfile(userId),
    getServerSession(authOptions)
  ])

  if (!profile) {
    notFound()
  }

  const isCurrentUser = session?.user?.id === profile.id
  const isFollowing = session?.user?.id ? profile.followers.some(follower => follower.id === session.user.id) : false

  return (
    <div className="h-[calc(100vh-3.5rem)] w-full overflow-hidden px-4 py-8">
      <ProfilePageClient 
        profile={profile}
        isCurrentUser={isCurrentUser}
        isFollowing={isFollowing}
      />
    </div>
  )
} 