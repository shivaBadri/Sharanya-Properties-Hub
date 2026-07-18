import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { getAllVenturesAdmin, createVenture } from "@/lib/ventures";
import { ventureSchema } from "@/lib/ventureSchema";
import { hasDatabase } from "@/lib/db";

export const dynamic = "force-dynamic";

function isUniqueViolation(e: unknown): boolean {
  return typeof e === "object" && e !== null && (e as { code?: string }).code === "23505";
}

// GET /api/admin/ventures — all ventures (incl. drafts)
export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  const ventures = await getAllVenturesAdmin();
  return NextResponse.json({ ok: true, ventures });
}

// POST /api/admin/ventures — create
export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  if (!hasDatabase) {
    return NextResponse.json(
      { ok: false, error: "A database connection (DATABASE_URL) is required to manage ventures." },
      { status: 503 }
    );
  }
  const body = await req.json().catch(() => null);
  const parsed = ventureSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid venture." },
      { status: 400 }
    );
  }
  try {
    const id = await createVenture(parsed.data);
    return NextResponse.json({ ok: true, id }, { status: 201 });
  } catch (e) {
    if (isUniqueViolation(e)) {
      return NextResponse.json({ ok: false, error: "That slug is already in use." }, { status: 409 });
    }
    throw e;
  }
}
