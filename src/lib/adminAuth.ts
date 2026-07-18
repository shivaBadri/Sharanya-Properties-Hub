import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Guards admin API routes. Returns a 401 response when there is no valid
 * session, otherwise null. Any authenticated user passes today; per-role /
 * per-permission gating arrives with the Users module.
 */
export async function requireAdmin(): Promise<NextResponse | null> {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ ok: false, error: "Unauthorized." }, { status: 401 });
  }
  return null;
}
