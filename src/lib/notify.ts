import type { Lead } from "@/lib/leads";
import { site } from "@/data/site";

/**
 * Fire notifications when a new lead arrives. Every channel is best-effort:
 * a failure here is logged but never thrown, so lead capture never breaks.
 *
 * Configure any subset via env:
 *   RESEND_API_KEY   + NOTIFY_EMAIL   → email alert to sales
 *   LEAD_WEBHOOK_URL                  → POST the lead JSON to any endpoint
 *                                       (e.g. a Zapier/Make/n8n flow that
 *                                        forwards to WhatsApp)
 */
export async function notifyNewLead(lead: Lead): Promise<void> {
  await Promise.allSettled([sendEmail(lead), sendWebhook(lead)]);
}

async function sendEmail(lead: Lead): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.NOTIFY_EMAIL;
  const from = process.env.NOTIFY_FROM || "leads@sharanyaproperties.in";
  if (!apiKey || !to) return;

  const lines = [
    `Name: ${lead.name}`,
    `Phone: ${lead.phone}`,
    lead.email ? `Email: ${lead.email}` : null,
    lead.project ? `Project: ${lead.project}` : null,
    lead.message ? `Message: ${lead.message}` : null,
    `Received: ${new Date(lead.createdAt).toLocaleString("en-IN")}`,
  ].filter(Boolean);

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: `${site.name} <${from}>`,
        to: [to],
        subject: `New enquiry: ${lead.name}${lead.project ? ` — ${lead.project}` : ""}`,
        text: lines.join("\n"),
        reply_to: lead.email || undefined,
      }),
    });
    if (!res.ok) console.warn("[notify] email failed:", res.status, await res.text());
  } catch (err) {
    console.warn("[notify] email error:", err);
  }
}

async function sendWebhook(lead: Lead): Promise<void> {
  const url = process.env.LEAD_WEBHOOK_URL;
  if (!url) return;
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ event: "lead.created", lead }),
    });
    if (!res.ok) console.warn("[notify] webhook failed:", res.status);
  } catch (err) {
    console.warn("[notify] webhook error:", err);
  }
}
