"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  GripVertical,
  ImagePlus,
  Link2,
  Loader2,
  Trash2,
  UploadCloud,
} from "lucide-react";
import { MEDIA_CATEGORIES } from "@/lib/mediaSchema";

interface MediaItem {
  id: string;
  url: string;
  caption?: string;
  category?: string;
  ventureId?: string;
  ventureName?: string;
  kind: "image" | "video";
  sortOrder: number;
}
interface VentureOption {
  id: string;
  name: string;
}

export default function MediaManager() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [ventures, setVentures] = useState<VentureOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [urlValue, setUrlValue] = useState("");
  const [filter, setFilter] = useState("");
  const dragIndex = useRef<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [mRes, vRes] = await Promise.all([
        fetch("/api/admin/media", { cache: "no-store" }),
        fetch("/api/admin/ventures", { cache: "no-store" }),
      ]);
      if (mRes.status === 401) {
        setError("Your session has expired. Please sign in again.");
        return;
      }
      if (!mRes.ok) throw new Error();
      const mData = await mRes.json();
      setItems(mData.media ?? []);
      if (vRes.ok) {
        const vData = await vRes.json();
        setVentures((vData.ventures ?? []).map((v: { id: string; name: string }) => ({ id: v.id, name: v.name })));
      }
    } catch {
      setError("Couldn't load the gallery.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function createFromUrl(url: string) {
    const res = await fetch("/api/admin/media", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, kind: "image" }),
    });
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      throw new Error(d.error ?? "Couldn't add the image.");
    }
  }

  async function onAddUrl() {
    if (!urlValue.trim()) return;
    setError("");
    try {
      await createFromUrl(urlValue.trim());
      setUrlValue("");
      load();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't add the image.");
    }
  }

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const up = await fetch("/api/admin/media/upload", { method: "POST", body: fd });
      const data = await up.json().catch(() => ({}));
      if (!up.ok) throw new Error(data.error ?? "Upload failed.");
      await createFromUrl(data.url);
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function patch(item: MediaItem, changes: Partial<MediaItem>) {
    const merged = { ...item, ...changes };
    setItems((its) => its.map((x) => (x.id === item.id ? merged : x)));
    try {
      const res = await fetch(`/api/admin/media/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          url: merged.url,
          caption: merged.caption ?? "",
          category: merged.category ?? "",
          ventureId: merged.ventureId ?? "",
          kind: merged.kind,
        }),
      });
      if (!res.ok) throw new Error();
    } catch {
      setError("Couldn't save that change.");
      load();
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this image?")) return;
    try {
      const res = await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setItems((its) => its.filter((x) => x.id !== id));
    } catch {
      setError("Couldn't delete that image.");
    }
  }

  function onDrop(targetIndex: number) {
    const from = dragIndex.current;
    dragIndex.current = null;
    if (from === null || from === targetIndex) return;
    const next = [...items];
    const [moved] = next.splice(from, 1);
    next.splice(targetIndex, 0, moved);
    setItems(next);
    fetch("/api/admin/media/reorder", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: next.map((x) => x.id) }),
    }).catch(() => setError("Couldn't save the new order."));
  }

  const visible = filter ? items.filter((i) => i.category === filter) : items;
  const canReorder = !filter;

  const input =
    "w-full rounded-lg border border-line bg-white px-2.5 py-1.5 text-xs text-ink outline-none focus:border-gold focus:ring-2 focus:ring-gold/30";

  return (
    <div className="wrap py-10 md:py-14">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/admin" className="inline-flex items-center gap-1 text-xs font-medium text-gold-deep hover:underline">
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden /> Dashboard
          </Link>
          <h1 className="mt-1 font-display text-2xl font-semibold text-ink">Gallery</h1>
          <p className="text-sm text-slate">{items.length} images{canReorder ? " · drag to reorder" : ""}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30">
            <option value="">All categories</option>
            {MEDIA_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <button onClick={() => fileRef.current?.click()} disabled={uploading} className="btn-gold text-sm disabled:opacity-70">
            {uploading ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Uploading…</> : <><UploadCloud className="h-4 w-4" aria-hidden /> Upload</>}
          </button>
          <input ref={fileRef} type="file" accept="image/*" onChange={onUpload} className="hidden" />
        </div>
      </div>

      {/* Add by URL */}
      <div className="mt-5 flex flex-col gap-2 rounded-xl border border-line bg-white p-3 shadow-card sm:flex-row sm:items-center">
        <Link2 className="ml-1 h-4 w-4 flex-none text-slate" aria-hidden />
        <input
          value={urlValue}
          onChange={(e) => setUrlValue(e.target.value)}
          placeholder="Paste an image URL or /public path (e.g. /gallery/aero-villas-2.jpg)"
          className="w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-gold focus:ring-2 focus:ring-gold/30"
        />
        <button onClick={onAddUrl} className="btn-ghost text-sm">
          <ImagePlus className="h-4 w-4" aria-hidden /> Add
        </button>
      </div>

      {error && (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      {loading ? (
        <div className="py-16 text-center text-slate">
          <Loader2 className="mx-auto h-5 w-5 animate-spin" aria-hidden />
        </div>
      ) : visible.length === 0 ? (
        <p className="py-16 text-center text-sm text-slate">
          {filter ? "No images in this category." : "No images yet. Upload or add one above."}
        </p>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((m, i) => (
            <div
              key={m.id}
              draggable={canReorder}
              onDragStart={() => (dragIndex.current = i)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => onDrop(i)}
              className="overflow-hidden rounded-xl border border-line bg-white shadow-card"
            >
              <div className="relative aspect-[4/3] bg-paper-200">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={m.url} alt={m.caption || ""} className="h-full w-full object-cover" />
                {canReorder && (
                  <span className="absolute left-2 top-2 flex h-7 w-7 cursor-grab items-center justify-center rounded-lg bg-ink/60 text-paper backdrop-blur" title="Drag to reorder">
                    <GripVertical className="h-4 w-4" aria-hidden />
                  </span>
                )}
                <button
                  onClick={() => remove(m.id)}
                  className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-lg bg-ink/60 text-paper backdrop-blur transition hover:bg-red-600"
                  aria-label="Delete image"
                >
                  <Trash2 className="h-4 w-4" aria-hidden />
                </button>
              </div>
              <div className="space-y-2 p-3">
                <input
                  defaultValue={m.caption ?? ""}
                  onBlur={(e) => { if ((e.target.value || "") !== (m.caption || "")) patch(m, { caption: e.target.value }); }}
                  placeholder="Caption"
                  className={input}
                />
                <div className="grid grid-cols-2 gap-2">
                  <select value={m.category ?? ""} onChange={(e) => patch(m, { category: e.target.value })} className={input}>
                    <option value="">No category</option>
                    {MEDIA_CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <select value={m.ventureId ?? ""} onChange={(e) => patch(m, { ventureId: e.target.value })} className={input}>
                    <option value="">No venture</option>
                    {ventures.map((v) => (
                      <option key={v.id} value={v.id}>{v.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
