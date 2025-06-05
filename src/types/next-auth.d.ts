import { User } from "next-auth"

declare module "next-auth" {
  interface Session {
    user: User & {
      id: string
      username: string
      handle: string
      xUsername?: string | null
      mediumUsername?: string | null
      linkedinUrl?: string | null
      githubUsername?: string | null
      websiteUrl?: string | null
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
  }
} 