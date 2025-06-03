import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { UserNav } from "./user-nav"
import { useReadingMode } from "@/contexts/reading-mode-context"
import { cn } from "@/lib/utils"

export function Navbar() {
  const { mode } = useReadingMode()

  const logoSrc = {
    'HEADLINER': '/expanda_logo_small.svg',
    'SHORT': '/expanda_logo_medium.svg',
    'FULL': '/expanda_logo_large.svg'
  }[mode]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="grid h-full w-full grid-cols-1 md:grid-cols-[250px_1fr_250px] gap-6">
          {/* Left Section - Logo */}
          <div className="hidden md:flex items-center justify-center">
            <Link href="/" className="flex items-center space-x-2">
              <Image
                src={logoSrc}
                alt="Expanda Logo"
                width={24}
                height={24}
                className="dark:invert"
              />
              <span className="font-bold">Expanda</span>
            </Link>
          </div>

          {/* Middle Section - Mobile Logo and Create Post */}
          <div className="flex items-center justify-between md:justify-end">
            {/* Logo only shows on mobile */}
            <Link href="/" className="md:hidden flex items-center space-x-2">
              <Image
                src={logoSrc}
                alt="Expanda Logo"
                width={20}
                height={20}
                className="dark:invert"
              />
              <span className="font-bold">Expanda</span>
            </Link>
            
            <Button className="bg-black text-white hover:bg-black/90" asChild>
              <Link href="/post/create">Create Post</Link>
            </Button>
          </div>

          {/* Right Section - User Nav */}
          <div className="hidden md:flex items-center justify-center">
            <UserNav />
          </div>

          {/* Mobile User Nav */}
          <div className="md:hidden">
            <UserNav />
          </div>
        </div>
      </div>
    </header>
  )
} 