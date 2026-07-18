import { promises as fs } from "fs";
import path from "path";
import { pool, hasDatabase } from "@/lib/db";
import type { LeadStatus } from "@/lib/leadStatus";

export type { LeadStatus };
export { LEAD_STATUSES } from "@/lib/leadStatus";

export interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  project?: string;
  budget?: string;
  message?: string;
  source?: string;
  status: LeadStatus;
  createdAt: string;
}

export interface LeadInput {
  name: string;
  phone: string;
  email?: string;
  project?: string;
  budget?: string;
  message?: string;
  source?: string;
  ip?: string;
}

/**
 * ─────────────────────────────────────────────────────────────────────────
 *  Lead storage.
 *
 *  • If DATABASE_URL (or POSTGRES_URL) is set  → PostgreSQL via `pg`.
 *  • Otherwise                                 → local JSON file (dev only,
 *    zero setup; does NOT persist on Vercel's read-only filesystem).
 *
 *  Run db/schema.sql once against your database to create the `leads` table.
 *  (The full data model for the Phase-2 admin lives in prisma/schema.prisma.)
 * ─────────────────────────────────────────────────────────────────────────
 */

function newId(): string {
  return `lead_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
}

function normalize(input: LeadInput) {
  return {
    name: input.name.trim(),
    phone: input.phone.trim(),
    email: input.email?.trim() || undefined,
    project: input.project?.trim() || undefined,
    budget: input.budget?.trim() || undefined,
    message: input.message?.trim() || undefined,
    source: input.source?.trim() || undefined,
    ip: input.ip?.trim() || undefined,
  };
}

// ── Postgres path ──────────────────────────────────────────────────────────

// SQL returns NULL for empty optional columns; map to undefined to match Lead.
function rowToLead(r: Record<string, unknown>): Lead {
  return {
    id: r.id as string,
    name: r.name as string,
    phone: r.phone as string,
    email: (r.email as string | null) ?? undefined,
    project: (r.project as string | null) ?? undefined,
    budget: (r.budget as string | null) ?? undefined,
    message: (r.message as string | null) ?? undefined,
    source: (r.source as string | null) ?? undefined,
    status: r.status as LeadStatus,
    createdAt: r.createdAt as string,
  };
}

const LEAD_COLS = `id, name, phone, email, project, budget, message, source, status,
  to_char(created_at, 'YYYY-MM-DD"T"HH24:MI:SS"Z"') AS "createdAt"`;

async function saveLeadPg(input: LeadInput): Promise<Lead> {
  const n = normalize(input);
  const { rows } = await pool!.query(
    `INSERT INTO leads (name, phone, email, project, budget, message, source, ip, status)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'New')
     RETURNING ${LEAD_COLS}`,
    [
      n.name,
      n.phone,
      n.email ?? null,
      n.project ?? null,
      n.budget ?? null,
      n.message ?? null,
      n.source ?? "website",
      n.ip ?? null,
    ]
  );
  return rowToLead(rows[0]);
}

async function getLeadsPg(): Promise<Lead[]> {
  const { rows } = await pool!.query(
    `SELECT ${LEAD_COLS} FROM leads ORDER BY created_at DESC`
  );
  return rows.map(rowToLead);
}

async function updateLeadStatusPg(id: string, status: LeadStatus): Promise<void> {
  await pool!.query(`UPDATE leads SET status = $1 WHERE id = $2`, [status, id]);
}

// ── File fallback (dev) ──────────────────────────────────────────────────────

const DB_PATH = path.join(process.cwd(), "data", "leads.local.json");

async function readAllFile(): Promise<Lead[]> {
  try {
    return JSON.parse(await fs.readFile(DB_PATH, "utf-8")) as Lead[];
  } catch {
    return [];
  }
}

async function saveLeadFile(input: LeadInput): Promise<Lead> {
  const lead: Lead = { id: newId(), ...normalize(input), status: "New", createdAt: new Date().toISOString() };
  try {
    const all = await readAllFile();
    all.unshift(lead);
    await fs.writeFile(DB_PATH, JSON.stringify(all, null, 2), "utf-8");
  } catch (err) {
    console.warn("[leads] file store not writable (expected on Vercel):", err);
  }
  return lead;
}

// ── Public API (storage-agnostic) ────────────────────────────────────────────

export async function saveLead(input: LeadInput): Promise<Lead> {
  return hasDatabase ? saveLeadPg(input) : saveLeadFile(input);
}

export async function getLeads(): Promise<Lead[]> {
  return hasDatabase ? getLeadsPg() : readAllFile();
}

export async function updateLeadStatus(id: string, status: LeadStatus): Promise<void> {
  if (hasDatabase) return updateLeadStatusPg(id, status);
  const all = await readAllFile();
  const next = all.map((l) => (l.id === id ? { ...l, status } : l));
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(next, null, 2), "utf-8");
  } catch (err) {
    console.warn("[leads] file store not writable:", err);
  }
}

// ── Admin queries (Lead API — Module 2) ─────────────────────────────────────

export interface LeadQuery {
  q?: string;
  status?: LeadStatus;
  sort?: "newest" | "oldest" | "name";
  limit?: number;
  offset?: number;
}

function clampLimit(n: number | undefined): number {
  return Math.min(Math.max(n ?? 25, 1), 200);
}

async function queryLeadsPg(opts: LeadQuery): Promise<{ leads: Lead[]; total: number }> {
  const where: string[] = [];
  const params: unknown[] = [];
  if (opts.q) {
    params.push(`%${opts.q}%`);
    const i = `$${params.length}`;
    where.push(`(name ILIKE ${i} OR phone ILIKE ${i} OR email ILIKE ${i} OR project ILIKE ${i})`);
  }
  if (opts.status) {
    params.push(opts.status);
    where.push(`status = $${params.length}`);
  }
  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const order =
    opts.sort === "oldest" ? "created_at ASC" : opts.sort === "name" ? "name ASC" : "created_at DESC";
  const limit = clampLimit(opts.limit);
  const offset = Math.max(opts.offset ?? 0, 0);

  const countRes = await pool!.query(`SELECT count(*)::int AS n FROM leads ${whereSql}`, params);
  const total = (countRes.rows[0]?.n as number) ?? 0;

  const listParams = [...params, limit, offset];
  const { rows } = await pool!.query(
    `SELECT ${LEAD_COLS} FROM leads ${whereSql}
     ORDER BY ${order}
     LIMIT $${listParams.length - 1} OFFSET $${listParams.length}`,
    listParams
  );
  return { leads: rows.map(rowToLead), total };
}

async function deleteLeadPg(id: string): Promise<void> {
  await pool!.query(`DELETE FROM leads WHERE id = $1`, [id]);
}

function queryLeadsFile(all: Lead[], opts: LeadQuery): { leads: Lead[]; total: number } {
  let rows = all;
  if (opts.q) {
    const needle = opts.q.toLowerCase();
    rows = rows.filter((l) =>
      [l.name, l.phone, l.email, l.project].some((v) => v?.toLowerCase().includes(needle))
    );
  }
  if (opts.status) rows = rows.filter((l) => l.status === opts.status);
  if (opts.sort === "oldest") rows = [...rows].reverse();
  else if (opts.sort === "name") rows = [...rows].sort((a, b) => a.name.localeCompare(b.name));
  const total = rows.length;
  const limit = clampLimit(opts.limit);
  const offset = Math.max(opts.offset ?? 0, 0);
  return { leads: rows.slice(offset, offset + limit), total };
}

export async function queryLeads(opts: LeadQuery = {}): Promise<{ leads: Lead[]; total: number }> {
  if (hasDatabase) return queryLeadsPg(opts);
  return queryLeadsFile(await readAllFile(), opts);
}

export async function deleteLead(id: string): Promise<void> {
  if (hasDatabase) return deleteLeadPg(id);
  const all = await readAllFile();
  const next = all.filter((l) => l.id !== id);
  try {
    await fs.writeFile(DB_PATH, JSON.stringify(next, null, 2), "utf-8");
  } catch (err) {
    console.warn("[leads] file store not writable:", err);
  }
}

// ── Export (no pagination cap) — Module 5 ────────────────────────────────────

async function exportLeadsPg(opts: LeadQuery): Promise<Lead[]> {
  const where: string[] = [];
  const params: unknown[] = [];
  if (opts.q) {
    params.push(`%${opts.q}%`);
    const i = `$${params.length}`;
    where.push(`(name ILIKE ${i} OR phone ILIKE ${i} OR email ILIKE ${i} OR project ILIKE ${i})`);
  }
  if (opts.status) {
    params.push(opts.status);
    where.push(`status = $${params.length}`);
  }
  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const order =
    opts.sort === "oldest" ? "created_at ASC" : opts.sort === "name" ? "name ASC" : "created_at DESC";
  const { rows } = await pool!.query(`SELECT ${LEAD_COLS} FROM leads ${whereSql} ORDER BY ${order}`, params);
  return rows.map(rowToLead);
}

export async function exportLeads(opts: LeadQuery = {}): Promise<Lead[]> {
  if (hasDatabase) return exportLeadsPg(opts);
  let rows = await readAllFile();
  if (opts.q) {
    const needle = opts.q.toLowerCase();
    rows = rows.filter((l) =>
      [l.name, l.phone, l.email, l.project].some((v) => v?.toLowerCase().includes(needle))
    );
  }
  if (opts.status) rows = rows.filter((l) => l.status === opts.status);
  if (opts.sort === "oldest") rows = [...rows].reverse();
  else if (opts.sort === "name") rows = [...rows].sort((a, b) => a.name.localeCompare(b.name));
  return rows;
}
