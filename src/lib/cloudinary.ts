import { v2 as cloudinary } from "cloudinary";

/**
 * Cloudinary auto-configures from the CLOUDINARY_URL env var when present.
 * Set CLOUDINARY_URL="cloudinary://<api_key>:<api_secret>@<cloud_name>".
 */
export const isCloudinaryConfigured = Boolean(
  process.env.CLOUDINARY_URL || process.env.CLOUDINARY_CLOUD_NAME
);

export async function uploadToCloudinary(
  buffer: Buffer,
  filename: string,
  resourceType: "image" | "raw" | "auto" = "image"
): Promise<string> {
  // Picks up CLOUDINARY_URL from the environment.
  cloudinary.config();
  const base = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  // For raw files (e.g. PDFs) keep the extension so the URL downloads correctly;
  // for images strip it so Cloudinary manages the format.
  const publicId = resourceType === "image" ? base.replace(/\.[^.]+$/, "") : base;
  return new Promise<string>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "sharanya", resource_type: resourceType, public_id: publicId, overwrite: false },
      (err, result) => {
        if (err || !result) reject(err ?? new Error("Cloudinary upload failed."));
        else resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
}

// ── Media Library (Cloudinary Admin API — Module 11) ─────────────────────────

export interface CloudResource {
  publicId: string;
  url: string;
  thumb: string;
  format: string;
  bytes: number;
  width: number;
  height: number;
  createdAt: string;
}

export interface CloudFolder {
  name: string;
  path: string;
}

/** Compressed, format-auto thumbnail URL for an asset. */
export function thumbUrl(publicId: string): string {
  cloudinary.config();
  return cloudinary.url(publicId, {
    width: 400,
    height: 300,
    crop: "fill",
    quality: "auto",
    fetch_format: "auto",
    secure: true,
  });
}

export async function listResources(
  folder?: string,
  cursor?: string
): Promise<{ resources: CloudResource[]; nextCursor?: string }> {
  cloudinary.config();
  const res = await cloudinary.api.resources({
    type: "upload",
    prefix: folder || undefined,
    max_results: 30,
    next_cursor: cursor || undefined,
  });
  const rows = (res.resources ?? []) as Array<Record<string, unknown>>;
  const resources = rows.map((r) => ({
    publicId: String(r.public_id),
    url: String(r.secure_url ?? ""),
    thumb: thumbUrl(String(r.public_id)),
    format: String(r.format ?? ""),
    bytes: Number(r.bytes ?? 0),
    width: Number(r.width ?? 0),
    height: Number(r.height ?? 0),
    createdAt: String(r.created_at ?? ""),
  }));
  return { resources, nextCursor: res.next_cursor };
}

export async function listFolders(path?: string): Promise<CloudFolder[]> {
  cloudinary.config();
  const res = path ? await cloudinary.api.sub_folders(path) : await cloudinary.api.root_folders();
  const folders = (res.folders ?? []) as Array<Record<string, unknown>>;
  return folders.map((f) => ({ name: String(f.name), path: String(f.path) }));
}

export async function deleteResource(publicId: string): Promise<void> {
  cloudinary.config();
  await cloudinary.uploader.destroy(publicId);
}
