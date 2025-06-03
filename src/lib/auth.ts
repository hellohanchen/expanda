import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { NextAuthOptions, Session, User } from "next-auth"
import { JWT } from "next-auth/jwt"
import { prisma } from "./db"
import GoogleProvider from "next-auth/providers/google"
import { env } from "./env"
import { ExtendedSession } from "./types"
import { generateUsernameAndHandle } from "./utils/generate-username"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
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
  events: {
    async createUser({ user }) {
      // Generate username and handle for new users
      const { username, handle } = await generateUsernameAndHandle(user.name || 'user')
      
      // Update the user with the generated username and handle
      await prisma.user.update({
        where: { id: user.id },
        data: { username, handle }
      })
    }
  },
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