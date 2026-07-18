"use client";

import { useState } from "react";
import { Check, Loader2, MessageCircle } from "lucide-react";
import { ventures } from "@/data/ventures";
import { site, whatsappLink } from "@/data/site";
import { isValidEmail, isValidPhone } from "@/lib/utils";

interface Props {
  defaultProject?: string;
  compact?: boolean;
}

export default function LeadForm({ defaultProject = "", compact = false }: Props) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    project: defaultProject,
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError] = useState<string>("");

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (form.name.trim().length < 2) return setError("Please enter your name.");
    if (!isValidPhone(form.phone)) return setError("Please enter a valid phone number.");
    if (!isValidEmail(form.email)) return setError("Please enter a valid email, or leave it blank.");

    setStatus("loading");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("done");
    } catch {
      setStatus("error");
      setError("Something went wrong. Please call or WhatsApp us instead.");
    }
  }

  if (status === "done") {
    return (
      <div className="rounded-xl border border-gold/40 bg-gold/5 p-6 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gold text-ink">
          <Check className="h-6 w-6" aria-hidden />
        </div>
        <h3 className="mt-4 font-display text-xl font-semibold text-ink">Enquiry received</h3>
        <p className="mt-2 text-sm text-slate-ink">
          Thanks, {form.name.split(" ")[0]}. Our team will call you shortly. For a faster reply,
          message us on WhatsApp.
        </p>
        <a
          href={whatsappLink(`Hi, I just enquired about ${form.project || "your projects"}.`)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-gold mt-4"
        >
          <MessageCircle className="h-4 w-4" aria-hidden /> Continue on WhatsApp
        </a>
      </div>
    );
  }

  const inputCls =
    "w-full rounded-lg border border-line bg-white px-4 py-3 text-sm text-ink placeholder:text-slate/70 focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30";

  return (
    <form onSubmit={onSubmit} className="space-y-4" noValidate>
      <div className={compact ? "space-y-4" : "grid gap-4 sm:grid-cols-2"}>
        <div>
          <label htmlFor="lf-name" className="mb-1.5 block text-sm font-medium text-ink">
            Name
          </label>
          <input id="lf-name" value={form.name} onChange={set("name")} className={inputCls} placeholder="Your full name" required />
        </div>
        <div>
          <label htmlFor="lf-phone" className="mb-1.5 block text-sm font-medium text-ink">
            Phone
          </label>
          <input id="lf-phone" type="tel" value={form.phone} onChange={set("phone")} className={inputCls} placeholder="10-digit mobile number" required />
        </div>
      </div>

      <div className={compact ? "space-y-4" : "grid gap-4 sm:grid-cols-2"}>
        <div>
          <label htmlFor="lf-email" className="mb-1.5 block text-sm font-medium text-ink">
            Email <span className="text-slate">(optional)</span>
          </label>
          <input id="lf-email" type="email" value={form.email} onChange={set("email")} className={inputCls} placeholder="you@example.com" />
        </div>
        <div>
          <label htmlFor="lf-project" className="mb-1.5 block text-sm font-medium text-ink">
            Project of interest
          </label>
          <select id="lf-project" value={form.project} onChange={set("project")} className={inputCls}>
            <option value="">Any / not sure</option>
            {ventures.map((v) => (
              <option key={v.slug} value={v.name}>
                {v.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label htmlFor="lf-message" className="mb-1.5 block text-sm font-medium text-ink">
          Message <span className="text-slate">(optional)</span>
        </label>
        <textarea id="lf-message" value={form.message} onChange={set("message")} rows={compact ? 3 : 4} className={inputCls} placeholder="Plot size, budget, preferred location…" />
      </div>

      {error && <p className="text-sm font-medium text-red-600" role="alert">{error}</p>}

      <div className="flex flex-col items-stretch gap-3 sm:flex-row sm:items-center">
        <button type="submit" disabled={status === "loading"} className="btn-ink flex-1 disabled:opacity-70">
          {status === "loading" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Sending…
            </>
          ) : (
            "Request a call back"
          )}
        </button>
        <a
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-gold flex-1"
        >
          <MessageCircle className="h-4 w-4" aria-hidden /> WhatsApp {site.phoneDisplay}
        </a>
      </div>
      <p className="text-xs text-slate">
        By submitting, you agree to be contacted about your enquiry. We never share your details.
      </p>
    </form>
  );
}
