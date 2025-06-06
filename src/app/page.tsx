import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { MainContent } from "@/components/layout/main-content"

export default async function HomePage() {
  const session = await getServerSession(authOptions)

  return (
    <div className="min-h-[calc(100vh-3.5rem)] w-full px-0 md:px-4 py-0 md:py-8">
      <MainContent 
        userName={session?.user?.name} 
        welcomeMessage="Check out the latest posts from the community" 
      />
    </div>
  )
} 