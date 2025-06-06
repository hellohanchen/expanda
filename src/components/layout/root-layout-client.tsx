'use client'

import { NextAuthProvider } from "@/components/auth/next-auth-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/layout/navbar"
import { Footer } from "@/components/layout/footer"
import { AuthGuard } from "@/components/auth/auth-guard"
import { ReadingModeProvider } from "@/contexts/reading-mode-context"
import { MobileReadingModeSwitcher } from "@/components/ui/mobile-reading-mode-switcher"
import { usePathname } from 'next/navigation'
import { useMobile } from "@/hooks/use-mobile"
import { useReadingMode } from "@/contexts/reading-mode-context"

interface RootLayoutClientProps {
  children: React.ReactNode
}

function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isMobile = useMobile()
  const { mode, setMode } = useReadingMode()
  
  // Public pages that don't require authentication and don't redirect authenticated users
  const publicPages = ['/privacy', '/terms']
  const isPublicPage = publicPages.includes(pathname)
  
  // Login page should redirect authenticated users
  const isLoginPage = pathname === '/login'
  
  // All other pages require authentication
  const requireAuth = !isPublicPage && !isLoginPage
  
  // Show navbar and reading mode switcher on authenticated pages
  const showNavigation = !isPublicPage && !isLoginPage

  return (
    <AuthGuard 
      requireAuth={requireAuth}
      redirectAuthenticatedUsers={isLoginPage}
    >
      <div className="relative flex min-h-screen flex-col">
        {showNavigation && <Navbar />}
        {showNavigation && isMobile && (
          <MobileReadingModeSwitcher mode={mode} onChange={setMode} />
        )}
        <main className={`flex-1 ${
          isMobile 
            ? showNavigation 
              ? 'pt-12 pb-20' 
              : 'pb-20'
            : 'pb-16'
        }`}>
          {children}
        </main>
        <Footer />
      </div>
    </AuthGuard>
  )
}

export function RootLayoutClient({ children }: RootLayoutClientProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <NextAuthProvider>
        <ReadingModeProvider>
          <LayoutContent>{children}</LayoutContent>
        </ReadingModeProvider>
      </NextAuthProvider>
    </ThemeProvider>
  )
} 