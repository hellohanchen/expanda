'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { UserWithProfile } from "@/lib/types"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface UserListProps {
  users: (UserWithProfile & { isFollowing: boolean })[]
  emptyMessage?: string
  pagination?: {
    total: number
    pages: number
    currentPage: number
  }
  onPageChange?: (page: number) => void
}

export function UserList({ users, emptyMessage = "No users found", pagination, onPageChange }: UserListProps) {
  const { data: session } = useSession()
  const router = useRouter()

  const handleFollowToggle = async (userId: string, isFollowing: boolean) => {
    if (!session?.user) {
      toast.error("Please sign in to follow users")
      return
    }

    try {
      const response = await fetch('/api/follow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update follow status')
      }

      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update follow status')
    }
  }

  if (!users.length) {
    return (
      <div className="text-center text-muted-foreground p-4">
        {emptyMessage}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        {users.map((user) => (
          <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center space-x-4 flex-grow">
              <Avatar>
                <AvatarImage src={user.image ?? undefined} />
                <AvatarFallback>{user.username?.[0]?.toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-grow">
                <Link href={`/profile/${user.id}`} className="hover:underline">
                  <p className="font-medium">{user.username}</p>
                  <p className="text-sm text-muted-foreground">@{user.handle}</p>
                </Link>
                <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                  <span>{user._count.posts} posts</span>
                  <span>{user._count.followers} followers</span>
                  <span>{user._count.following} following</span>
                </div>
              </div>
              {session?.user && session.user.id !== user.id && (
                <Button
                  variant={user.isFollowing ? "outline" : "default"}
                  onClick={() => handleFollowToggle(user.id, user.isFollowing)}
                >
                  {user.isFollowing ? "Unfollow" : "Follow"}
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {pagination && pagination.pages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={page === pagination.currentPage ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange?.(page)}
            >
              {page}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
} 