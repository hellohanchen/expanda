'use client'

import { UserList } from "./user-list"
import type { UserWithProfile } from "@/lib/types"
import { useRouter, usePathname, useSearchParams } from "next/navigation"

interface FollowersListClientProps {
  users: (UserWithProfile & { isFollowing: boolean })[]
  pagination?: {
    total: number
    pages: number
    currentPage: number
  }
}

export function FollowersListClient({ users, pagination }: FollowersListClientProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', page.toString())
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <UserList 
      users={users}
      emptyMessage="This user has no followers yet"
      pagination={pagination}
      onPageChange={handlePageChange}
    />
  )
} 