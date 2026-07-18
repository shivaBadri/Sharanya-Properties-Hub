import { pool, hasDatabase } from "@/lib/db";
import { getLeads, queryLeads } from "@/lib/leads";
import { ventures } from "@/data/ventures";
import { downloads } from "@/data/downloads";
import { galleryImages } from "@/data/gallery";
import { testimonials } from "@/data/content";

export interface DashboardStats {
  leads: number;
  ventures: number;
  media: number;
  downloads: number;
  testimonials: number;
}

export interface TrendPoint {
  label: string; // "YYYY-MM-DD" (daily) or "Mon" (monthly)
  value: number;
}

export interface ActivityItem {
  title: string;
  detail?: string;
  at: string; // ISO
}

// ── Stats ────────────────────────────────────────────────────────────────────

export async function getDashboardStats(): Promise<DashboardStats> {
  if (hasDatabase && pool) {
    const { rows } = await pool.query(`
      SELECT
        (SELECT count(*) FROM leads)          AS leads,
        (SELECT count(*) FROM ventures)       AS ventures,
        (SELECT count(*) FROM media)          AS media,
        (SELECT count(*) FROM download_files) AS downloads,
        (SELECT count(*) FROM testimonials)   AS testimonials
    `);
    const r = rows[0] as Record<string, string>;
    return {
      leads: Number(r.leads),
      ventures: Number(r.ventures),
      media: Number(r.media),
      downloads: Number(r.downloads),
      testimonials: Number(r.testimonials),
    };
  }
  // Fallback: DB not configured — count the static /data sources.
  const leads = await getLeads();
  return {
    leads: leads.length,
    ventures: ventures.length,
    media: galleryImages.length,
    downloads: downloads.length,
    testimonials: testimonials.length,
  };
}

// ── Charts ───────────────────────────────────────────────────────────────────

function zeroFillDays(days: number, counts: Map<string, number>): TrendPoint[] {
  const out: TrendPoint[] = [];
  const today = new Date();
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today);
    d.setUTCDate(d.getUTCDate() - i);
    const key = d.toISOString().slice(0, 10);
    out.push({ label: key, value: counts.get(key) ?? 0 });
  }
  return out;
}

function zeroFillMonths(months: number, counts: Map<string, number>): TrendPoint[] {
  const out: TrendPoint[] = [];
  const now = new Date();
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  for (let i = months - 1; i >= 0; i--) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
    const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
    out.push({ label: monthNames[d.getUTCMonth()], value: counts.get(key) ?? 0 });
  }
  return out;
}

export async function getLeadTrend(days = 30): Promise<TrendPoint[]> {
  const counts = new Map<string, number>();
  if (hasDatabase && pool) {
    const { rows } = await pool.query(
      `SELECT to_char(created_at::date, 'YYYY-MM-DD') AS d, count(*)::int AS n
       FROM leads
       WHERE created_at >= (now() - make_interval(days => $1::int))
       GROUP BY 1`,
      [days]
    );
    for (const r of rows as { d: string; n: number }[]) counts.set(r.d, Number(r.n));
  } else {
    const leads = await getLeads();
    for (const l of leads) {
      const key = l.createdAt.slice(0, 10);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return zeroFillDays(days, counts);
}

export async function getMonthlyEnquiries(months = 6): Promise<TrendPoint[]> {
  const counts = new Map<string, number>();
  if (hasDatabase && pool) {
    const { rows } = await pool.query(
      `SELECT to_char(date_trunc('month', created_at), 'YYYY-MM') AS m, count(*)::int AS n
       FROM leads
       WHERE created_at >= (date_trunc('month', now()) - make_interval(months => $1::int - 1))
       GROUP BY 1`,
      [months]
    );
    for (const r of rows as { m: string; n: number }[]) counts.set(r.m, Number(r.n));
  } else {
    const leads = await getLeads();
    for (const l of leads) {
      const key = l.createdAt.slice(0, 7);
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return zeroFillMonths(months, counts);
}

// ── Recent activity (derived from recent leads) ──────────────────────────────
// A full audit log (edits, logins, status changes) needs an activity table and
// is added once the CRUD modules that generate those events exist.

export async function getRecentActivity(limit = 8): Promise<ActivityItem[]> {
  const { leads } = await queryLeads({ sort: "newest", limit });
  return leads.map((l) => ({
    title: `New enquiry — ${l.name}`,
    detail: [l.project, l.budget].filter(Boolean).join(" · ") || l.source || "website",
    at: l.createdAt,
  }));
}
