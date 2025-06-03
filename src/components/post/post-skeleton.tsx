import { Card } from "@/components/ui/card"

export function PostSkeleton() {
  return (
    <Card className="p-4">
      <div className="flex gap-4">
        <div className="h-12 w-12 rounded-full bg-muted animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-24 bg-muted animate-pulse rounded" />
          <div className="h-4 w-full bg-muted animate-pulse rounded" />
        </div>
      </div>
    </Card>
  )
} 