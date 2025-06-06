import { notFound } from "next/navigation"
import { PostCard } from "@/components/post/post-card"
import { Suspense } from "react"
import { Card, CardContent } from "@/components/ui/card"
import type { PostWithAuthor } from "@/lib/types"
import { type ContentMode } from "@/components/post/mode-switcher"
import { CommentsSection } from "@/components/post/comments-section"
import { getPost } from "@/lib/actions/post"
import { PostPageClient } from "@/app/post/[postId]/post-page-client"

interface PostPageProps {
  params: Promise<{
    postId: string
  }>
}

function PostSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardContent className="p-8">
        <div className="h-6 w-2/3 bg-muted rounded mb-4" />
        <div className="space-y-2">
          <div className="h-4 w-full bg-muted rounded" />
          <div className="h-4 w-5/6 bg-muted rounded" />
          <div className="h-4 w-4/6 bg-muted rounded" />
        </div>
      </CardContent>
    </Card>
  )
}

export default async function PostPage({ params }: PostPageProps) {
  const resolvedParams = await params
  const { postId } = resolvedParams

  if (!postId) {
    return notFound()
  }

  const result = await getPost(postId)
        
  if (result.error) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center">
        <Card>
          <CardContent className="p-8">
            <h2 className="text-xl font-semibold mb-2">Error</h2>
            <p className="text-muted-foreground">{result.error}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!result.data) {
    return notFound()
  }

  const post = result.data as PostWithAuthor

  return (
    <div className="min-h-[calc(100vh-3.5rem)] w-full px-0 md:px-4 py-0 md:py-8">
      <PostPageClient post={post} />
    </div>
  )
} 