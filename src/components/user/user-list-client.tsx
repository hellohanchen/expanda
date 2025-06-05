'use client'

import { UserList } from "./user-list"
import { UserWithProfile } from "@/lib/types"

interface UserListClientProps {
  users: (UserWithProfile & { isFollowing: boolean })[]
  emptyMessage?: string
}

export function UserListClient({ users, emptyMessage }: UserListClientProps) {
  return (
    <UserList
      users={users}
      emptyMessage={emptyMessage}
    />
  )
} 