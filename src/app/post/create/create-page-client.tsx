'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import { cn } from "@/lib/utils"
import { useScrollState } from "@/hooks/use-scroll-state"
import { useReadingMode } from "@/contexts/reading-mode-context"
import { ReadingModeSwitcher } from "@/components/ui/reading-mode-switcher"
import { ContentEditor } from "@/components/post/content-editor"

export function CreatePageClient() {
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
                Create Post
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
              <h1 className="text-3xl font-bold mb-2">Create Post</h1>
              <p className="text-muted-foreground mb-8">Share your thoughts in multiple formats</p>
              <ContentEditor mode="post" />
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