'use client'

import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { toggleLike } from "@/lib/actions/post"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

interface LikeButtonProps {
  postId: string
  initialLikeCount: number
  initialLiked: boolean
}

export function LikeButton({ postId, initialLikeCount, initialLiked }: LikeButtonProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const [liked, setLiked] = useState(initialLiked)

  const handleLike = () => {
    if (!session) {
      router.push('/login')
      return
    }

    startTransition(async () => {
      try {
        const result = await toggleLike(postId)
        
        if (result.error) {
          toast.error(result.error)
          return
        }

        if (result.data) {
          setLiked(result.data.liked)
          setLikeCount(prev => result.data?.liked ? prev + 1 : prev - 1)
          router.refresh()
        }
      } catch (error) {
        toast.error("Something went wrong")
      }
    })
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      className="gap-2"
      onClick={handleLike}
      disabled={isPending}
    >
      <Heart 
        className={cn(
          "h-4 w-4",
          liked && "fill-current text-red-500"
        )}
      />
      {likeCount}
    </Button>
  )
} 