import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { ProfileForm } from "@/components/user/profile-form"
import { Card } from "@/components/ui/card"

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    redirect("/login")
  }

  return (
    <div className="h-[calc(100vh-3.5rem)] w-full px-4 py-8">
      <div className="container mx-auto h-full">
        <div className="grid h-full grid-cols-1 md:grid-cols-[250px_1fr_250px] gap-6">
          {/* Left Sidebar */}
          <aside className="hidden md:block" />

          {/* Main Content */}
          <main className="h-full overflow-auto">
            <Card className="p-6">
              <h1 className="text-2xl font-bold mb-8">Profile Settings</h1>
              <ProfileForm user={session.user} />
            </Card>
          </main>

          {/* Right Sidebar */}
          <aside className="hidden md:block" />
        </div>
      </div>
    </div>
  )
} 