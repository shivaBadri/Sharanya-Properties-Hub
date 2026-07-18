import type { DefaultSession } from "next-auth";

// Carry id + role through the session and JWT.
declare module "next-auth" {
  interface Session {
    user: { id: string; role: string } & DefaultSession["user"];
  }
  interface User {
    role: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: string;
  }
}
