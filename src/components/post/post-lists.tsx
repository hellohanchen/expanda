'use client'

import { PostCard } from "@/components/post/post-card"
import { PostSkeleton } from "@/components/post/post-skeleton"
import { useEffect, useState } from "react"
import type { PostWithAuthor } from "@/lib/types"
import type { ContentMode } from "./mode-switcher"

interface PostListProps {
  userId: string
  mode: ContentMode
}

async function fetchReplies(userId: string) {
  const res = await fetch(`/api/posts/replies?userId=${userId}`)
  if (!res.ok) throw new Error('Failed to fetch replies')
  return res.json()
}

async function fetchQuotes(userId: string) {
  const res = await fetch(`/api/posts/quotes?userId=${userId}`)
  if (!res.ok) throw new Error('Failed to fetch quotes')
  return res.json()
}

async function fetchReposts(userId: string) {
  const res = await fetch(`/api/posts/reposts?userId=${userId}`)
  if (!res.ok) throw new Error('Failed to fetch reposts')
  return res.json()
}

export function RepliesList({ userId, mode }: PostListProps) {
  const [replies, setReplies] = useState<PostWithAuthor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchReplies(userId)
      .then(data => setReplies(data))
      .catch(err => setError(err.message))
      .finally(() => setIsLoading(false))
  }, [userId])

  if (isLoading) return <PostSkeleton />
  if (error) return <p className="text-center text-red-500">{error}</p>
  if (replies.length === 0) return <p className="text-center text-muted-foreground">No replies yet.</p>

  return (
    <div className="space-y-4">
      {replies.map((reply) => (
        <PostCard key={reply.id} post={reply} mode={mode} />
      ))}
    </div>
  )
}

export function QuotesList({ userId, mode }: PostListProps) {
  const [quotes, setQuotes] = useState<PostWithAuthor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchQuotes(userId)
      .then(data => setQuotes(data))
      .catch(err => setError(err.message))
      .finally(() => setIsLoading(false))
  }, [userId])

  if (isLoading) return <PostSkeleton />
  if (error) return <p className="text-center text-red-500">{error}</p>
  if (quotes.length === 0) return <p className="text-center text-muted-foreground">No quotes yet.</p>

  return (
    <div className="space-y-4">
      {quotes.map((quote) => (
        <PostCard key={quote.id} post={quote} mode={mode} />
      ))}
    </div>
  )
}

export function RepostsList({ userId, mode }: PostListProps) {
  const [reposts, setReposts] = useState<PostWithAuthor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchReposts(userId)
      .then(data => setReposts(data))
      .catch(err => setError(err.message))
      .finally(() => setIsLoading(false))
  }, [userId])

  if (isLoading) return <PostSkeleton />
  if (error) return <p className="text-center text-red-500">{error}</p>
  if (reposts.length === 0) return <p className="text-center text-muted-foreground">No reposts yet.</p>

  return (
    <div className="space-y-4">
      {reposts.map((repost) => (
        <PostCard key={repost.id} post={repost} mode={mode} />
      ))}
    </div>
  )
} 