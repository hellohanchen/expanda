'use client'

import { Button } from "@/components/ui/button"
import { AlignLeft, FileText, Type } from "lucide-react"

export type ContentMode = 'HEADLINER' | 'SHORT' | 'FULL'

interface ModeSwitcherProps {
  currentMode: ContentMode
  onChange: (mode: ContentMode) => void
}

export function ModeSwitcher({ currentMode, onChange }: ModeSwitcherProps) {
  return (
    <div className="flex items-center space-x-2 rounded-lg border p-1">
      <Button
        size="sm"
        variant={currentMode === 'HEADLINER' ? 'default' : 'ghost'}
        onClick={() => onChange('HEADLINER')}
        className="gap-2"
      >
        <Type className="h-4 w-4" />
        <span className="hidden sm:inline">Headliner</span>
      </Button>
      <Button
        size="sm"
        variant={currentMode === 'SHORT' ? 'default' : 'ghost'}
        onClick={() => onChange('SHORT')}
        className="gap-2"
      >
        <AlignLeft className="h-4 w-4" />
        <span className="hidden sm:inline">Short</span>
      </Button>
      <Button
        size="sm"
        variant={currentMode === 'FULL' ? 'default' : 'ghost'}
        onClick={() => onChange('FULL')}
        className="gap-2"
      >
        <FileText className="h-4 w-4" />
        <span className="hidden sm:inline">Full</span>
      </Button>
    </div>
  )
} 