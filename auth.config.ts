import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
  },

  providers: [],

  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.status = user.status;
      }

      return token;
    },

    session({ session, token }) {
      if (session.user) {
        session.user.id = String(
          token.id ?? token.sub ?? ""
        );

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
} satisfies NextAuthConfig;