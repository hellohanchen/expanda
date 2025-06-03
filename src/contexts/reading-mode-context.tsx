'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import type { ContentMode } from '@/components/post/mode-switcher'

interface ReadingModeContextType {
  mode: ContentMode
  setMode: (mode: ContentMode) => void
}

const ReadingModeContext = createContext<ReadingModeContextType | undefined>(undefined)

const STORAGE_KEY = 'expanda-reading-mode'
const DEFAULT_MODE: ContentMode = 'SHORT'

const isValidMode = (mode: string | null): mode is ContentMode => {
  return mode === 'HEADLINER' || mode === 'SHORT' || mode === 'FULL'
}

export function ReadingModeProvider({ children }: { children: ReactNode }) {
  // Initialize with default mode
  const [mode, setMode] = useState<ContentMode>(DEFAULT_MODE)
  const [isHydrated, setIsHydrated] = useState(false)

  // Load saved mode after hydration
  useEffect(() => {
    try {
      const savedMode = localStorage.getItem(STORAGE_KEY)
      if (savedMode && isValidMode(savedMode)) {
        setMode(savedMode)
      }
    } catch (error) {
      console.error('Error reading from localStorage:', error)
    }
    setIsHydrated(true)
  }, [])

  // Save mode changes to localStorage
  useEffect(() => {
    if (!isHydrated) return

    try {
      localStorage.setItem(STORAGE_KEY, mode)
    } catch (error) {
      console.error('Error writing to localStorage:', error)
    }
  }, [mode, isHydrated])

  const updateMode = (newMode: ContentMode) => {
    if (isValidMode(newMode)) {
      setMode(newMode)
    }
  }

  return (
    <ReadingModeContext.Provider value={{ mode, setMode: updateMode }}>
      {children}
    </ReadingModeContext.Provider>
  )
}

export function useReadingMode() {
  const context = useContext(ReadingModeContext)
  if (context === undefined) {
    throw new Error('useReadingMode must be used within a ReadingModeProvider')
  }
  return context
} 