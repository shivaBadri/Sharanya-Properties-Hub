import { NextResponse } from "next/server";
import { updateLeadStatus, deleteLead, LEAD_STATUSES, type LeadStatus } from "@/lib/leads";
import { requireAdmin } from "@/lib/adminAuth";

export const dynamic = "force-dynamic";

// PATCH /api/admin/leads/:id  { status }
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const status = body?.status;
  if (!status || !(LEAD_STATUSES as string[]).includes(status)) {
    return NextResponse.json(
      { ok: false, error: `Status must be one of: ${LEAD_STATUSES.join(", ")}.` },
      { status: 400 }
    );
  }
  await updateLeadStatus(id, status as LeadStatus);
  return NextResponse.json({ ok: true });
}

// DELETE /api/admin/leads/:id
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await params;
  await deleteLead(id);
  return NextResponse.json({ ok: true });
}
