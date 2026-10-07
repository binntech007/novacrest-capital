
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
        session.user.id = token.id as string;
        session.user.role =
          token.role as "ADMIN" | "CUSTOMER";
        session.user.status =
          token.status as "ACTIVE" | "BLOCKED";
      }

      return session;
    },

    authorized({ auth, request }) {
      const pathname = request.nextUrl.pathname;
      const user = auth?.user;

      if (pathname.startsWith("/admin")) {
        return !!user &&
          user.role === "ADMIN" &&
          user.status === "ACTIVE";
      }

      if (pathname.startsWith("/dashboard")) {
        return !!user &&
          user.role === "CUSTOMER" &&
          user.status === "ACTIVE";
      }

      return true;
    },
  },
} satisfies NextAuthConfig;