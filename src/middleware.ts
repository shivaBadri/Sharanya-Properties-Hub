import { withAuth } from "next-auth/middleware";

// Protect the admin UI. Runs on the edge and only inspects the JWT — no DB or
// bcrypt here (those live in the credentials `authorize`, which runs on Node).
// API routes under /api/admin are guarded in-handler (requireAdmin) so they can
// return JSON 401s instead of an HTML redirect.
export default withAuth({
  pages: { signIn: "/admin/login" },
  callbacks: {
    authorized: ({ req, token }) => {
      if (req.nextUrl.pathname === "/admin/login") return true; // public
      return !!token;
    },
  },
});

export const config = {
  matcher: ["/admin/:path*"],
};
