'use client'

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, AlignLeft, BookOpen, Reply, Repeat, ExternalLink, Quote, Newspaper, X } from "lucide-react"
import Link from "next/link"
import { formatDistanceToNow } from "date-fns"
import type { ContentMode } from "./mode-switcher"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useSession } from "next-auth/react"
import { cn } from "@/lib/utils"
import { RepostButton } from "./repost-button"
import type { PostWithAuthor } from "@/lib/types"
import { toggleLike } from "@/lib/actions/post"
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

function RelativeTime({ date }: { date: Date }) {
  const [relativeTime, setRelativeTime] = useState<string>('')

  useEffect(() => {
    setRelativeTime(formatDistanceToNow(new Date(date), { addSuffix: true }))
    const timer = setInterval(() => {
      setRelativeTime(formatDistanceToNow(new Date(date), { addSuffix: true }))
    }, 60000)
    return () => clearInterval(timer)
  }, [date])

  if (!relativeTime) return null

  return <span>{relativeTime}</span>
}

export interface PostCardProps {
  post: PostWithAuthor
  mode: ContentMode
  isEmbedded?: boolean
}

export function PostCard({ post, mode, isEmbedded }: PostCardProps) {
  const router = useRouter()
  const { data: session } = useSession()
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(post.likes?.length ?? 0)
  const [commentCount, setCommentCount] = useState(post.comments?.length ?? 0)
  const [quoteCount, setQuoteCount] = useState(post.quoted?.length ?? 0)
  const [overrideMode, setOverrideMode] = useState<ContentMode | null>(null)

  useEffect(() => {
    if (session?.user) {
      setIsLiked(post.likes?.some((like) => like.userId === session.user.id) ?? false)
    }
  }, [post.likes, session?.user])

  const handleLike = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!session?.user) {
      toast.error("Please sign in to like posts")
      return
    }

    try {
      const result = await toggleLike(post.id)

      if (result.error) {
        throw new Error(result.error)
      }

      if (result.data) {
        setIsLiked(result.data.liked)
        setLikeCount(prev => result.data!.liked ? prev + 1 : prev - 1)
      }
    } catch (error) {
      toast.error("Failed to like post")
    }
  }

  const handleCommentClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    router.push(`/post/${post.id}#comments`)
  }

  // If this is a repost, we should display the reposted content
  const displayPost = post.repostPost || post
  const currentMode = overrideMode || mode
  const hasShortContent = displayPost.shortContent && displayPost.shortContent !== displayPost.headliner
  const hasFullContent = displayPost.fullContent
  const hasExtendedContent = hasShortContent || hasFullContent

  const handleQuoteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!session?.user) {
      toast.error("Please sign in to quote posts")
      return
    }
    router.push(`/post/${displayPost.id}/quote`)
  }

  return (
    <Card 
      className={cn(
        "transition-colors hover:bg-muted/50",
        overrideMode && "border-2 border-primary/30",
        "transition-all duration-200 ease-in-out"
      )}
    >
      <CardHeader>
        <div className="flex items-center justify-between">
          <Link href={`/profile/${post.author.id}`} className="flex items-center space-x-2">
            <Avatar>
              <AvatarImage src={post.author.image ?? undefined} />
              <AvatarFallback>{post.author.username?.[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium leading-none">{post.author.username}</p>
              <p className="text-sm text-muted-foreground">@{post.author.handle}</p>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            {hasExtendedContent && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-8 w-8 transition-colors",
                    currentMode === "HEADLINER" && (
                      overrideMode === "HEADLINER" 
                        ? "bg-primary/10 text-primary hover:bg-primary/20" 
                        : "text-primary"
                    )
                  )}
                  onClick={() => setOverrideMode(
                    overrideMode === "HEADLINER" ? null : "HEADLINER"
                  )}
                  title="Show headliner"
                >
                  <Newspaper className="h-4 w-4" />
                </Button>
                {hasShortContent && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-8 w-8 transition-colors",
                      currentMode === "SHORT" && (
                        overrideMode === "SHORT" 
                          ? "bg-primary/10 text-primary hover:bg-primary/20" 
                          : "text-primary"
                      )
                    )}
                    onClick={() => setOverrideMode(
                      overrideMode === "SHORT" ? null : "SHORT"
                    )}
                    title="Show short content"
                  >
                    <AlignLeft className="h-4 w-4" />
                  </Button>
                )}
                {hasFullContent && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-8 w-8 transition-colors",
                      currentMode === "FULL" && (
                        overrideMode === "FULL" 
                          ? "bg-primary/10 text-primary hover:bg-primary/20" 
                          : "text-primary"
                      )
                    )}
                    onClick={() => setOverrideMode(
                      overrideMode === "FULL" ? null : "FULL"
                    )}
                    title="Show full content"
                  >
                    <BookOpen className="h-4 w-4" />
                  </Button>
                )}
                {overrideMode && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={() => setOverrideMode(null)}
                    title="Reset to default mode"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </>
            )}
            <Link 
              href={`/post/${post.id}`}
              className="hover:text-primary transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              <ExternalLink className="h-4 w-4" />
            </Link>
          </div>
        </div>
        {post.repostPost && (
          <div className="mt-2 space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Repeat className="h-4 w-4" />
              <span>Reposted from</span>
              <Link 
                href={`/profile/${post.repostPost.author.id}`}
                className="font-medium text-primary hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                @{post.repostPost.author.handle}
              </Link>
            </div>
          </div>
        )}
        {post.quotePost && (
          <div className="mt-2 space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Quote className="h-4 w-4" />
              <span>Quoting</span>
              <Link 
                href={`/profile/${post.quotePost.author.id}`}
                className="font-medium text-primary hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                @{post.quotePost.author.handle}
              </Link>
            </div>
            <Link 
              href={`/post/${post.quotePost.id}`}
              className="block text-sm text-muted-foreground hover:text-foreground"
              onClick={(e) => e.stopPropagation()}
            >
              {post.quotePost.headliner}
            </Link>
          </div>
        )}
        {post.parentPost && (
          <div className="mt-2 space-y-1">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Reply className="h-4 w-4" />
              <span>Replying to</span>
              <Link 
                href={`/profile/${post.parentPost.author.id}`}
                className="font-medium text-primary hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                @{post.parentPost.author.handle}
              </Link>
            </div>
            <Link 
              href={`/post/${post.parentPost.id}`}
              className="block text-sm text-muted-foreground hover:text-foreground"
              onClick={(e) => e.stopPropagation()}
            >
              {post.parentPost.headliner}
            </Link>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {post.repostPost ? (
          <>
            {currentMode === "HEADLINER" && (
              <p>{post.repostPost.headliner}</p>
            )}
            {currentMode === "SHORT" && (
              <div className="prose dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {post.repostPost.shortContent || post.repostPost.headliner}
                </ReactMarkdown>
              </div>
            )}
            {currentMode === "FULL" && (
              <div className="prose dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {post.repostPost.fullContent || post.repostPost.shortContent || post.repostPost.headliner}
                </ReactMarkdown>
              </div>
            )}
          </>
        ) : (
          <>
            {currentMode === "HEADLINER" && (
              <p>{post.headliner}</p>
            )}
            {currentMode === "SHORT" && (
              <div className="prose dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {post.shortContent || post.headliner}
                </ReactMarkdown>
              </div>
            )}
            {currentMode === "FULL" && (
              <div className="prose dark:prose-invert max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {post.fullContent || post.shortContent || post.headliner}
                </ReactMarkdown>
              </div>
            )}
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
            onClick={handleLike}
          >
            <Heart
              className={cn(
                "h-4 w-4 mr-2",
                isLiked && "fill-current text-red-500"
              )}
            />
            <span className="text-sm">{likeCount > 0 && likeCount}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
            onClick={handleCommentClick}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            <span className="text-sm">{commentCount > 0 && commentCount}</span>
          </Button>
          <RepostButton post={displayPost} />
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-foreground"
            onClick={handleQuoteClick}
          >
            <Quote className="h-4 w-4 mr-2" />
            <span className="text-sm">{quoteCount > 0 && quoteCount}</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
} 