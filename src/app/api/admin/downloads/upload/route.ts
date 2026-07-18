import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/adminAuth";
import { isCloudinaryConfigured, uploadToCloudinary } from "@/lib/cloudinary";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// POST /api/admin/downloads/upload  (multipart: field "file", a PDF) → { url, sizeBytes }
export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  if (!isCloudinaryConfigured) {
    return NextResponse.json(
      { ok: false, error: "File upload isn't configured. Set CLOUDINARY_URL, or paste a file URL instead." },
      { status: 503 }
    );
  }
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ ok: false, error: "No file provided." }, { status: 400 });
  }
  if (file.type && file.type !== "application/pdf") {
    return NextResponse.json({ ok: false, error: "Only PDF files are allowed." }, { status: 400 });
  }
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const url = await uploadToCloudinary(buffer, file.name, "raw");
    return NextResponse.json({ ok: true, url, sizeBytes: file.size });
  } catch {
    return NextResponse.json({ ok: false, error: "Upload failed. Please try again." }, { status: 502 });
  }
}
