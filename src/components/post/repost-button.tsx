'use client'

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Repeat } from "lucide-react"
import { useSession } from "next-auth/react"
import { toast } from "sonner"
import type { PostWithAuthor } from "@/lib/types"
import { useMobile } from "@/hooks/use-mobile"

interface RepostButtonProps {
  post: PostWithAuthor
  onSuccess?: () => void
}

export function RepostButton({ post, onSuccess }: RepostButtonProps) {
  const [loading, setLoading] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()
  const isMobile = useMobile()
  const [isReposted, setIsReposted] = useState(
    post.reposts?.some((repost) => repost.authorId === session?.user?.id) ?? false
  )
  const [repostCount, setRepostCount] = useState(post.reposts?.length ?? 0)

  const handleRepost = async () => {
    if (!session?.user) {
      toast.error("Please sign in to repost")
      return
    }

    try {
      setLoading(true)
      const response = await fetch("/api/posts/repost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId: post.id,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to repost")
      }

      const data = await response.json()
      setIsReposted(data.reposted)
      setRepostCount((prev: number) => data.reposted ? prev + 1 : prev - 1)
      toast.success(data.reposted ? "Post reposted!" : "Repost removed")
      router.refresh()
      onSuccess?.()
    } catch (error) {
      toast.error("Failed to repost")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className={`text-muted-foreground hover:text-foreground ${isMobile ? 'flex-1' : ''}`}
      onClick={handleRepost}
      disabled={loading}
    >
      <Repeat className={`h-4 w-4 ${isMobile ? 'mr-1' : 'mr-2'} ${isReposted ? "text-green-500" : ""}`} />
      <span className={isMobile ? 'text-xs' : 'text-sm'}>
        {repostCount > 0 && repostCount}
      </span>
    </Button>
  )
} 