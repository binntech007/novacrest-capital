
import type { DefaultSession } from "next-auth";

type UserRole = "ADMIN" | "CUSTOMER";

declare module "next-auth" {
  interface User {
    role: UserRole;
    status: "ACTIVE" | "BLOCKED";
  }

  interface Session {
    user: {
      id: string;
      role: UserRole;
      status: "ACTIVE" | "BLOCKED";
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: UserRole;
    status?: "ACTIVE" | "BLOCKED";
  }
}