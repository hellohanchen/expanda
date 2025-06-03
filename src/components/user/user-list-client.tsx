'use client'

import { UserList } from "./user-list"
import { UserWithProfile } from "@/lib/types"
import { toast } from "sonner"

interface UserListClientProps {
  users: UserWithProfile[]
  emptyMessage?: string
}

export function UserListClient({ users, emptyMessage }: UserListClientProps) {
  const handleFollowToggle = async (userId: string, isFollowing: boolean) => {
    try {
      const response = await fetch('/api/follow', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, isFollowing }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update follow status')
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to update follow status')
      throw error
    }
  }

  return (
    <UserList
      users={users}
      emptyMessage={emptyMessage}
      onFollowToggle={handleFollowToggle}
    />
  )
} 