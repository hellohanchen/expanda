'use client'

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"
import { type ContentMode } from "@/components/post/mode-switcher"
import { PostsList } from "@/components/post/posts-list"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useScrollState } from "@/hooks/use-scroll-state"
import { useReadingMode } from "@/contexts/reading-mode-context"
import { ReadingModeSwitcher } from "@/components/ui/reading-mode-switcher"
import { useState } from "react"

interface MainContentProps {
  userName?: string | null
  welcomeMessage?: string
}

export function MainContent({ userName }: MainContentProps) {
  const { mode, setMode } = useReadingMode()
  const scrollRef = useScrollState()
  const [feedType, setFeedType] = useState<'all' | 'following'>('all')

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
                  feedType === 'all' && "bg-accent"
                )}
                onClick={() => setFeedType('all')}
              >
                All Posts
              </Button>
              {userName && (
                <Button 
                  variant="ghost" 
                  className={cn(
                    "w-full justify-start text-lg font-semibold",
                    feedType === 'following' && "bg-accent"
                  )}
                  onClick={() => setFeedType('following')}
                >
                  Following
                </Button>
              )}
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
            <PostsList mode={mode} feedType={feedType} />
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