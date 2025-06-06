'use client'

import { Button } from "@/components/ui/button"
import { Newspaper, AlignLeft, BookOpen } from "lucide-react"
import { ContentMode } from "@/components/post/mode-switcher"

interface MobileReadingModeSwitcherProps {
  mode: ContentMode
  onChange: (mode: ContentMode) => void
}

export function MobileReadingModeSwitcher({ mode, onChange }: MobileReadingModeSwitcherProps) {
  const modes = [
    { value: "HEADLINER" as ContentMode, icon: Newspaper },
    { value: "SHORT" as ContentMode, icon: AlignLeft },
    { value: "FULL" as ContentMode, icon: BookOpen },
  ]

  return (
    <div className="fixed top-14 left-0 right-0 z-40 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-2">
        <div className="grid grid-cols-3 gap-2">
          {modes.map(({ value, icon: Icon }) => (
            <Button
              key={value}
              variant={mode === value ? "default" : "ghost"}
              size="sm"
              onClick={() => onChange(value)}
              className="h-8 w-full"
            >
              <Icon className="h-4 w-4" />
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
} 