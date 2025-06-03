import { notFound } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import type { PostWithAuthor } from "@/lib/types"
import { getPost } from "@/lib/actions/post"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { QuotePageClient } from "./quote-page-client"

interface QuotePageProps {
  params: Promise<{
    postId: string
  }>
}

export default async function QuotePage({ params }: QuotePageProps) {
  const resolvedParams = await params
  const { postId } = resolvedParams

  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center">
        <Card>
          <CardContent className="p-8">
            <h2 className="text-xl font-semibold mb-2">Unauthorized</h2>
            <p className="text-muted-foreground">Please sign in to quote posts.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

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
    <div className="h-[calc(100vh-3.5rem)] w-full overflow-hidden px-4 py-8">
      <QuotePageClient post={post} />
    </div>
  )
} 