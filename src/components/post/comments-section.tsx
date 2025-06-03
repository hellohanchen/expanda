import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import type { PostWithAuthor } from "@/lib/types"
import type { ContentMode } from "./mode-switcher"
import { CommentsSectionClient } from "./comments-section-client"

interface CommentsSectionProps {
  post: PostWithAuthor
  mode: ContentMode
}

export async function CommentsSection({ post, mode }: CommentsSectionProps) {
  const session = await getServerSession(authOptions)
  return <CommentsSectionClient post={post} mode={mode} session={session} />
} 