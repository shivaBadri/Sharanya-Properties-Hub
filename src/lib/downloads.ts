import { pool, hasDatabase } from "@/lib/db";
import { downloads as staticDownloads } from "@/data/downloads";
import type { DownloadInput } from "@/lib/downloadSchema";

export interface DownloadRecord {
  id: string;
  label: string;
  category: string;
  url: string;
  sizeBytes?: number;
  downloadCount: number;
  ventureId?: string;
  ventureName?: string;
  createdAt: string;
}

export interface PublicDownload {
  label: string;
  project: string;
  category: string;
  file: string;
  uploaded: string;
  sizeBytes?: number;
}

function str(v: unknown): string | undefined {
  return v == null ? undefined : String(v);
}

function rowToRecord(r: Record<string, unknown>): DownloadRecord {
  return {
    id: String(r.id),
    label: String(r.label),
    category: String(r.category),
    url: String(r.url),
    sizeBytes: r.size_bytes == null ? undefined : Number(r.size_bytes),
    downloadCount: Number(r.download_count ?? 0),
    ventureId: str(r.venture_id),
    ventureName: str(r.venture_name),
    createdAt: r.created_at instanceof Date ? r.created_at.toISOString() : String(r.created_at),
  };
}

// ── Public read (DB → /data fallback) ────────────────────────────────────────

export async function getDownloads(): Promise<PublicDownload[]> {
  if (hasDatabase && pool) {
    const { rows } = await pool.query(
      `SELECT d.label, d.category, d.url, d.size_bytes, d.created_at, v.name AS venture_name
       FROM download_files d LEFT JOIN ventures v ON v.id = d.venture_id
       ORDER BY d.created_at DESC`
    );
    return rows.map((r) => ({
      label: String(r.label),
      project: r.venture_name ? String(r.venture_name) : "",
      category: String(r.category),
      file: String(r.url),
      uploaded: r.created_at instanceof Date ? r.created_at.toISOString().slice(0, 10) : String(r.created_at).slice(0, 10),
      sizeBytes: r.size_bytes == null ? undefined : Number(r.size_bytes),
    }));
  }
  return staticDownloads;
}

// ── Admin CRUD (DB required) ─────────────────────────────────────────────────

export async function getAllDownloads(): Promise<DownloadRecord[]> {
  if (!hasDatabase || !pool) return [];
  const { rows } = await pool.query(
    `SELECT d.*, v.name AS venture_name
     FROM download_files d LEFT JOIN ventures v ON v.id = d.venture_id
     ORDER BY d.created_at DESC`
  );
  return rows.map(rowToRecord);
}

export async function createDownload(input: DownloadInput): Promise<string> {
  const { rows } = await pool!.query(
    `INSERT INTO download_files (label, category, url, size_bytes, venture_id)
     VALUES ($1, $2, $3, $4, $5) RETURNING id`,
    [input.label, input.category, input.url, input.sizeBytes ?? null, input.ventureId || null]
  );
  return String(rows[0].id);
}

export async function updateDownload(id: string, input: DownloadInput): Promise<void> {
  await pool!.query(
    `UPDATE download_files SET label = $1, category = $2, url = $3, size_bytes = $4, venture_id = $5 WHERE id = $6`,
    [input.label, input.category, input.url, input.sizeBytes ?? null, input.ventureId || null, id]
  );
}

export async function deleteDownload(id: string): Promise<void> {
  await pool!.query(`DELETE FROM download_files WHERE id = $1`, [id]);
}
