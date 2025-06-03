'use client'

import { type ContentMode } from "./mode-switcher"
import { PostFeed } from "./post-feed"
import { getLatestPosts, getFollowingPosts } from "@/lib/actions/post.actions"
import { useEffect, useState, useRef, useCallback } from "react"
import { Suspense } from "react"
import type { PostWithAuthor } from "@/lib/types"
import { Loader2 } from "lucide-react"

interface PostsListProps {
  mode: ContentMode
  feedType: 'all' | 'following'
}

export function PostsList({ mode, feedType }: PostsListProps) {
  const [posts, setPosts] = useState<PostWithAuthor[]>([])
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(true)
  const [cursor, setCursor] = useState<string | undefined>(undefined)
  const loaderRef = useRef<HTMLDivElement>(null)

  const loadPosts = useCallback(async (cursorId?: string) => {
    try {
      setLoading(true)
      const fetchPosts = feedType === 'following' ? getFollowingPosts : getLatestPosts
      const newPosts = await fetchPosts(cursorId) as PostWithAuthor[]
      
      if (cursorId) {
        setPosts(prev => [...prev, ...newPosts])
      } else {
        setPosts(newPosts)
      }

      // If we got less than 20 posts, we've reached the end
      setHasMore(newPosts.length === 20)
      // Set the cursor to the last post's ID if we have posts
      setCursor(newPosts[newPosts.length - 1]?.id)
    } catch (error) {
      console.error('Error loading posts:', error)
    } finally {
      setLoading(false)
    }
  }, [feedType])

  // Intersection Observer callback
  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const target = entries[0]
    if (target.isIntersecting && hasMore && !loading) {
      loadPosts(cursor)
    }
  }, [cursor, hasMore, loading])

  // Set up the intersection observer
  useEffect(() => {
    const observer = new IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '20px',
      threshold: 0.1
    })

    if (loaderRef.current) {
      observer.observe(loaderRef.current)
    }

    return () => observer.disconnect()
  }, [handleObserver])

  // Reset and load posts when feedType changes
  useEffect(() => {
    setCursor(undefined)
    setHasMore(true)
    loadPosts()
  }, [feedType, loadPosts])

  if (loading && posts.length === 0) {
    return <div className="flex justify-center p-4"><Loader2 className="h-6 w-6 animate-spin" /></div>
  }

  return (
    <Suspense fallback={<div className="flex justify-center p-4"><Loader2 className="h-6 w-6 animate-spin" /></div>}>
      <div className="space-y-4">
        <PostFeed initialPosts={posts} mode={mode} />
        {/* Loader element */}
        <div ref={loaderRef} className="h-10 flex items-center justify-center">
          {loading && <Loader2 className="h-6 w-6 animate-spin" />}
        </div>
        {!hasMore && posts.length > 0 && (
          <p className="text-center text-muted-foreground py-4">No more posts to load</p>
        )}
        {!hasMore && posts.length === 0 && (
          <p className="text-center text-muted-foreground py-4">No posts found</p>
        )}
      </div>
    </Suspense>
  )
} 