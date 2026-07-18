import { pool, hasDatabase } from "@/lib/db";
import { testimonials as staticTestimonials } from "@/data/content";
import type { TestimonialInput } from "@/lib/testimonialSchema";

export interface TestimonialRecord {
  id: string;
  name: string;
  location?: string;
  project?: string;
  rating: number;
  quote: string;
  published: boolean;
  sortOrder: number;
  createdAt: string;
}

export interface PublicTestimonial {
  name: string;
  location: string;
  rating: number;
  project: string;
  quote: string;
}

function str(v: unknown): string | undefined {
  return v == null ? undefined : String(v);
}

function rowToRecord(r: Record<string, unknown>): TestimonialRecord {
  return {
    id: String(r.id),
    name: String(r.name),
    location: str(r.location),
    project: str(r.project),
    rating: Number(r.rating ?? 5),
    quote: String(r.quote),
    published: Boolean(r.published),
    sortOrder: Number(r.sort_order ?? 0),
    createdAt: r.created_at instanceof Date ? r.created_at.toISOString() : String(r.created_at),
  };
}

// ── Public read (DB → /data fallback) ────────────────────────────────────────

export async function getTestimonials(): Promise<PublicTestimonial[]> {
  if (hasDatabase && pool) {
    const { rows } = await pool.query(
      `SELECT name, location, project, rating, quote
       FROM testimonials WHERE published = true
       ORDER BY sort_order ASC, created_at DESC`
    );
    return rows.map((r) => ({
      name: String(r.name),
      location: r.location ? String(r.location) : "",
      rating: Number(r.rating ?? 5),
      project: r.project ? String(r.project) : "",
      quote: String(r.quote),
    }));
  }
  return staticTestimonials;
}

// ── Admin CRUD (DB required) ─────────────────────────────────────────────────

export async function getAllTestimonials(): Promise<TestimonialRecord[]> {
  if (!hasDatabase || !pool) return [];
  const { rows } = await pool.query(`SELECT * FROM testimonials ORDER BY sort_order ASC, created_at DESC`);
  return rows.map(rowToRecord);
}

export async function createTestimonial(input: TestimonialInput): Promise<string> {
  const { rows } = await pool!.query(
    `INSERT INTO testimonials (name, location, project, rating, quote, published)
     VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
    [input.name, input.location || null, input.project || null, input.rating, input.quote, input.published]
  );
  return String(rows[0].id);
}

export async function updateTestimonial(id: string, input: TestimonialInput): Promise<void> {
  await pool!.query(
    `UPDATE testimonials SET name = $1, location = $2, project = $3, rating = $4, quote = $5, published = $6 WHERE id = $7`,
    [input.name, input.location || null, input.project || null, input.rating, input.quote, input.published, id]
  );
}

export async function deleteTestimonial(id: string): Promise<void> {
  await pool!.query(`DELETE FROM testimonials WHERE id = $1`, [id]);
}
