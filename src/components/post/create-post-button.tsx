'use client'

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"
import { useSession } from "next-auth/react"

export function CreatePostButton() {
  const { data: session } = useSession()

  if (!session) {
    return null
  }

  return (
    <Button asChild>
      <Link href="/post/create" className="gap-2">
        <Plus className="h-4 w-4" />
        Create Post
      </Link>
    </Button>
  )
} 