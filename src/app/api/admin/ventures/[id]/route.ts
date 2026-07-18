import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { getVentureById, updateVenture, deleteVenture } from "@/lib/ventures";
import { ventureSchema } from "@/lib/ventureSchema";

export const dynamic = "force-dynamic";

function isUniqueViolation(e: unknown): boolean {
  return typeof e === "object" && e !== null && (e as { code?: string }).code === "23505";
}

// GET /api/admin/ventures/:id
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;
  const venture = await getVentureById(id);
  if (!venture) return NextResponse.json({ ok: false, error: "Not found." }, { status: 404 });
  return NextResponse.json({ ok: true, venture });
}

// PUT /api/admin/ventures/:id — update
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;
  const existing = await getVentureById(id);
  if (!existing) return NextResponse.json({ ok: false, error: "Not found." }, { status: 404 });

  const body = await req.json().catch(() => null);
  const parsed = ventureSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.issues[0]?.message ?? "Invalid venture." },
      { status: 400 }
    );
  }
  try {
    await updateVenture(id, parsed.data);
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (isUniqueViolation(e)) {
      return NextResponse.json({ ok: false, error: "That slug is already in use." }, { status: 409 });
    }
    throw e;
  }
}

// DELETE /api/admin/ventures/:id
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;
  await deleteVenture(id);
  return NextResponse.json({ ok: true });
}
