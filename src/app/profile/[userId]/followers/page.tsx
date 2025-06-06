import { getFollowers } from "@/lib/actions/user"
import { FollowersListClient } from "@/components/user/followers-list-client"
import { UserWithProfile } from "@/lib/types"

interface FollowersPageProps {
  params: Promise<{
    userId: string
  }>
  searchParams: Promise<{
    page?: string
  }>
}

export default async function FollowersPage({ params, searchParams }: FollowersPageProps) {
  const [resolvedParams, resolvedSearchParams] = await Promise.all([
    params,
    searchParams
  ])
  const { userId } = resolvedParams
  const page = resolvedSearchParams.page ? parseInt(resolvedSearchParams.page) : 1
  const { data: followers, error, pagination } = await getFollowers(userId, page)

  if (error) {
    return (
      <div className="p-4">
        <p className="text-destructive">{error}</p>
      </div>
    )
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] w-full px-0 md:px-4 py-0 md:py-8">
      <div className="container mx-auto">
        <div className="grid h-full grid-cols-1 md:grid-cols-[250px_minmax(500px,_1fr)_250px] gap-0 md:gap-6">
          {/* Left Sidebar */}
          <aside className="hidden md:block">
            {/* You can add user info or navigation here */}
          </aside>

          {/* Main Content */}
          <main className="px-4 md:px-0 py-4 md:py-0">
            <h1 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Followers</h1>
            <FollowersListClient 
              users={followers as (UserWithProfile & { isFollowing: boolean })[]}
              pagination={pagination}
            />
          </main>

          {/* Right Sidebar - Empty */}
          <aside className="hidden md:block" />
        </div>
      </div>
    </div>
  )
} 