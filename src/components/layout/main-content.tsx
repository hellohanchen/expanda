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
import { MobileFeedSwitcher } from "@/components/post/mobile-feed-switcher"
import { useMobile } from "@/hooks/use-mobile"
import { useState } from "react"

interface MainContentProps {
  userName?: string | null
  welcomeMessage?: string
}

export function MainContent({ userName }: MainContentProps) {
  const { mode, setMode } = useReadingMode()
  const scrollRef = useScrollState()
  const isMobile = useMobile()
  const [feedType, setFeedType] = useState<'all' | 'following'>('all')

  if (isMobile) {
    return (
      <div className="container mx-auto px-4">
        {/* Mobile Single Column Layout */}
        <div className="max-w-2xl mx-auto">
          <div className={userName ? "pb-20" : "pb-10"}>
            <PostsList mode={mode} feedType={feedType} />
          </div>
        </div>
        
        {/* Mobile Feed Switcher above footer */}
        {userName && (
          <MobileFeedSwitcher 
            activeTab={feedType} 
            onTabChange={setFeedType} 
          />
        )}
      </div>
    )
  }

  // Desktop layout (existing code)
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
          <div ref={scrollRef} className="h-[calc(100vh-8rem)] overflow-y-auto scrollbar-modern">
            <PostsList mode={mode} feedType={feedType} />
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