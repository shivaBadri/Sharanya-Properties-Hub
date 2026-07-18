import { NextResponse } from "next/server";
import { saveLead } from "@/lib/leads";
import { notifyNewLead } from "@/lib/notify";
import { leadSchema } from "@/lib/leadSchema";

export const dynamic = "force-dynamic";

/** Best-effort client IP from the usual proxy headers (Vercel sets these). */
function clientIp(req: Request): string | undefined {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() || undefined;
  return req.headers.get("x-real-ip") ?? undefined;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const parsed = leadSchema.safeParse(body);
    if (!parsed.success) {
      const msg = parsed.error.issues[0]?.message ?? "Please check the form and try again.";
      return NextResponse.json({ ok: false, error: msg }, { status: 400 });
    }
    const d = parsed.data;

    const lead = await saveLead({
      name: d.name,
      phone: d.phone,
      email: d.email || undefined,
      // "Preferred Venture" (new hero form) and "project" (existing LeadForm)
      // are the same field — store whichever was sent in the project column.
      project: d.venture || d.project || undefined,
      budget: d.budget || undefined,
      message: d.message || undefined,
      source: d.source?.trim() || "Home Page",
      ip: clientIp(req),
    });

    // Best-effort alert to sales (email + optional webhook). Never blocks or
    // fails the request — the lead is already saved at this point.
    await notifyNewLead(lead);

    return NextResponse.json({ ok: true, id: lead.id }, { status: 201 });
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request." }, { status: 400 });
  }
}
