import Link from "next/link"
import { MainNav } from "./main-nav"
import { ModeToggle } from "@/components/ui/mode-toggle"
import { UserNav } from "./user-nav"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="font-bold">Expanda</span>
        </Link>
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <ModeToggle />
          <UserNav />
        </div>
      </div>
    </header>
  )
} 