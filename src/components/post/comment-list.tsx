'use client'

import { PostWithAuthor } from "@/lib/types"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { formatDistanceToNow } from "date-fns"
import Link from "next/link"
import { LikeButton } from "./like-button"
import type { ContentMode } from "./mode-switcher"

interface CommentListProps {
  comments: PostWithAuthor[]
  mode: ContentMode
  userId?: string | null
}

export function CommentList({ comments, mode, userId }: CommentListProps) {
  const getDisplayContent = (comment: PostWithAuthor) => {
    switch (mode) {
      case 'HEADLINER':
        return comment.headliner
      case 'SHORT':
        return comment.shortContent
      case 'FULL':
        return comment.fullContent || comment.shortContent
    }
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => {
        const hasLiked = comment.likes.some(like => like.userId === userId)
        const displayContent = getDisplayContent(comment)

        return (
          <div key={comment.id} className="flex gap-4">
            <Avatar className="h-8 w-8">
              <AvatarImage src={comment.author.image ?? ""} alt={comment.author.name ?? ""} />
              <AvatarFallback>{comment.author.name?.[0]?.toUpperCase()}</AvatarFallback>
            </Avatar>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <Link href={`/profile/${comment.author.id}`} className="font-semibold hover:underline">
                  {comment.author.username}
                </Link>
                <span className="text-sm text-muted-foreground">
                  @{comment.author.handle}
                </span>
                <span className="text-sm text-muted-foreground">·</span>
                <span className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </span>
              </div>
              <p className="text-sm whitespace-pre-wrap">{displayContent}</p>
              <div className="flex items-center gap-4">
                <LikeButton
                  postId={comment.id}
                  initialLikeCount={comment.likes.length}
                  initialLiked={hasLiked}
                />
              </div>
            </div>
          </div>
        )
      })}
      {comments.length === 0 && (
        <p className="text-center text-muted-foreground">No comments yet. Be the first to comment!</p>
      )}
    </div>
  )
} 