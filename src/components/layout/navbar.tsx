import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { UserNav } from "./user-nav"
import { useReadingMode } from "@/contexts/reading-mode-context"
import { useMobile } from "@/hooks/use-mobile"

export function Navbar() {
  const { mode } = useReadingMode()
  const isMobile = useMobile()

  const logoSrc = {
    'HEADLINER': '/expanda_logo_small.svg',
    'SHORT': '/expanda_logo_medium.svg',
    'FULL': '/expanda_logo_large.svg'
  }[mode]

  if (isMobile) {
    return (
      <header className="fixed top-0 left-0 right-0 z-[60] w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Image
              src={logoSrc}
              alt="Expanda Logo"
              width={20}
              height={20}
              className="dark:invert"
            />
            <span className="font-bold">Expanda</span>
          </Link>
          
          {/* Create Post Button */}
          <Button size="sm" className="bg-black text-white hover:bg-black/90" asChild>
            <Link href="/post/create">Create</Link>
          </Button>
          
          {/* User Nav */}
          <UserNav />
        </div>
      </header>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="grid h-full w-full grid-cols-[250px_1fr_250px] gap-6">
          {/* Left Section - Logo */}
          <div className="flex items-center justify-center">
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

          {/* Middle Section - Create Post */}
          <div className="flex items-center justify-end">
            <Button className="bg-black text-white hover:bg-black/90" asChild>
              <Link href="/post/create">Create Post</Link>
            </Button>
          </div>

          {/* Right Section - User Nav */}
          <div className="flex items-center justify-center">
            <UserNav />
          </div>
        </div>
      </div>
    </header>
  )
} 