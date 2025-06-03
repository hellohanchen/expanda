import { Post as PrismaPost, User as PrismaUser, Like, Follow } from "../generated/prisma"

export interface UserWithProfile extends PrismaUser {
  posts: Post[]
  followers: PrismaUser[]
  following: PrismaUser[]
  profile: Profile | null
  _count: {
    followers: number
    following: number
    posts: number
    replies: number
    quotes: number
    reposts: number
  }
}

export interface PostWithAuthor extends Post {
  author: PrismaUser
  likes: { userId: string }[]
  comments: Post[]
  reposts: { authorId: string }[]
  quoted: Post[]
  parentPost?: PostWithAuthor | null
  quotePost?: PostWithAuthor | null
  repostPost?: PostWithAuthor | null
}

export interface Profile {
  id: string
  userId: string
  bio: string | null
  location: string | null
  website: string | null
  twitter: string | null
  github: string | null
  linkedin: string | null
}

export interface Post {
  id: string
  createdAt: Date
  updatedAt: Date
  published: boolean
  authorId: string
  headliner: string
  shortContent: string
  fullContent: string | null
  parentPostId: string | null
  quotePostId: string | null
  repostPostId: string | null
}

export type SafeUser = Omit<
  Pick<
    PrismaUser,
    | "id"
    | "name"
    | "email"
    | "image"
    | "username"
    | "handle"
    | "xUsername"
    | "mediumUsername"
    | "linkedinUrl"
    | "githubUsername"
    | "websiteUrl"
  >,
  "emailVerified"
>

export type ExtendedSession = {
  user: SafeUser & {
    id: string
  }
  expires: string
} 