'use client'

import { Button } from "@/components/ui/button"
import { Chrome } from "lucide-react"
import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { AuthGuard } from "@/components/auth/auth-guard"
import Link from "next/link"

export default function LoginPage() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || 'https://localhost:3001'

  return (
    <AuthGuard>
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="container max-w-md px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Welcome to Expanda</h1>
            <p className="text-muted-foreground">Sign in to continue</p>
          </div>

          <div className="space-y-4">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2 py-6 text-lg"
              onClick={() => signIn('google', { callbackUrl })}
            >
              <Chrome className="w-6 h-6" />
              Continue with Google
            </Button>
            
            <p className="text-center text-sm text-muted-foreground">
              By signing in, you agree to our{' '}
              <Link href="/terms" className="text-blue-600 hover:underline">
                Terms of Service
              </Link>{' '}
              and{' '}
              <Link href="/privacy" className="text-blue-600 hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
} 