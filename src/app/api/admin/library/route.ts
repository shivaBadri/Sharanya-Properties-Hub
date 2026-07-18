import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { isCloudinaryConfigured, listResources, listFolders, deleteResource } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// GET /api/admin/library?folder=&cursor=  → Cloudinary assets + subfolders
export async function GET(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  if (!isCloudinaryConfigured) {
    return NextResponse.json(
      { ok: false, configured: false, error: "Cloudinary isn't configured. Set CLOUDINARY_URL to browse your media." },
      { status: 503 }
    );
  }
  const url = new URL(req.url);
  const folder = url.searchParams.get("folder")?.trim() || undefined;
  const cursor = url.searchParams.get("cursor")?.trim() || undefined;
  try {
    const [assets, folders] = await Promise.all([listResources(folder, cursor), listFolders(folder)]);
    return NextResponse.json({
      ok: true,
      configured: true,
      resources: assets.resources,
      nextCursor: assets.nextCursor ?? null,
      folders,
    });
  } catch {
    return NextResponse.json({ ok: false, configured: true, error: "Couldn't reach Cloudinary. Check your credentials." }, { status: 502 });
  }
}

// DELETE /api/admin/library   { publicId }
export async function DELETE(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  if (!isCloudinaryConfigured) {
    return NextResponse.json({ ok: false, error: "Cloudinary isn't configured." }, { status: 503 });
  }
  const body = await req.json().catch(() => null);
  const publicId = body?.publicId;
  if (!publicId || typeof publicId !== "string") {
    return NextResponse.json({ ok: false, error: "publicId is required." }, { status: 400 });
  }
  try {
    await deleteResource(publicId);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false, error: "Couldn't delete that asset." }, { status: 502 });
  }
}
