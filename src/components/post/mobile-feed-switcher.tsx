'use client'

import { Button } from "@/components/ui/button"

interface MobileFeedSwitcherProps {
  activeTab: 'all' | 'following'
  onTabChange: (tab: 'all' | 'following') => void
}

export function MobileFeedSwitcher({ activeTab, onTabChange }: MobileFeedSwitcherProps) {
  return (
    <div className="fixed bottom-10 left-0 right-0 z-40 bg-background/95 backdrop-blur border-t supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-center gap-4">
          <Button
            variant={activeTab === 'all' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onTabChange('all')}
            className="flex-1 max-w-[120px]"
          >
            All Posts
          </Button>
          <Button
            variant={activeTab === 'following' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onTabChange('following')}
            className="flex-1 max-w-[120px]"
          >
            Following
          </Button>
        </div>
      </div>
    </div>
  )
} 