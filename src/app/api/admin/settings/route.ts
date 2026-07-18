import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { getSettings, updateSettings } from "@/lib/settings";
import { settingsSchema } from "@/lib/settingsSchema";
import { hasDatabase } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  const settings = await getSettings();
  return NextResponse.json({ ok: true, settings });
}

export async function PUT(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  if (!hasDatabase) {
    return NextResponse.json({ ok: false, error: "A database (DATABASE_URL) is required to save settings." }, { status: 503 });
  }
  const body = await req.json().catch(() => null);
  const parsed = settingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: parsed.error.issues[0]?.message ?? "Invalid settings." }, { status: 400 });
  }
  await updateSettings(parsed.data);
  return NextResponse.json({ ok: true });
}
