import { pool, hasDatabase } from "@/lib/db";
import { ventures as staticVentures, type Venture } from "@/data/ventures";
import type { VentureInput } from "@/lib/ventureSchema";

type DbStatus = "ONGOING" | "UPCOMING" | "READY" | "SOLD_OUT";

const DB_TO_DISPLAY: Record<DbStatus, Venture["status"]> = {
  ONGOING: "Ongoing",
  UPCOMING: "Upcoming",
  READY: "Ready to Register",
  SOLD_OUT: "Sold Out",
};

export interface VentureRecord {
  id: string;
  slug: string;
  name: string;
  location: string;
  city: string;
  type: string;
  status: DbStatus;
  publishState: "DRAFT" | "PUBLISHED";
  featured: boolean;
  priceLabel: string;
  tagline: string;
  summary: string;
  extent?: string;
  plots?: string;
  sizeRange?: string;
  mapQuery: string;
  highlights: string[];
  amenities: string[];
  approvals: string[];
  connectivity: { label: string; time: string }[];
  coverImage?: string;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

function asString(v: unknown): string | undefined {
  return v == null ? undefined : String(v);
}
function iso(v: unknown): string {
  if (v instanceof Date) return v.toISOString();
  return String(v);
}

function rowToRecord(r: Record<string, unknown>): VentureRecord {
  return {
    id: String(r.id),
    slug: String(r.slug),
    name: String(r.name),
    location: String(r.location),
    city: String(r.city),
    type: String(r.type),
    status: r.status as DbStatus,
    publishState: r.publish_state as "DRAFT" | "PUBLISHED",
    featured: Boolean(r.featured),
    priceLabel: String(r.price_label),
    tagline: String(r.tagline),
    summary: String(r.summary),
    extent: asString(r.extent),
    plots: asString(r.plots),
    sizeRange: asString(r.size_range),
    mapQuery: String(r.map_query),
    highlights: (r.highlights as string[]) ?? [],
    amenities: (r.amenities as string[]) ?? [],
    approvals: (r.approvals as string[]) ?? [],
    connectivity: (r.connectivity as { label: string; time: string }[]) ?? [],
    coverImage: asString(r.cover_image),
    metaTitle: asString(r.meta_title),
    metaDescription: asString(r.meta_description),
    createdAt: iso(r.created_at),
    updatedAt: iso(r.updated_at),
  };
}

/** Map an admin record to the public `Venture` shape the site pages already use. */
export function toPublicVenture(r: VentureRecord): Venture {
  return {
    slug: r.slug,
    name: r.name,
    location: r.location,
    city: r.city,
    type: r.type as Venture["type"],
    status: DB_TO_DISPLAY[r.status],
    priceLabel: r.priceLabel,
    tagline: r.tagline,
    summary: r.summary,
    highlights: r.highlights,
    amenities: r.amenities,
    connectivity: r.connectivity,
    approvals: r.approvals,
    extent: r.extent,
    plots: r.plots,
    sizeRange: r.sizeRange,
    cover: r.coverImage || "",
    gallery: r.coverImage ? [r.coverImage] : [],
    mapQuery: r.mapQuery,
    featured: r.featured,
    metaTitle: r.metaTitle,
    metaDescription: r.metaDescription,
  };
}

// ── Public reads (DB → /data fallback) ───────────────────────────────────────

export async function getPublishedVentures(): Promise<Venture[]> {
  if (hasDatabase && pool) {
    const { rows } = await pool.query(
      `SELECT * FROM ventures WHERE publish_state = 'PUBLISHED' ORDER BY featured DESC, name ASC`
    );
    return rows.map(rowToRecord).map(toPublicVenture);
  }
  return staticVentures;
}

export async function getFeaturedVentures(limit = 3): Promise<Venture[]> {
  const all = await getPublishedVentures();
  return all.filter((v) => v.featured).slice(0, limit);
}

export async function getPublishedVentureBySlug(slug: string): Promise<Venture | null> {
  if (hasDatabase && pool) {
    const { rows } = await pool.query(
      `SELECT * FROM ventures WHERE slug = $1 AND publish_state = 'PUBLISHED' LIMIT 1`,
      [slug]
    );
    return rows[0] ? toPublicVenture(rowToRecord(rows[0])) : null;
  }
  return staticVentures.find((v) => v.slug === slug) ?? null;
}

export function getVentureFacets(list: Venture[]) {
  const uniq = (arr: string[]) => [...new Set(arr)].sort();
  return {
    locations: uniq(list.map((v) => v.location)),
    types: uniq(list.map((v) => v.type)),
    statuses: uniq(list.map((v) => v.status)),
  };
}

// ── Admin reads (DB required) ────────────────────────────────────────────────

export async function getAllVenturesAdmin(): Promise<VentureRecord[]> {
  if (!hasDatabase || !pool) return [];
  const { rows } = await pool.query(`SELECT * FROM ventures ORDER BY updated_at DESC`);
  return rows.map(rowToRecord);
}

export async function getVentureById(id: string): Promise<VentureRecord | null> {
  if (!hasDatabase || !pool) return null;
  const { rows } = await pool.query(`SELECT * FROM ventures WHERE id = $1 LIMIT 1`, [id]);
  return rows[0] ? rowToRecord(rows[0]) : null;
}

// ── Admin writes (DB required) ───────────────────────────────────────────────

function writeParams(v: VentureInput) {
  return [
    v.slug,
    v.name,
    v.location,
    v.city,
    v.type,
    v.status,
    v.publishState,
    v.featured,
    v.priceLabel,
    v.tagline,
    v.summary,
    v.extent || null,
    v.plots || null,
    v.sizeRange || null,
    v.mapQuery,
    v.highlights,
    v.amenities,
    v.approvals,
    JSON.stringify(v.connectivity),
    v.coverImage || null,
    v.metaTitle || null,
    v.metaDescription || null,
  ];
}

export async function createVenture(v: VentureInput): Promise<string> {
  const { rows } = await pool!.query(
    `INSERT INTO ventures
       (slug, name, location, city, type, status, publish_state, featured, price_label,
        tagline, summary, extent, plots, size_range, map_query,
        highlights, amenities, approvals, connectivity, cover_image, meta_title, meta_description)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19::jsonb,$20,$21,$22)
     RETURNING id`,
    writeParams(v)
  );
  return String(rows[0].id);
}

export async function updateVenture(id: string, v: VentureInput): Promise<void> {
  await pool!.query(
    `UPDATE ventures SET
       slug=$1, name=$2, location=$3, city=$4, type=$5, status=$6, publish_state=$7, featured=$8,
       price_label=$9, tagline=$10, summary=$11, extent=$12, plots=$13, size_range=$14, map_query=$15,
       highlights=$16, amenities=$17, approvals=$18, connectivity=$19::jsonb,
       cover_image=$20, meta_title=$21, meta_description=$22
     WHERE id=$23`,
    [...writeParams(v), id]
  );
}

export async function deleteVenture(id: string): Promise<void> {
  await pool!.query(`DELETE FROM ventures WHERE id = $1`, [id]);
}
