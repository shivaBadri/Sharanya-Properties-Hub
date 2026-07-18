import { pool, hasDatabase } from "@/lib/db";
import { galleryImages as staticGallery } from "@/data/gallery";
import type { MediaInput } from "@/lib/mediaSchema";

export interface MediaRecord {
  id: string;
  url: string;
  caption?: string;
  kind: "image" | "video";
  category?: string;
  ventureId?: string;
  ventureName?: string;
  sortOrder: number;
  createdAt: string;
}

export interface GalleryImage {
  src: string;
  caption: string;
  project: string;
}

function str(v: unknown): string | undefined {
  return v == null ? undefined : String(v);
}

function rowToRecord(r: Record<string, unknown>): MediaRecord {
  return {
    id: String(r.id),
    url: String(r.url),
    caption: str(r.caption),
    kind: (r.kind as "image" | "video") ?? "image",
    category: str(r.category),
    ventureId: str(r.venture_id),
    ventureName: str(r.venture_name),
    sortOrder: Number(r.sort_order ?? 0),
    createdAt: r.created_at instanceof Date ? r.created_at.toISOString() : String(r.created_at),
  };
}

// ── Public read (DB → /data fallback) ────────────────────────────────────────

export async function getGalleryImages(): Promise<GalleryImage[]> {
  if (hasDatabase && pool) {
    const { rows } = await pool.query(
      `SELECT m.url, m.caption, v.name AS venture_name
       FROM media m LEFT JOIN ventures v ON v.id = m.venture_id
       WHERE m.kind = 'image'
       ORDER BY m.sort_order ASC, m.created_at DESC`
    );
    return rows.map((r) => ({
      src: String(r.url),
      caption: r.caption ? String(r.caption) : "",
      project: r.venture_name ? String(r.venture_name) : "",
    }));
  }
  return staticGallery;
}

// ── Admin CRUD (DB required) ─────────────────────────────────────────────────

export async function getAllMedia(): Promise<MediaRecord[]> {
  if (!hasDatabase || !pool) return [];
  const { rows } = await pool.query(
    `SELECT m.*, v.name AS venture_name
     FROM media m LEFT JOIN ventures v ON v.id = m.venture_id
     ORDER BY m.sort_order ASC, m.created_at DESC`
  );
  return rows.map(rowToRecord);
}

export async function createMedia(input: MediaInput): Promise<string> {
  const { rows } = await pool!.query(
    `INSERT INTO media (url, caption, kind, category, venture_id, sort_order)
     VALUES ($1, $2, $3, $4, $5, COALESCE((SELECT MAX(sort_order) + 1 FROM media), 0))
     RETURNING id`,
    [
      input.url,
      input.caption || null,
      input.kind,
      input.category || null,
      input.ventureId || null,
    ]
  );
  return String(rows[0].id);
}

export async function updateMedia(id: string, input: MediaInput): Promise<void> {
  await pool!.query(
    `UPDATE media SET url = $1, caption = $2, kind = $3, category = $4, venture_id = $5 WHERE id = $6`,
    [input.url, input.caption || null, input.kind, input.category || null, input.ventureId || null, id]
  );
}

export async function deleteMedia(id: string): Promise<void> {
  await pool!.query(`DELETE FROM media WHERE id = $1`, [id]);
}

/** Set sort_order to the position of each id in the provided array. */
export async function reorderMedia(ids: string[]): Promise<void> {
  if (ids.length === 0) return;
  await pool!.query(
    `UPDATE media SET sort_order = t.ord - 1
     FROM (SELECT id, ord FROM unnest($1::text[]) WITH ORDINALITY AS u(id, ord)) t
     WHERE media.id = t.id`,
    [ids]
  );
}
