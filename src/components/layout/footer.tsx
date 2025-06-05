import Link from "next/link"

export function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-3">
        <div className="flex flex-col items-center justify-center space-y-1 text-xs text-muted-foreground sm:flex-row sm:space-y-0 sm:space-x-4">
          <div className="flex items-center space-x-3">
            <Link 
              href="/" 
              className="hover:text-foreground transition-colors"
            >
              Home
            </Link>
            <span className="text-muted-foreground/50">•</span>
            <Link 
              href="/privacy" 
              className="hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <span className="text-muted-foreground/50">•</span>
            <Link 
              href="/terms" 
              className="hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
          </div>
          <div className="hidden sm:block text-muted-foreground/50">•</div>
          <div className="text-center sm:text-left">
            © {new Date().getFullYear()} Expanda
          </div>
        </div>
      </div>
    </footer>
  )
} 