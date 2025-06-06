'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import type { UserWithProfile } from "@/lib/types"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useMobile } from "@/hooks/use-mobile"

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
  const isMobile = useMobile()

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

  if (isMobile) {
    return (
      <div className="space-y-6">
        <div className="space-y-3">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between px-3 py-3 border rounded-lg bg-card">
              <div className="flex items-center space-x-3 flex-grow min-w-0">
                <Avatar className="h-12 w-12 flex-shrink-0">
                  <AvatarImage src={user.image ?? undefined} />
                  <AvatarFallback>{user.username?.[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <div className="flex-grow min-w-0">
                  <Link href={`/profile/${user.id}`} className="block">
                    <p className="font-medium text-sm truncate">{user.username}</p>
                    <p className="text-xs text-muted-foreground truncate">@{user.handle}</p>
                  </Link>
                  <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                    <span>{user._count.posts}</span>
                    <span>{user._count.followers} followers</span>
                  </div>
                </div>
              </div>
              {session?.user && session.user.id !== user.id && (
                <Button
                  variant={user.isFollowing ? "outline" : "default"}
                  size="sm"
                  className="flex-shrink-0 ml-3 text-xs h-8 px-3"
                  onClick={() => handleFollowToggle(user.id, user.isFollowing)}
                >
                  {user.isFollowing ? "Unfollow" : "Follow"}
                </Button>
              )}
            </div>
          ))}
        </div>

        {pagination && pagination.pages > 1 && (
          <div className="flex justify-center gap-2 flex-wrap px-4">
            {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => {
              const page = pagination.currentPage <= 3 
                ? i + 1 
                : pagination.currentPage + i - 2
              return page <= pagination.pages ? page : null
            }).filter(Boolean).map((page) => (
              <Button
                key={page}
                variant={page === pagination.currentPage ? "default" : "outline"}
                size="sm"
                className="h-8 w-8 p-0 text-xs"
                onClick={() => onPageChange?.(page!)}
              >
                {page}
              </Button>
            ))}
            {pagination.pages > 5 && pagination.currentPage < pagination.pages - 2 && (
              <>
                {pagination.currentPage < pagination.pages - 3 && (
                  <span className="text-muted-foreground">...</span>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0 text-xs"
                  onClick={() => onPageChange?.(pagination.pages)}
                >
                  {pagination.pages}
                </Button>
              </>
            )}
          </div>
        )}
      </div>
    )
  }

  // Desktop layout
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