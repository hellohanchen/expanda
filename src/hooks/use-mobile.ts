'use client'

import { useState, useEffect } from 'react'

export function useMobile(breakpoint: number = 768) {
  // Initialize with a function to check if we're likely on mobile
  const [isMobile, setIsMobile] = useState(() => {
    // Only run on client side
    if (typeof window === 'undefined') return false
    
    // Check both window width and user agent for better mobile detection
    const windowWidth = window.innerWidth
    const userAgent = navigator.userAgent
    const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(userAgent)
    
    // Return true if either condition is met (width < breakpoint OR mobile user agent)
    return windowWidth < breakpoint || isMobileUserAgent
  })

  useEffect(() => {
    const checkMobile = () => {
      const windowWidth = window.innerWidth
      const userAgent = navigator.userAgent
      const isMobileUserAgent = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i.test(userAgent)
      
      // Consider mobile if width is less than breakpoint OR it's a mobile user agent
      setIsMobile(windowWidth < breakpoint || isMobileUserAgent)
    }

    // Check on mount
    checkMobile()

    // Add event listener for resize
    window.addEventListener('resize', checkMobile)

    // Cleanup
    return () => window.removeEventListener('resize', checkMobile)
  }, [breakpoint])

  return isMobile
} 