"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Eye, EyeOff, Loader2, Plus, Star, Trash2 } from "lucide-react";

interface Testimonial {
  id: string;
  name: string;
  location?: string;
  project?: string;
  rating: number;
  quote: string;
  published: boolean;
}

const empty = { name: "", location: "", project: "", rating: 5, quote: "", published: true };

export default function TestimonialsManager() {
  const [items, setItems] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [draft, setDraft] = useState(empty);
  const [adding, setAdding] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/testimonials", { cache: "no-store" });
      if (res.status === 401) {
        setError("Your session has expired. Please sign in again.");
        return;
      }
      if (!res.ok) throw new Error();
      const d = await res.json();
      setItems(d.testimonials ?? []);
    } catch {
      setError("Couldn't load testimonials.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function add() {
    setError("");
    if (!draft.name.trim() || !draft.quote.trim()) {
      setError("Name and quote are required.");
      return;
    }
    setAdding(true);
    try {
      const res = await fetch("/api/admin/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      if (!res.ok) throw new Error();
      setDraft(empty);
      load();
    } catch {
      setError("Couldn't add the testimonial.");
    } finally {
      setAdding(false);
    }
  }

  async function patch(item: Testimonial, changes: Partial<Testimonial>) {
    const merged = { ...item, ...changes };
    setItems((its) => its.map((x) => (x.id === item.id ? merged : x)));
    try {
      const res = await fetch(`/api/admin/testimonials/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: merged.name,
          location: merged.location ?? "",
          project: merged.project ?? "",
          rating: merged.rating,
          quote: merged.quote,
          published: merged.published,
        }),
      });
      if (!res.ok) throw new Error();
    } catch {
      setError("Couldn't save that change.");
      load();
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this testimonial?")) return;
    try {
      const res = await fetch(`/api/admin/testimonials/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setItems((its) => its.filter((x) => x.id !== id));
    } catch {
      setError("Couldn't delete that testimonial.");
    }
  }

  const input =
    "w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-gold focus:ring-2 focus:ring-gold/30";
  const cell = "rounded border border-line bg-white px-2 py-1 text-xs text-ink outline-none focus:border-gold focus:ring-1 focus:ring-gold/30";

  function Rating({ value, onChange }: { value: number; onChange: (n: number) => void }) {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" onClick={() => onChange(n)} aria-label={`${n} stars`}>
            <Star className={`h-4 w-4 ${n <= value ? "fill-gold text-gold" : "text-line"}`} />
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="wrap py-10 md:py-14">
      <div>
        <Link href="/admin" className="inline-flex items-center gap-1 text-xs font-medium text-gold-deep hover:underline">
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden /> Dashboard
        </Link>
        <h1 className="mt-1 font-display text-2xl font-semibold text-ink">Testimonials</h1>
        <p className="text-sm text-slate">{items.length} total</p>
      </div>

      {/* Add */}
      <div className="mt-6 rounded-xl border border-line bg-white p-4 shadow-card">
        <p className="mb-3 text-sm font-semibold text-ink">Add a testimonial</p>
        <div className="grid gap-3 sm:grid-cols-3">
          <input value={draft.name} onChange={(e) => setDraft({ ...draft, name: e.target.value })} placeholder="Name" className={input} />
          <input value={draft.location} onChange={(e) => setDraft({ ...draft, location: e.target.value })} placeholder="Location" className={input} />
          <input value={draft.project} onChange={(e) => setDraft({ ...draft, project: e.target.value })} placeholder="Project" className={input} />
        </div>
        <textarea value={draft.quote} onChange={(e) => setDraft({ ...draft, quote: e.target.value })} placeholder="Quote" rows={2} className={`${input} mt-3`} />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4">
            <Rating value={draft.rating} onChange={(n) => setDraft({ ...draft, rating: n })} />
            <label className="flex items-center gap-2 text-sm text-ink">
              <input type="checkbox" checked={draft.published} onChange={(e) => setDraft({ ...draft, published: e.target.checked })} className="h-4 w-4 rounded border-line text-gold focus:ring-gold/40" />
              Published
            </label>
          </div>
          <button onClick={add} disabled={adding} className="btn-gold text-sm disabled:opacity-70">
            {adding ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Adding…</> : <><Plus className="h-4 w-4" aria-hidden /> Add</>}
          </button>
        </div>
      </div>

      {error && (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      {/* List */}
      {loading ? (
        <div className="py-16 text-center text-slate"><Loader2 className="mx-auto h-5 w-5 animate-spin" aria-hidden /></div>
      ) : items.length === 0 ? (
        <p className="py-16 text-center text-sm text-slate">No testimonials yet.</p>
      ) : (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {items.map((t) => (
            <div key={t.id} className={`rounded-xl border bg-white p-4 shadow-card ${t.published ? "border-line" : "border-dashed border-line"}`}>
              <div className="flex items-start justify-between gap-2">
                <Rating value={t.rating} onChange={(n) => patch(t, { rating: n })} />
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => patch(t, { published: !t.published })}
                    className={`rounded-lg p-1.5 transition ${t.published ? "text-emerald-600 hover:bg-emerald-50" : "text-slate hover:bg-slate-100"}`}
                    aria-label={t.published ? "Unpublish" : "Publish"}
                    title={t.published ? "Published — click to hide" : "Hidden — click to publish"}
                  >
                    {t.published ? <Eye className="h-4 w-4" aria-hidden /> : <EyeOff className="h-4 w-4" aria-hidden />}
                  </button>
                  <button onClick={() => remove(t.id)} className="rounded-lg p-1.5 text-slate transition hover:bg-red-50 hover:text-red-600" aria-label="Delete">
                    <Trash2 className="h-4 w-4" aria-hidden />
                  </button>
                </div>
              </div>
              <textarea
                defaultValue={t.quote}
                onBlur={(e) => { if (e.target.value !== t.quote) patch(t, { quote: e.target.value }); }}
                rows={3}
                className="mt-3 w-full resize-none rounded-lg border border-line bg-paper/40 px-3 py-2 text-sm italic text-slate-ink outline-none focus:border-gold focus:bg-white focus:ring-2 focus:ring-gold/30"
              />
              <div className="mt-3 grid grid-cols-3 gap-2">
                <input defaultValue={t.name} onBlur={(e) => { if (e.target.value !== t.name) patch(t, { name: e.target.value }); }} placeholder="Name" className={cell} />
                <input defaultValue={t.location ?? ""} onBlur={(e) => { if ((e.target.value || "") !== (t.location || "")) patch(t, { location: e.target.value }); }} placeholder="Location" className={cell} />
                <input defaultValue={t.project ?? ""} onBlur={(e) => { if ((e.target.value || "") !== (t.project || "")) patch(t, { project: e.target.value }); }} placeholder="Project" className={cell} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
