'use client'

import { PostCard } from "./post-card"
import { type ContentMode } from "./mode-switcher"

interface PostFeedProps {
  initialPosts: any[]
  mode: ContentMode
}

export function PostFeed({ initialPosts, mode }: PostFeedProps) {
  if (initialPosts.length === 0) {
    return (
      <div className="rounded-lg border p-8 text-center">
        <h2 className="text-2xl font-semibold mb-2">No posts yet</h2>
        <p className="text-muted-foreground">Be the first one to post something!</p>
      </div>
    )
  }

  const postsWithCounts = initialPosts.map(post => ({
    ...post,
    _count: {
      likes: post.likes.length,
      comments: post.comments.length,
    }
  }))

  return (
    <div className="space-y-8">
      {postsWithCounts.map((post) => (
        <PostCard key={post.id} post={post} mode={mode} />
      ))}
    </div>
  )
} 