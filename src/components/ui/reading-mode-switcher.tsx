'use client'

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Newspaper, AlignLeft, BookOpen } from "lucide-react"
import { type ContentMode } from "@/components/post/mode-switcher"

interface ReadingModeSwitcherProps {
  mode: ContentMode
  onChange: (mode: ContentMode) => void
}

export function ReadingModeSwitcher({ mode, onChange }: ReadingModeSwitcherProps) {
  return (
    <Card className="p-4">
      <div className="space-y-2">
        <Button 
          variant={mode === 'HEADLINER' ? 'default' : 'ghost'} 
          className="w-full justify-start"
          onClick={() => onChange('HEADLINER')}
        >
          <Newspaper className="mr-2 h-4 w-4" />
          Headliner
        </Button>
        <Button 
          variant={mode === 'SHORT' ? 'default' : 'ghost'} 
          className="w-full justify-start"
          onClick={() => onChange('SHORT')}
        >
          <AlignLeft className="mr-2 h-4 w-4" />
          Short
        </Button>
        <Button 
          variant={mode === 'FULL' ? 'default' : 'ghost'} 
          className="w-full justify-start"
          onClick={() => onChange('FULL')}
        >
          <BookOpen className="mr-2 h-4 w-4" />
          Full
        </Button>
      </div>
    </Card>
  )
} 