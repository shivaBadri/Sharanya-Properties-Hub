"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import {
  VENTURE_STATUSES,
  PUBLISH_STATES,
  VENTURE_STATUS_LABELS,
} from "@/lib/ventureSchema";

export interface VentureFormData {
  id?: string;
  slug: string;
  name: string;
  location: string;
  city: string;
  type: string;
  status: (typeof VENTURE_STATUSES)[number];
  publishState: (typeof PUBLISH_STATES)[number];
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
}

const lines = (s: string) => s.split("\n").map((l) => l.trim()).filter(Boolean);
const connLines = (s: string) =>
  lines(s).map((l) => {
    const [label, ...rest] = l.split("|");
    return { label: label.trim(), time: rest.join("|").trim() };
  }).filter((c) => c.label && c.time);

export default function VentureForm({
  mode,
  initial,
}: {
  mode: "create" | "edit";
  initial?: VentureFormData;
}) {
  const router = useRouter();
  const [f, setF] = useState({
    slug: initial?.slug ?? "",
    name: initial?.name ?? "",
    location: initial?.location ?? "",
    city: initial?.city ?? "Hyderabad",
    type: initial?.type ?? "Open Plots",
    status: (initial?.status ?? "ONGOING") as string,
    publishState: (initial?.publishState ?? "DRAFT") as string,
    featured: initial?.featured ?? false,
    priceLabel: initial?.priceLabel ?? "Price on request",
    tagline: initial?.tagline ?? "",
    summary: initial?.summary ?? "",
    extent: initial?.extent ?? "",
    plots: initial?.plots ?? "",
    sizeRange: initial?.sizeRange ?? "",
    mapQuery: initial?.mapQuery ?? "",
    coverImage: initial?.coverImage ?? "",
    metaTitle: initial?.metaTitle ?? "",
    metaDescription: initial?.metaDescription ?? "",
    highlights: (initial?.highlights ?? []).join("\n"),
    amenities: (initial?.amenities ?? []).join("\n"),
    approvals: (initial?.approvals ?? []).join("\n"),
    connectivity: (initial?.connectivity ?? []).map((c) => `${c.label} | ${c.time}`).join("\n"),
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const set =
    (k: Exclude<keyof typeof f, "featured">) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setF((prev) => ({ ...prev, [k]: e.target.value }));

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (f.name.trim().length < 2) return setError("Name is required.");
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(f.slug.trim()))
      return setError("Slug must be lowercase letters, numbers and hyphens.");
    if (!f.location.trim()) return setError("Location is required.");
    if (!f.type.trim()) return setError("Type is required.");

    const payload = {
      name: f.name,
      slug: f.slug,
      location: f.location,
      city: f.city,
      type: f.type,
      status: f.status,
      publishState: f.publishState,
      featured: f.featured,
      priceLabel: f.priceLabel,
      tagline: f.tagline,
      summary: f.summary,
      extent: f.extent,
      plots: f.plots,
      sizeRange: f.sizeRange,
      mapQuery: f.mapQuery,
      coverImage: f.coverImage,
      metaTitle: f.metaTitle,
      metaDescription: f.metaDescription,
      highlights: lines(f.highlights),
      amenities: lines(f.amenities),
      approvals: lines(f.approvals),
      connectivity: connLines(f.connectivity),
    };

    setSaving(true);
    try {
      const url = mode === "create" ? "/api/admin/ventures" : `/api/admin/ventures/${initial?.id}`;
      const res = await fetch(url, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Couldn't save the venture.");
        setSaving(false);
        return;
      }
      router.push("/admin/ventures");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setSaving(false);
    }
  }

  const input =
    "w-full rounded-lg border border-line bg-white px-3.5 py-2.5 text-sm text-ink outline-none focus:border-gold focus:ring-2 focus:ring-gold/30";
  const label = "mb-1.5 block text-sm font-medium text-ink";
  const card = "rounded-xl border border-line bg-white p-5 shadow-card";

  return (
    <div className="wrap max-w-3xl py-10 md:py-14">
      <Link href="/admin/ventures" className="inline-flex items-center gap-1 text-xs font-medium text-gold-deep hover:underline">
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden /> Ventures
      </Link>
      <h1 className="mt-1 font-display text-2xl font-semibold text-ink">
        {mode === "create" ? "New venture" : `Edit — ${initial?.name}`}
      </h1>

      <form onSubmit={onSubmit} noValidate className="mt-6 space-y-5">
        <div className={card}>
          <p className="mb-4 text-sm font-semibold text-ink">Basics</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={label} htmlFor="v-name">Name</label>
              <input id="v-name" value={f.name} onChange={set("name")} className={input} />
            </div>
            <div>
              <label className={label} htmlFor="v-slug">Slug</label>
              <input id="v-slug" value={f.slug} onChange={set("slug")} className={input} placeholder="sr-eco-park" />
            </div>
            <div>
              <label className={label} htmlFor="v-type">Type</label>
              <input id="v-type" value={f.type} onChange={set("type")} className={input} placeholder="Open Plots" />
            </div>
            <div>
              <label className={label} htmlFor="v-location">Location</label>
              <input id="v-location" value={f.location} onChange={set("location")} className={input} />
            </div>
            <div>
              <label className={label} htmlFor="v-city">City</label>
              <input id="v-city" value={f.city} onChange={set("city")} className={input} />
            </div>
            <div>
              <label className={label} htmlFor="v-price">Price label</label>
              <input id="v-price" value={f.priceLabel} onChange={set("priceLabel")} className={input} />
            </div>
          </div>
        </div>

        <div className={card}>
          <p className="mb-4 text-sm font-semibold text-ink">Status & visibility</p>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className={label} htmlFor="v-status">Status</label>
              <select id="v-status" value={f.status} onChange={set("status")} className={input}>
                {VENTURE_STATUSES.map((s) => (
                  <option key={s} value={s}>{VENTURE_STATUS_LABELS[s]}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={label} htmlFor="v-publish">Visibility</label>
              <select id="v-publish" value={f.publishState} onChange={set("publishState")} className={input}>
                {PUBLISH_STATES.map((s) => (
                  <option key={s} value={s}>{s === "PUBLISHED" ? "Published" : "Draft"}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 pb-2.5 text-sm text-ink">
                <input type="checkbox" checked={f.featured} onChange={(e) => setF((prev) => ({ ...prev, featured: e.target.checked }))} className="h-4 w-4 rounded border-line text-gold focus:ring-gold/40" />
                Featured on home
              </label>
            </div>
          </div>
        </div>

        <div className={card}>
          <p className="mb-4 text-sm font-semibold text-ink">Copy</p>
          <div className="space-y-4">
            <div>
              <label className={label} htmlFor="v-tagline">Tagline</label>
              <input id="v-tagline" value={f.tagline} onChange={set("tagline")} className={input} />
            </div>
            <div>
              <label className={label} htmlFor="v-summary">Summary</label>
              <textarea id="v-summary" value={f.summary} onChange={set("summary")} rows={3} className={input} />
            </div>
          </div>
        </div>

        <div className={card}>
          <p className="mb-4 text-sm font-semibold text-ink">Details</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={label} htmlFor="v-extent">Extent</label>
              <input id="v-extent" value={f.extent} onChange={set("extent")} className={input} placeholder="17.57 Acres" />
            </div>
            <div>
              <label className={label} htmlFor="v-plots">Plots / units</label>
              <input id="v-plots" value={f.plots} onChange={set("plots")} className={input} placeholder="225 Plots" />
            </div>
            <div>
              <label className={label} htmlFor="v-size">Size range</label>
              <input id="v-size" value={f.sizeRange} onChange={set("sizeRange")} className={input} placeholder="150 – 594 Sq. Yds" />
            </div>
            <div>
              <label className={label} htmlFor="v-map">Google Maps query</label>
              <input id="v-map" value={f.mapQuery} onChange={set("mapQuery")} className={input} placeholder="Nadergul, Hyderabad" />
            </div>
            <div className="sm:col-span-2">
              <label className={label} htmlFor="v-cover">Cover image path / URL</label>
              <input id="v-cover" value={f.coverImage} onChange={set("coverImage")} className={input} placeholder="/ventures/sr-eco-park.jpg" />
              <p className="mt-1 text-xs text-slate">Gallery images and brochures are managed in the Gallery and Downloads modules.</p>
            </div>
          </div>
        </div>

        <div className={card}>
          <p className="mb-1 text-sm font-semibold text-ink">Lists</p>
          <p className="mb-4 text-xs text-slate">One item per line.</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={label} htmlFor="v-hl">Highlights</label>
              <textarea id="v-hl" value={f.highlights} onChange={set("highlights")} rows={5} className={input} />
            </div>
            <div>
              <label className={label} htmlFor="v-am">Amenities</label>
              <textarea id="v-am" value={f.amenities} onChange={set("amenities")} rows={5} className={input} />
            </div>
            <div>
              <label className={label} htmlFor="v-ap">Approvals</label>
              <textarea id="v-ap" value={f.approvals} onChange={set("approvals")} rows={3} className={input} />
            </div>
            <div>
              <label className={label} htmlFor="v-conn">Connectivity <span className="text-slate">(Label | Time)</span></label>
              <textarea id="v-conn" value={f.connectivity} onChange={set("connectivity")} rows={3} className={input} placeholder="ORR Exit 14 | 5 mins" />
            </div>
          </div>
        </div>

        <div className={card}>
          <p className="mb-4 text-sm font-semibold text-ink">SEO</p>
          <div className="space-y-4">
            <div>
              <label className={label} htmlFor="v-mt">Meta title</label>
              <input id="v-mt" value={f.metaTitle} onChange={set("metaTitle")} className={input} />
            </div>
            <div>
              <label className={label} htmlFor="v-md">Meta description</label>
              <textarea id="v-md" value={f.metaDescription} onChange={set("metaDescription")} rows={2} className={input} />
            </div>
          </div>
        </div>

        {error && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
            {error}
          </p>
        )}

        <div className="flex items-center gap-3">
          <button type="submit" disabled={saving} className="btn-ink disabled:opacity-70">
            {saving ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Saving…</> : mode === "create" ? "Create venture" : "Save changes"}
          </button>
          <Link href="/admin/ventures" className="btn-ghost">Cancel</Link>
        </div>
      </form>
    </div>
  );
}
