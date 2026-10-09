
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import bcrypt from "bcryptjs";

import { prisma } from "@/lib/prisma";
import { authConfig } from "@/auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,

  adapter: PrismaAdapter(prisma),

  session: {
    strategy: "jwt",
  },

  providers: [
    Credentials({
      name: "Email and Password",

      credentials: {
        email: {
          label: "Email",
          type: "email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        const email = String(
          credentials?.email ?? ""
        )
          .trim()
          .toLowerCase();

        const password = String(
          credentials?.password ?? ""
        );

        if (!email || !password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (
          !user ||
          user.status !== "ACTIVE" ||
          !user.password
        ) {
          return null;
        }

        const passwordMatches = await bcrypt.compare(
          password,
          user.password
        );

        if (!passwordMatches) {
          return null;
        }

        return {
          id: user.id,
          name:
            user.name ??
            `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim(),
          email: user.email,
          role: user.role,
          status: user.status,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.status = user.status;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = String(token.id ?? token.sub ?? "");

        if (
          token.role === "ADMIN" ||
          token.role === "CUSTOMER"
        ) {
          session.user.role = token.role;
        }

        if (
          token.status === "ACTIVE" ||
          token.status === "BLOCKED"
        ) {
          session.user.status = token.status;
        }
      }

      return session;
    },
  },
});