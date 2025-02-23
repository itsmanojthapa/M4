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
    async signIn({ user }) {
      if (!user) {
        throw new Error("User not found");
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
