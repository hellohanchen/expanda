'use client'

import { ModeSwitcher, type ContentMode } from "./mode-switcher"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

interface ReadingModeSectionProps {
  currentMode: ContentMode
  onChange: (mode: ContentMode) => void
}

export function ReadingModeSection({ currentMode, onChange }: ReadingModeSectionProps) {
  return (
    <Card className="sticky top-20">
      <CardHeader>
        <h3 className="font-medium">Reading Mode</h3>
      </CardHeader>
      <CardContent>
        <ModeSwitcher currentMode={currentMode} onChange={onChange} />
      </CardContent>
    </Card>
  )
} 