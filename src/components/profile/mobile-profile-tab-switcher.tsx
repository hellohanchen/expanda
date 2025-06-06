'use client'

import { Button } from "@/components/ui/button"

type ProfileTab = 'posts' | 'replies' | 'quotes' | 'reposts'

interface MobileProfileTabSwitcherProps {
  activeTab: ProfileTab
  onTabChange: (tab: ProfileTab) => void
  counts: {
    posts: number
    replies: number
    quotes: number
    reposts: number
  }
}

export function MobileProfileTabSwitcher({ activeTab, onTabChange, counts }: MobileProfileTabSwitcherProps) {
  const tabs = [
    { id: 'posts' as ProfileTab, label: 'Posts', count: counts.posts },
    { id: 'replies' as ProfileTab, label: 'Replies', count: counts.replies },
    { id: 'quotes' as ProfileTab, label: 'Quotes', count: counts.quotes },
    { id: 'reposts' as ProfileTab, label: 'Reposts', count: counts.reposts },
  ]

  return (
    <div className="fixed bottom-10 left-0 right-0 z-40 bg-background/95 backdrop-blur border-t supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-2">
        <div className="grid grid-cols-4 gap-1">
          {tabs.map(({ id, label, count }) => (
            <Button
              key={id}
              variant={activeTab === id ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onTabChange(id)}
              className="flex flex-col items-center h-12 px-1"
            >
              <span className="text-xs font-medium">{label}</span>
              {count > 0 && (
                <span className="text-xs opacity-75">{count}</span>
              )}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
} 