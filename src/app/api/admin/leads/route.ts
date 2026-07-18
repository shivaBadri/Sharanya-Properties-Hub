import { NextResponse } from "next/server";
import { queryLeads, LEAD_STATUSES, type LeadStatus } from "@/lib/leads";
import { requireAdmin } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

// GET /api/admin/leads?q=&status=&sort=newest|oldest|name&page=1&pageSize=25
export async function GET(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const url = new URL(req.url);
  const q = url.searchParams.get("q")?.trim() || undefined;

  const statusParam = url.searchParams.get("status")?.trim();
  const status =
    statusParam && (LEAD_STATUSES as string[]).includes(statusParam)
      ? (statusParam as LeadStatus)
      : undefined;

  const sortParam = url.searchParams.get("sort");
  const sort = sortParam === "oldest" || sortParam === "name" ? sortParam : "newest";

  const page = Math.max(parseInt(url.searchParams.get("page") ?? "1", 10) || 1, 1);
  const pageSize = Math.min(
    Math.max(parseInt(url.searchParams.get("pageSize") ?? "25", 10) || 25, 1),
    200
  );

  const { leads, total } = await queryLeads({
    q,
    status,
    sort,
    limit: pageSize,
    offset: (page - 1) * pageSize,
  });

  return NextResponse.json({ ok: true, leads, total, page, pageSize });
}
