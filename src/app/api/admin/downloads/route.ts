import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { getAllDownloads, createDownload } from "@/lib/downloads";
import { downloadSchema } from "@/lib/downloadSchema";
import { hasDatabase } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  const downloads = await getAllDownloads();
  return NextResponse.json({ ok: true, downloads });
}

export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  if (!hasDatabase) {
    return NextResponse.json({ ok: false, error: "A database (DATABASE_URL) is required." }, { status: 503 });
  }
  const body = await req.json().catch(() => null);
  const parsed = downloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.issues[0]?.message ?? "Invalid." }, { status: 400 });
  }
  const id = await createDownload(parsed.data);
  return NextResponse.json({ ok: true, id }, { status: 201 });
}
