'use client'

import { Button } from "@/components/ui/button"
import { Chrome } from "lucide-react"
import { signIn } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import { AuthGuard } from "@/components/auth/auth-guard"
import Link from "next/link"
import Image from "next/image"

export default function LoginPage() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || 'https://localhost:3001'

  return (
    <AuthGuard>
      <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
        <div className="container mx-auto px-4 py-12 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center max-w-7xl mx-auto">
            {/* Hero Section */}
            <div className="space-y-8">
              {/* Logo and Title */}
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                  Welcome to <span className="text-primary">Expanda</span>
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground">
                  Share Your Stories in Multiple Formats
                </p>
              </div>

              {/* Mobile-only Login Button */}
              <div className="block lg:hidden pt-2">
                <Button
                  size="lg"
                  className="w-full flex items-center justify-center gap-3 py-4 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200"
                  onClick={() => signIn('google', { callbackUrl })}
                >
                  <Chrome className="w-6 h-6" />
                  Get Started with Google
                </Button>
                <p className="text-center text-xs text-muted-foreground mt-2">
                  By signing in, you agree to our{' '}
                  <Link href="/terms" className="text-primary hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-primary hover:underline">
                    Privacy Policy
                  </Link>
                </p>
              </div>

              {/* Main Description */}
              <div className="space-y-6">
                <p className="text-lg text-muted-foreground">
                  Expanda is a modern social media platform that lets you express yourself in three unique ways: 
                  quick headliners, detailed short posts, or comprehensive full articles. Connect with others and 
                  share your thoughts exactly how you want to.
                </p>
                <p className="text-lg text-muted-foreground">
                  Join thousands of creators who are already using Expanda to share their thoughts, 
                  stories, and ideas in the format that works best for them.
                </p>
              </div>

              {/* Three Modes Logos */}
              <div className="grid grid-cols-3 gap-6 pt-4">
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-full aspect-square flex items-center justify-center">
                    <Image
                      src="/expanda_logo_small.svg"
                      alt="Headliner Mode"
                      width={80}
                      height={80}
                      className="dark:invert w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-sm text-muted-foreground font-medium text-center">Headliner Mode</span>
                </div>
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-full aspect-square flex items-center justify-center">
                    <Image
                      src="/expanda_logo_medium.svg"
                      alt="Short Content Mode"
                      width={80}
                      height={80}
                      className="dark:invert w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-sm text-muted-foreground font-medium text-center">Short Content Mode</span>
                </div>
                <div className="flex flex-col items-center space-y-3">
                  <div className="w-full aspect-square flex items-center justify-center">
                    <Image
                      src="/expanda_logo_large.svg"
                      alt="Full Article Mode"
                      width={80}
                      height={80}
                      className="dark:invert w-full h-full object-contain"
                    />
                  </div>
                  <span className="text-sm text-muted-foreground font-medium text-center">Full Article Mode</span>
                </div>
              </div>

            </div>

            {/* How It Works Section */}
            <div className="space-y-8">
              <div className="text-center lg:text-left">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">How Expanda Works</h2>
                <p className="text-lg text-muted-foreground">
                  Four simple steps to start sharing your stories with the world
                </p>
              </div>

              <div className="space-y-8">
                {/* Step 1 - Login */}
                <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
                  <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0">
                    1
                  </div>
                  <div className="space-y-4 flex-1">
                    <h3 className="text-xl font-semibold">Sign In to Get Started</h3>
                    <p className="text-muted-foreground">
                      Join our community by signing in with your Google account. It's quick, secure, and gets you started instantly.
                    </p>
                    <div className="space-y-3">
                      <Button
                        size="lg"
                        className="w-full flex items-center justify-center gap-3 py-4 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200"
                        onClick={() => signIn('google', { callbackUrl })}
                      >
                        <Chrome className="w-6 h-6" />
                        Continue with Google
                      </Button>
                      <p className="text-center text-xs text-muted-foreground">
                        By signing in, you agree to our{' '}
                        <Link href="/terms" className="text-primary hover:underline">
                          Terms of Service
                        </Link>{' '}
                        and{' '}
                        <Link href="/privacy" className="text-primary hover:underline">
                          Privacy Policy
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>

                {/* Step 2 - Choose Format */}
                <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
                  <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0">
                    2
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">Choose Your Format</h3>
                    <p className="text-muted-foreground">
                      Select from headliners (up to 50 chars), short posts (50-280 chars), 
                      or full articles (280+ chars) based on what you want to share.
                    </p>
                  </div>
                </div>

                {/* Step 3 - Create & Share */}
                <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
                  <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0">
                    3
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">Create & Share</h3>
                    <p className="text-muted-foreground">
                      Write your content using our intuitive editor, add your thoughts, 
                      and share it with the Expanda community instantly.
                    </p>
                  </div>
                </div>

                {/* Step 4 - Engage & Connect */}
                <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-6">
                  <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-2xl font-bold flex-shrink-0">
                    4
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">Engage & Connect</h3>
                    <p className="text-muted-foreground">
                      Discover content from others, leave meaningful comments, like posts 
                      you enjoy, and follow creators who inspire you.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGuard>
  )
} 