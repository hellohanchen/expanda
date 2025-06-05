'use client'

import { NextAuthProvider } from "@/components/auth/next-auth-provider"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/layout/navbar"
import { AuthGuard } from "@/components/auth/auth-guard"
import { ReadingModeProvider } from "@/contexts/reading-mode-context"
import { usePathname } from 'next/navigation'

interface RootLayoutClientProps {
  children: React.ReactNode
}

export function RootLayoutClient({ children }: RootLayoutClientProps) {
  const pathname = usePathname()
  
  // Public pages that don't require authentication and don't redirect authenticated users
  const publicPages = ['/privacy', '/terms']
  const isPublicPage = publicPages.includes(pathname)
  
  // Login page should redirect authenticated users
  const isLoginPage = pathname === '/login'
  
  // All other pages require authentication
  const requireAuth = !isPublicPage && !isLoginPage

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <NextAuthProvider>
        <ReadingModeProvider>
          <AuthGuard 
            requireAuth={requireAuth}
            redirectAuthenticatedUsers={isLoginPage}
          >
            <div className="relative flex min-h-screen flex-col">
              {!isPublicPage && !isLoginPage && <Navbar />}
              <main className="flex-1">{children}</main>
            </div>
          </AuthGuard>
        </ReadingModeProvider>
      </NextAuthProvider>
    </ThemeProvider>
  )
} 