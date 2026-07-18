"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Loader2, Save } from "lucide-react";
import type { Settings } from "@/lib/settingsSchema";

const input =
  "w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-gold focus:ring-2 focus:ring-gold/30";
const label = "mb-1.5 block text-sm font-medium text-ink";
const card = "rounded-xl border border-line bg-white p-5 shadow-card";

function Field({ id, lbl, value, onChange, textarea = false, placeholder = "" }: {
  id: string;
  lbl: string;
  value: string;
  onChange: (v: string) => void;
  textarea?: boolean;
  placeholder?: string;
}) {
  return (
    <div>
      <label className={label} htmlFor={id}>{lbl}</label>
      {textarea ? (
        <textarea id={id} value={value} onChange={(e) => onChange(e.target.value)} rows={3} className={input} placeholder={placeholder} />
      ) : (
        <input id={id} value={value} onChange={(e) => onChange(e.target.value)} className={input} placeholder={placeholder} />
      )}
    </div>
  );
}

export default function SettingsManager() {
  const [f, setF] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/admin/settings", { cache: "no-store" });
        if (res.status === 401) {
          setError("Your session has expired. Please sign in again.");
          return;
        }
        if (!res.ok) throw new Error();
        const d = await res.json();
        setF(d.settings);
      } catch {
        setError("Couldn't load settings.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function top<K extends keyof Settings>(k: K, v: Settings[K]) {
    setF((prev) => (prev ? { ...prev, [k]: v } : prev));
    setSaved(false);
  }
  function sub<S extends "social" | "hero" | "footer">(section: S, k: keyof Settings[S], v: string) {
    setF((prev) => (prev ? { ...prev, [section]: { ...prev[section], [k]: v } } : prev));
    setSaved(false);
  }

  async function save() {
    if (!f) return;
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(f),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Couldn't save settings.");
      setSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't save settings.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="wrap py-20 text-center text-slate">
        <Loader2 className="mx-auto h-5 w-5 animate-spin" aria-hidden />
      </div>
    );
  }
  if (!f) {
    return (
      <div className="wrap py-16">
        <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{error || "Settings unavailable."}</p>
      </div>
    );
  }

  return (
    <div className="wrap max-w-3xl py-10 md:py-14">
      <Link href="/admin" className="inline-flex items-center gap-1 text-xs font-medium text-gold-deep hover:underline">
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden /> Dashboard
      </Link>
      <h1 className="mt-1 font-display text-2xl font-semibold text-ink">Website settings</h1>

      <div className="mt-6 space-y-5">
        <div className={card}>
          <p className="mb-4 text-sm font-semibold text-ink">Company</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="s-name" lbl="Name" value={f.name} onChange={(v) => top("name", v)} />
            <Field id="s-legal" lbl="Legal name" value={f.legalName} onChange={(v) => top("legalName", v)} />
            <div className="sm:col-span-2">
              <Field id="s-tagline" lbl="Tagline" value={f.tagline} onChange={(v) => top("tagline", v)} />
            </div>
            <div className="sm:col-span-2">
              <Field id="s-desc" lbl="Description" value={f.description} onChange={(v) => top("description", v)} textarea />
            </div>
            <div className="sm:col-span-2">
              <Field id="s-url" lbl="Site URL" value={f.url} onChange={(v) => top("url", v)} placeholder="https://sharanyaproperties.in" />
            </div>
          </div>
        </div>

        <div className={card}>
          <p className="mb-4 text-sm font-semibold text-ink">Contact</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="s-phone" lbl="Phone (tel:)" value={f.phone} onChange={(v) => top("phone", v)} placeholder="+919493702929" />
            <Field id="s-phoned" lbl="Phone (display)" value={f.phoneDisplay} onChange={(v) => top("phoneDisplay", v)} placeholder="+91 94937 02929" />
            <Field id="s-wa" lbl="WhatsApp number" value={f.whatsapp} onChange={(v) => top("whatsapp", v)} placeholder="919493702929" />
            <Field id="s-email" lbl="Email" value={f.email} onChange={(v) => top("email", v)} />
            <div className="sm:col-span-2">
              <Field id="s-addr" lbl="Address" value={f.address} onChange={(v) => top("address", v)} />
            </div>
            <div className="sm:col-span-2">
              <Field id="s-wamsg" lbl="WhatsApp opener message" value={f.whatsappMessage} onChange={(v) => top("whatsappMessage", v)} textarea />
            </div>
          </div>
        </div>

        <div className={card}>
          <p className="mb-4 text-sm font-semibold text-ink">Location & map</p>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field id="s-city" lbl="City" value={f.city} onChange={(v) => top("city", v)} />
            <Field id="s-region" lbl="Region" value={f.region} onChange={(v) => top("region", v)} />
            <Field id="s-country" lbl="Country" value={f.country} onChange={(v) => top("country", v)} />
            <div className="sm:col-span-3">
              <Field id="s-map" lbl="Google Maps query" value={f.mapQuery} onChange={(v) => top("mapQuery", v)} placeholder="Nadergul, Hyderabad, Telangana" />
            </div>
          </div>
        </div>

        <div className={card}>
          <p className="mb-4 text-sm font-semibold text-ink">Social links</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="s-ig" lbl="Instagram" value={f.social.instagram} onChange={(v) => sub("social", "instagram", v)} />
            <Field id="s-fb" lbl="Facebook" value={f.social.facebook} onChange={(v) => sub("social", "facebook", v)} />
            <Field id="s-yt" lbl="YouTube" value={f.social.youtube} onChange={(v) => sub("social", "youtube", v)} />
            <Field id="s-li" lbl="LinkedIn" value={f.social.linkedin} onChange={(v) => sub("social", "linkedin", v)} />
          </div>
        </div>

        <div className={card}>
          <p className="mb-4 text-sm font-semibold text-ink">Hero</p>
          <div className="space-y-4">
            <Field id="s-htitle" lbl="Hero title" value={f.hero.title} onChange={(v) => sub("hero", "title", v)} />
            <Field id="s-hsub" lbl="Hero subtitle" value={f.hero.subtitle} onChange={(v) => sub("hero", "subtitle", v)} textarea />
            <Field id="s-himg" lbl="Hero background image" value={f.hero.image} onChange={(v) => sub("hero", "image", v)} placeholder="/ventures/sree-city.jpg" />
          </div>
        </div>

        <div className={card}>
          <p className="mb-4 text-sm font-semibold text-ink">Footer</p>
          <Field id="s-foot" lbl="Footer note" value={f.footer.note} onChange={(v) => sub("footer", "note", v)} textarea />
        </div>

        {error && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">{error}</p>
        )}

        <div className="flex items-center gap-3">
          <button onClick={save} disabled={saving} className="btn-ink disabled:opacity-70">
            {saving ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Saving…</> : <><Save className="h-4 w-4" aria-hidden /> Save settings</>}
          </button>
          {saved && (
            <span className="inline-flex items-center gap-1 text-sm font-medium text-emerald-700">
              <Check className="h-4 w-4" aria-hidden /> Saved
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
