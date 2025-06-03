'use client'

import { Suspense } from "react"
import { PostCard } from "@/components/post/post-card"
import { Card, CardContent } from "@/components/ui/card"
import type { PostWithAuthor } from "@/lib/types"
import { type ContentMode } from "@/components/post/mode-switcher"
import { Button } from "@/components/ui/button"
import { Quote } from "lucide-react"
import { useSession } from "next-auth/react"
import { cn } from "@/lib/utils"
import { useScrollState } from "@/hooks/use-scroll-state"
import { useReadingMode } from "@/contexts/reading-mode-context"
import { ReadingModeSwitcher } from "@/components/ui/reading-mode-switcher"
import { ContentEditor } from "@/components/post/content-editor"

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

interface QuotePageClientProps {
  post: PostWithAuthor
}

export function QuotePageClient({ post }: QuotePageClientProps) {
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
                Quote Post
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
              <h2 className="text-2xl font-bold mb-4">Quote Post</h2>
              <div className="rounded-lg border mb-8">
                <Suspense fallback={<PostSkeleton />}>
                  <PostCard post={post} mode={mode} isEmbedded />
                </Suspense>
              </div>
              <ContentEditor mode="quote" targetId={post.id} />
            </div>
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