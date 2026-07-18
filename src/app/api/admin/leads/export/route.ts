import { exportLeads, type LeadStatus } from "@/lib/leads";
import { LEAD_STATUSES } from "@/lib/leadStatus";
import { requireAdmin } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

function csvCell(v: string | undefined | null): string {
  const s = v == null ? "" : String(v);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

// GET /api/admin/leads/export?q=&status=&sort=  → CSV download (respects filters)
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

  const leads = await exportLeads({ q, status, sort });

  const header = ["Name", "Phone", "Email", "Venture", "Budget", "Status", "Source", "Message", "Created"];
  const lines = leads.map((l) =>
    [l.name, l.phone, l.email, l.project, l.budget, l.status, l.source, l.message, l.createdAt]
      .map(csvCell)
      .join(",")
  );
  const csv = [header.join(","), ...lines].join("\r\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="leads-${new Date().toISOString().slice(0, 10)}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
