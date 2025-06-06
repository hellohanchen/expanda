'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import { cn } from "@/lib/utils"
import { useScrollState } from "@/hooks/use-scroll-state"
import { useReadingMode } from "@/contexts/reading-mode-context"
import { ReadingModeSwitcher } from "@/components/ui/reading-mode-switcher"
import { ContentEditor } from "@/components/post/content-editor"
import { useMobile } from "@/hooks/use-mobile"

export function CreatePageClient() {
  const { mode, setMode } = useReadingMode()
  const { data: session } = useSession()
  const scrollRef = useScrollState()
  const isMobile = useMobile()

  if (isMobile) {
    return (
      <div className="container mx-auto px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <div className="mb-4">
            <h1 className="text-2xl font-bold mb-1">Create Post</h1>
            <p className="text-sm text-muted-foreground mb-4">Share your thoughts</p>
            <ContentEditor mode="post" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto">
      <div className="grid h-full grid-cols-[250px_minmax(500px,_1fr)_250px] gap-6">
        {/* Left Sidebar */}
        <aside>
          <Card>
            <CardContent className="p-4 space-y-2">
              <Button 
                variant="ghost" 
                className={cn(
                  "w-full justify-start text-lg font-semibold",
                  "bg-accent"
                )}
              >
                Create Post
              </Button>
            </CardContent>
          </Card>
        </aside>

        {/* Main Content */}
        <main>
          <div ref={scrollRef} className="h-[calc(100vh-8rem)] overflow-y-auto scrollbar-modern">
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2">Create Post</h1>
              <p className="text-muted-foreground mb-8">Share your thoughts in multiple formats</p>
              <ContentEditor mode="post" />
            </div>
          </div>
        </main>

        {/* Right Sidebar - Mode Switcher */}
        <aside>
          <ReadingModeSwitcher mode={mode} onChange={setMode} />
        </aside>
      </div>
    </div>
  )
} 