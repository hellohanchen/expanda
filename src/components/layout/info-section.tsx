'use client'

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useSession } from "next-auth/react"
import Link from "next/link"

export function InfoSection() {
  const { data: session } = useSession()

  if (!session?.user) return null

  return (
    <Card className="sticky top-20">
      <CardHeader>
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage src={session.user.image ?? ""} />
            <AvatarFallback>{session.user.name?.[0]?.toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold">{session.user.name}</h2>
            <p className="text-sm text-muted-foreground">{session.user.email}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <nav className="space-y-2">
          <Link 
            href={`/profile/${session.user.id}`}
            className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            View Profile
          </Link>
          <Link 
            href="/settings" 
            className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Settings
          </Link>
        </nav>
      </CardContent>
    </Card>
  )
} 