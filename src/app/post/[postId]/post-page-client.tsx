'use client'

import { Suspense } from "react"
import { PostCard } from "@/components/post/post-card"
import { Card, CardContent } from "@/components/ui/card"
import type { PostWithAuthor } from "@/lib/types"
import { type ContentMode } from "@/components/post/mode-switcher"
import { Button } from "@/components/ui/button"
import { Newspaper, AlignLeft, BookOpen } from "lucide-react"
import dynamic from "next/dynamic"
import { useSession } from "next-auth/react"
import { cn } from "@/lib/utils"
import { useScrollState } from "@/hooks/use-scroll-state"
import { useReadingMode } from "@/contexts/reading-mode-context"
import { ReadingModeSwitcher } from "@/components/ui/reading-mode-switcher"

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

function CommentSkeleton() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-24 bg-muted animate-pulse rounded" />
            <div className="h-4 w-full bg-muted animate-pulse rounded" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Dynamically import the server component
const CommentsSection = dynamic(
  () => import("@/components/post/comments-section-client").then(mod => ({ 
    default: mod.CommentsSectionClient 
  })),
  { 
    loading: () => <CommentSkeleton />,
    ssr: true
  }
)

interface PostPageClientProps {
  post: PostWithAuthor
}

export function PostPageClient({ post }: PostPageClientProps) {
  const { mode, setMode } = useReadingMode()
  const { data: session } = useSession()
  const scrollRef = useScrollState()

  return (
    <div className="container mx-auto">
      <div className="grid h-full grid-cols-1 md:grid-cols-[250px_minmax(500px,_1fr)_250px] gap-6">
        {/* Left Sidebar */}
        <aside className="hidden md:block">
          <Card>
            <CardContent className="p-4 space-y-2">
              <Button 
                variant="ghost" 
                className={cn(
                  "w-full justify-start text-lg font-semibold",
                  "bg-accent"
                )}
              >
                Post
              </Button>
            </CardContent>
          </Card>
        </aside>

        {/* Main Content */}
        <main>
          {/* Mobile Mode Switcher */}
          <div className="md:hidden mb-6">
            <ReadingModeSwitcher mode={mode} onChange={setMode} />
          </div>

          <div ref={scrollRef} className="md:h-[calc(100vh-8rem)] md:overflow-y-auto scrollbar-modern">
            <div className="mb-8">
              <Suspense fallback={<PostSkeleton />}>
                <PostCard post={post} mode={mode} />
              </Suspense>
            </div>

            <Suspense fallback={<CommentSkeleton />}>
              <CommentsSection post={post} mode={mode} session={session} />
            </Suspense>
          </div>
        </main>

        {/* Right Sidebar - Mode Switcher */}
        <aside className="hidden md:block">
          <ReadingModeSwitcher mode={mode} onChange={setMode} />
        </aside>
      </div>
    </div>
  )
} 