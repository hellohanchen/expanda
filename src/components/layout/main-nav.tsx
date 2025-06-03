import Link from "next/link"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

const navItems = [
  {
    href: "/",
    label: "Home"
  },
  {
    href: "/explore",
    label: "Explore"
  },
  {
    href: "/bookmarks",
    label: "Bookmarks"
  }
]

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()

  return (
    <nav className={cn("flex items-center space-x-4 lg:space-x-6", className)} {...props}>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            pathname === item.href
              ? "text-foreground"
              : "text-foreground/60"
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )
} 