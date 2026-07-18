import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { reorderMedia } from "@/lib/media";

export const dynamic = "force-dynamic";

// POST /api/admin/media/reorder  { ids: string[] }  (new display order)
export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const body = await req.json().catch(() => null);
  const ids = body?.ids;
  if (!Array.isArray(ids) || !ids.every((x) => typeof x === "string")) {
    return NextResponse.json({ ok: false, error: "Expected { ids: string[] }." }, { status: 400 });
  }
  await reorderMedia(ids);
  return NextResponse.json({ ok: true });
}
