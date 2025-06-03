'use client'

import { Button } from "@/components/ui/button"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { toggleFollow } from "@/lib/actions/user"
import { toast } from "sonner"

interface FollowButtonProps {
  userId: string
  initialFollowing: boolean
  onFollowChange?: (isFollowing: boolean) => void
}

export function FollowButton({ userId, initialFollowing, onFollowChange }: FollowButtonProps) {
  const { data: session } = useSession()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isFollowing, setIsFollowing] = useState(initialFollowing)

  const handleFollow = () => {
    if (!session) {
      router.push('/login')
      return
    }

    startTransition(async () => {
      try {
        const result = await toggleFollow(userId)
        
        if (result.error) {
          toast.error(result.error)
          return
        }

        if (result.success) {
          setIsFollowing(result.following)
          onFollowChange?.(result.following)
          toast.success(result.following ? "Followed successfully!" : "Unfollowed successfully!")
          router.refresh()
        }
      } catch (error) {
        toast.error("Something went wrong")
      }
    })
  }

  return (
    <Button
      variant={isFollowing ? "outline" : "default"}
      onClick={handleFollow}
      disabled={isPending}
    >
      {isFollowing ? "Following" : "Follow"}
    </Button>
  )
} 