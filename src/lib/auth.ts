import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { NextAuthOptions, Session, User } from "next-auth"
import { JWT } from "next-auth/jwt"
import { prisma } from "./db"
import GoogleProvider from "next-auth/providers/google"
import { env } from "./env"
import { ExtendedSession } from "./types"
import { generateUsernameAndHandle } from "./utils/generate-username"
import type { Adapter, AdapterUser } from "next-auth/adapters"

// Custom adapter that extends PrismaAdapter to handle username generation
function createCustomPrismaAdapter(): Adapter {
  const baseAdapter = PrismaAdapter(prisma)
  
  return {
    ...baseAdapter,
    async createUser(user: Omit<AdapterUser, "id"> & { id?: string }) {
      try {
        console.log("Creating user with data:", user)
        
        // Generate username and handle for new users
        const { username, handle } = await generateUsernameAndHandle(user.name || 'user')
        
        console.log("Generated username:", username, "handle:", handle)
        
        // Create user with generated username and handle
        // Let Prisma generate the ID if not provided
        const userData = {
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
          image: user.image,
          username,
          handle,
          ...(user.id && { id: user.id }),
        }
        
        const newUser = await prisma.user.create({
          data: userData,
        })
        
        console.log("Successfully created user:", newUser.id)
        return newUser
      } catch (error) {
        console.error("Error creating user:", error)
        throw error
      }
    }
  }
}

export const authOptions: NextAuthOptions = {
  adapter: createCustomPrismaAdapter(),
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login",
    signOut: "/logout",
    error: "/error",
    verifyRequest: "/verify-request",
  },
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_ID ?? "",
      clientSecret: env.GOOGLE_SECRET ?? "",
    }),
  ],
  callbacks: {
    async session({ session, token }: { session: Session; token: JWT }): Promise<ExtendedSession> {
      if (session?.user) {
        session.user.id = token.sub!
        
        // Fetch additional user data from database
        const dbUser = await prisma.user.findUnique({
          where: { id: token.sub },
          select: {
            username: true,
            handle: true,
            xUsername: true,
            mediumUsername: true,
            linkedinUrl: true,
            githubUsername: true,
            websiteUrl: true,
          },
        })

        if (dbUser) {
          session.user = {
            ...session.user,
            ...dbUser,
          }
        }
      }
      return session as ExtendedSession
    },
    async jwt({ token, user }: { token: JWT; user?: User }) {
      if (user) {
        token.sub = user.id
      }
      return token
    }
  }
} 