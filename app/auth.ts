import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/utils/db/prisma";
import authConfig from "./auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: process.env.AUTH_SECRET,
  ...authConfig,
  pages: {
    signIn: "/login",
    signOut: "/logout",
  },
  session: {
    strategy: "jwt",
    maxAge: 2592000, // 30 days,
    updateAge: 86400, // 24 hours
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        // Find user by email
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email as string },
        });

        if (existingUser) {
          // Ensure the OAuth account is linked
          await prisma.account.upsert({
            where: {
              provider_providerAccountId: {
                provider: "google",
                providerAccountId: account.providerAccountId,
              },
            },
            update: {}, // If exists, do nothing
            create: {
              userId: existingUser.id,
              provider: "google",
              providerAccountId: account.providerAccountId,
              type: account.type,
              access_token: account.access_token,
              refresh_token: account.refresh_token,
              expires_at: account.expires_at,
              token_type: account.token_type,
              id_token: account.id_token,
            },
          });
        }
      }

      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
        token.image = user.image;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id as string;
      session.user.name = token.name as string;
      session.user.email = token.email as string;
      session.user.image = token.image as string;
      return session;
    },
  },
  // events: {
  //   async signIn({ user }) {
  //     console.log("🟢 User signed in:", user);
  //   },
  //   async signOut(token) {
  //     console.log("🔴 User signed out:", token);
  //   },
  // },
  // debug: true,
});
