'use client'

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectAuthenticatedUsers?: boolean
}

export function AuthGuard({ 
  children, 
  requireAuth = false, 
  redirectAuthenticatedUsers = false 
}: AuthGuardProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return

    // Redirect unauthenticated users from protected pages
    if (!session && requireAuth) {
      router.push('/login')
    }

    // Redirect authenticated users from login page
    if (session && redirectAuthenticatedUsers) {
      router.push('/')
    }
  }, [session, status, requireAuth, redirectAuthenticatedUsers, router])

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  return <>{children}</>
} 