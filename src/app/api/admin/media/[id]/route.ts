import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { updateMedia, deleteMedia } from "@/lib/media";
import { mediaSchema } from "@/lib/mediaSchema";

export const dynamic = "force-dynamic";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = mediaSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.issues[0]?.message ?? "Invalid." }, { status: 400 });
  }
  await updateMedia(id, parsed.data);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const { id } = await params;
  await deleteMedia(id);
  return NextResponse.json({ ok: true });
}
