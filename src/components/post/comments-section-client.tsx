'use client'

import { type PostWithAuthor } from "@/lib/types"
import { type ContentMode } from "./mode-switcher"
import { ContentEditor } from "./content-editor"
import { PostCard } from "./post-card"

interface CommentsSectionClientProps {
  post: PostWithAuthor
  mode: ContentMode
  session: any | null
}

export function CommentsSectionClient({ post, mode, session }: CommentsSectionClientProps) {
  return (
    <>
      {session && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Leave a comment</h2>
          <ContentEditor mode="comment" targetId={post.id} />
        </div>
      )}

      <div>
        <h2 className="text-xl font-semibold mb-4">Comments</h2>
        <div className="space-y-6">
          {(post.comments as PostWithAuthor[]).map((comment) => (
            <PostCard 
              key={comment.id} 
              post={{
                ...comment,
                parentPost: {
                  ...post,
                  comments: [],
                  likes: [],
                  reposts: [],
                  quotePost: null,
                  repostPost: null,
                  parentPost: null,
                }
              }} 
              mode={mode} 
            />
          ))}
          {post.comments.length === 0 && (
            <p className="text-center text-muted-foreground">No comments yet. Be the first to comment!</p>
          )}
        </div>
      </div>
    </>
  )
} 