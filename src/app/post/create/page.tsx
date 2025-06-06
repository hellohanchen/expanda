import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { CreatePageClient } from "./create-page-client"

export default async function CreatePostPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect("/login")
  }

  return (
    <div className="min-h-[calc(100vh-3.5rem)] w-full px-0 md:px-4 py-0 md:py-8">
      <CreatePageClient />
    </div>
  )
} 