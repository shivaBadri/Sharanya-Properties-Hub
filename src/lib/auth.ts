import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { pool, hasDatabase } from "@/lib/db";

/**
 * NextAuth (v4) — credentials login against the `users` table, JWT sessions.
 * No database adapter is needed for the JWT strategy; the `sessions` table in
 * the schema is reserved for a future database-session strategy.
 *
 * Password hashes are bcrypt (see scripts/create-admin.mjs to seed an admin).
 */
export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/admin/login" },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(creds) {
        const email = String(creds?.email ?? "").trim().toLowerCase();
        const password = String(creds?.password ?? "");
        if (!email || !password) return null;
        if (!hasDatabase || !pool) return null; // no DB configured → no login

        const { rows } = await pool.query(
          `SELECT id, name, email, password_hash, role
           FROM users WHERE lower(email) = $1 LIMIT 1`,
          [email]
        );
        const u = rows[0] as
          | { id: string; name: string; email: string; password_hash: string; role: string }
          | undefined;
        if (!u) return null;

        const ok = await bcrypt.compare(password, u.password_hash);
        if (!ok) return null;

        return { id: u.id, name: u.name, email: u.email, role: u.role };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
};
