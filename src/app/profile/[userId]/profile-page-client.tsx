'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { PostCard } from "@/components/post/post-card"
import { Suspense } from "react"
import { Github, Globe, Linkedin, Twitter } from "lucide-react"
import Link from "next/link"
import { FollowButton } from "@/components/user/follow-button"
import { RepliesList, QuotesList, RepostsList } from "@/components/post/post-lists"
import { PostSkeleton } from "@/components/post/post-skeleton"
import { useReadingMode } from "@/contexts/reading-mode-context"
import { ReadingModeSwitcher } from "@/components/ui/reading-mode-switcher"
import { useScrollState } from "@/hooks/use-scroll-state"
import type { PostWithAuthor, UserWithProfile } from "@/lib/types"

interface ProfilePageClientProps {
  profile: UserWithProfile & {
    posts: PostWithAuthor[]
  }
  isCurrentUser: boolean
  isFollowing: boolean
}

function TabCounter({ count }: { count: number }) {
  return count > 0 ? (
    <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs">
      {count}
    </span>
  ) : null
}

export function ProfilePageClient({ profile, isCurrentUser, isFollowing }: ProfilePageClientProps) {
  const { mode, setMode } = useReadingMode()
  const scrollRef = useScrollState()

  return (
    <div className="container mx-auto">
      <div className="grid h-full grid-cols-1 md:grid-cols-[250px_minmax(500px,_1fr)_250px] gap-6">
        {/* Left Sidebar - User Info */}
        <aside className="hidden md:block">
          <Card className="sticky">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <Avatar className="h-24 w-24 mb-4">
                  <AvatarImage src={profile.image ?? ""} alt={profile.name ?? ""} />
                  <AvatarFallback>{profile.name?.[0]?.toUpperCase()}</AvatarFallback>
                </Avatar>
                <h1 className="text-2xl font-bold mb-1">{profile.username}</h1>
                <div className="mb-4 text-muted-foreground">
                  <div>@{profile.handle}</div>
                </div>
                <div className="grid grid-cols-3 gap-4 w-full mb-4">
                  <div className="text-center">
                    <div className="font-semibold">{profile._count.posts}</div>
                    <div className="text-sm text-muted-foreground">Posts</div>
                  </div>
                  <Link href={`/profile/${profile.id}/followers`} className="text-center hover:bg-muted rounded-md transition-colors">
                    <div className="font-semibold">{profile._count.followers}</div>
                    <div className="text-sm text-muted-foreground">Followers</div>
                  </Link>
                  <Link href={`/profile/${profile.id}/following`} className="text-center hover:bg-muted rounded-md transition-colors">
                    <div className="font-semibold">{profile._count.following}</div>
                    <div className="text-sm text-muted-foreground">Following</div>
                  </Link>
                </div>
                {!isCurrentUser && (
                  <FollowButton userId={profile.id} initialFollowing={isFollowing} />
                )}
                {isCurrentUser && (
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/settings">Edit Profile</Link>
                  </Button>
                )}
                <div className="flex items-center justify-center gap-4 mt-4">
                  {profile.xUsername && (
                    <a
                      href={`https://x.com/${profile.xUsername}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Twitter className="h-5 w-5" />
                    </a>
                  )}
                  {profile.githubUsername && (
                    <a
                      href={`https://github.com/${profile.githubUsername}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Github className="h-5 w-5" />
                    </a>
                  )}
                  {profile.linkedinUrl && (
                    <a
                      href={profile.linkedinUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                  )}
                  {profile.websiteUrl && (
                    <a
                      href={profile.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Globe className="h-5 w-5" />
                    </a>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* Main Content */}
        <main>
          {/* Mobile Mode Switcher */}
          <div className="md:hidden mb-6">
            <ReadingModeSwitcher mode={mode} onChange={setMode} />
          </div>

          <div 
            ref={scrollRef} 
            className="md:h-[calc(100vh-8rem)] md:overflow-y-scroll scrollbar-modern [scrollbar-gutter:stable]"
          >
            <Tabs defaultValue="posts">
              <TabsList className="w-full justify-start">
                <TabsTrigger value="posts" className="flex items-center">
                  Posts
                  <TabCounter count={profile._count.posts} />
                </TabsTrigger>
                <TabsTrigger value="replies" className="flex items-center">
                  Replies
                  <TabCounter count={profile._count.replies} />
                </TabsTrigger>
                <TabsTrigger value="quotes" className="flex items-center">
                  Quotes
                  <TabCounter count={profile._count.quotes} />
                </TabsTrigger>
                <TabsTrigger value="reposts" className="flex items-center">
                  Reposts
                  <TabCounter count={profile._count.reposts} />
                </TabsTrigger>
              </TabsList>

              <TabsContent value="posts" className="mt-6 space-y-4">
                <Suspense fallback={<PostSkeleton />}>
                  {profile.posts.map((post: PostWithAuthor) => (
                    <PostCard key={post.id} post={post} mode={mode} />
                  ))}
                  {profile.posts.length === 0 && (
                    <p className="text-center text-muted-foreground">No posts yet.</p>
                  )}
                </Suspense>
              </TabsContent>

              <TabsContent value="replies" className="mt-6 space-y-4">
                <RepliesList userId={profile.id} mode={mode} />
              </TabsContent>

              <TabsContent value="quotes" className="mt-6 space-y-4">
                <QuotesList userId={profile.id} mode={mode} />
              </TabsContent>

              <TabsContent value="reposts" className="mt-6 space-y-4">
                <RepostsList userId={profile.id} mode={mode} />
              </TabsContent>
            </Tabs>
          </div>
        </main>

        {/* Right Sidebar - Mode Switcher */}
        <aside className="hidden md:block">
          <ReadingModeSwitcher mode={mode} onChange={setMode} />
        </aside>
      </div>
    </div>
  )
} 