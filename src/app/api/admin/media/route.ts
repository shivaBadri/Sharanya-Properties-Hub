import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { getAllMedia, createMedia } from "@/lib/media";
import { mediaSchema } from "@/lib/mediaSchema";
import { hasDatabase } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  const media = await getAllMedia();
  return NextResponse.json({ ok: true, media });
}

export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  if (!hasDatabase) {
    return NextResponse.json({ ok: false, error: "A database (DATABASE_URL) is required." }, { status: 503 });
  }
  const body = await req.json().catch(() => null);
  const parsed = mediaSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.issues[0]?.message ?? "Invalid." }, { status: 400 });
  }
  const id = await createMedia(parsed.data);
  return NextResponse.json({ ok: true, id }, { status: 201 });
}
