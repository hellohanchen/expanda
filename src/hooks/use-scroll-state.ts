import { useEffect, useRef } from 'react'

export function useScrollState() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    let scrollTimeout: NodeJS.Timeout

    const handleScroll = () => {
      element.classList.add('scrolling')
      
      // Clear the existing timeout
      clearTimeout(scrollTimeout)
      
      // Set a new timeout
      scrollTimeout = setTimeout(() => {
        element.classList.remove('scrolling')
      }, 150) // Remove class 150ms after scrolling stops
    }

    element.addEventListener('scroll', handleScroll)

    return () => {
      element.removeEventListener('scroll', handleScroll)
      clearTimeout(scrollTimeout)
    }
  }, [])

  return ref
} 