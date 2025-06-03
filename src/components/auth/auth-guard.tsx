'use client'

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
}

export function AuthGuard({ children, requireAuth = false }: AuthGuardProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return

    if (!session && requireAuth) {
      router.push('/login')
    }

    if (session && !requireAuth) {
      router.push('/')
    }
  }, [session, status, requireAuth, router])

  if (status === 'loading') {
    return <div>Loading...</div>
  }

  return <>{children}</>
} 