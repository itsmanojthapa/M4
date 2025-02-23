import { AuthError, type NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { signInSchema } from "@/lib/zod";
import { comparePassword } from "@/utils/password";
import prisma from "@/utils/db/prisma";

export default {
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    CredentialsProvider({
      credentials: {
        email: {
          label: "email",
          type: "text",
          placeholder: "address@gmail.com",
        },
        password: {
          label: "password",
          type: "password",
          placeholder: "********",
        },
      },
      authorize: async (credentials) => {
        let user: {
          id?: string;
          name?: string | null;
          password?: string | null;
          email?: string | null;
          image?: string | null;
        } | null = null;

        const { email, password } = await signInSchema.parseAsync(credentials);

        user = await prisma.user.findFirst({
          where: { email },
          select: { name: true, email: true, password: true, image: true },
        });
        if (!user) {
          throw new AuthError("User not found", { cause: "User not found" });
        }
        if (!user.password) {
          throw new AuthError(
            "Try Sign with Google. User password not found.",
            { cause: "Try Sign with Google. User password not found." },
          );
        }
        const isValid = await comparePassword(password, user.password);
        if (!isValid) {
          throw new AuthError("Invalid credentials.", {
            cause: "Invalid credentials.",
          });
        }

        if (isValid) return user;

        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
