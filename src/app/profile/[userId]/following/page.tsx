import { getFollowing } from "@/lib/actions/user"
import { FollowingListClient } from "@/components/user/following-list-client"
import { UserWithProfile } from "@/lib/types"

interface FollowingPageProps {
  params: Promise<{
    userId: string
  }>
  searchParams: Promise<{
    page?: string
  }>
}

export default async function FollowingPage({ params, searchParams }: FollowingPageProps) {
  const [resolvedParams, resolvedSearchParams] = await Promise.all([
    params,
    searchParams
  ])
  const { userId } = resolvedParams
  const page = resolvedSearchParams.page ? parseInt(resolvedSearchParams.page) : 1
  const { data: following, error, pagination } = await getFollowing(userId, page)

  if (error) {
    return (
      <div className="p-4">
        <p className="text-destructive">{error}</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto">
      <div className="grid h-full grid-cols-1 md:grid-cols-[250px_minmax(500px,_1fr)_250px] gap-6">
        {/* Left Sidebar */}
        <aside className="hidden md:block">
          {/* You can add user info or navigation here */}
        </aside>

        {/* Main Content */}
        <main>
          <h1 className="text-2xl font-bold mb-6">Following</h1>
          <FollowingListClient 
            users={following as (UserWithProfile & { isFollowing: boolean })[]}
            pagination={pagination}
          />
        </main>

        {/* Right Sidebar - Empty */}
        <aside className="hidden md:block" />
      </div>
    </div>
  )
} 