"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, Loader2, Plus, Trash2, UploadCloud } from "lucide-react";
import { DOWNLOAD_CATEGORIES } from "@/lib/downloadSchema";

interface DownloadItem {
  id: string;
  label: string;
  category: string;
  url: string;
  sizeBytes?: number;
  ventureId?: string;
  ventureName?: string;
}
interface VentureOption {
  id: string;
  name: string;
}

function fmtSize(bytes?: number): string {
  if (!bytes) return "—";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
}

export default function DownloadsManager() {
  const [items, setItems] = useState<DownloadItem[]>([]);
  const [ventures, setVentures] = useState<VentureOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [draft, setDraft] = useState({ label: "", category: "Brochure", url: "", ventureId: "", sizeBytes: 0 });

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [dRes, vRes] = await Promise.all([
        fetch("/api/admin/downloads", { cache: "no-store" }),
        fetch("/api/admin/ventures", { cache: "no-store" }),
      ]);
      if (dRes.status === 401) {
        setError("Your session has expired. Please sign in again.");
        return;
      }
      if (!dRes.ok) throw new Error();
      const d = await dRes.json();
      setItems(d.downloads ?? []);
      if (vRes.ok) {
        const v = await vRes.json();
        setVentures((v.ventures ?? []).map((x: { id: string; name: string }) => ({ id: x.id, name: x.name })));
      }
    } catch {
      setError("Couldn't load downloads.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const up = await fetch("/api/admin/downloads/upload", { method: "POST", body: fd });
      const data = await up.json().catch(() => ({}));
      if (!up.ok) throw new Error(data.error ?? "Upload failed.");
      setDraft((d) => ({ ...d, url: data.url, sizeBytes: data.sizeBytes ?? 0, label: d.label || file.name.replace(/\.pdf$/i, "") }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed.");
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function add() {
    setError("");
    if (!draft.label.trim() || !draft.url.trim()) {
      setError("A label and a file (upload or URL) are required.");
      return;
    }
    try {
      const res = await fetch("/api/admin/downloads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label: draft.label,
          category: draft.category,
          url: draft.url,
          ventureId: draft.ventureId,
          sizeBytes: draft.sizeBytes || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Couldn't add the download.");
      setDraft({ label: "", category: "Brochure", url: "", ventureId: "", sizeBytes: 0 });
      load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't add the download.");
    }
  }

  async function patch(item: DownloadItem, changes: Partial<DownloadItem>) {
    const merged = { ...item, ...changes };
    setItems((its) => its.map((x) => (x.id === item.id ? merged : x)));
    try {
      const res = await fetch(`/api/admin/downloads/${item.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          label: merged.label,
          category: merged.category,
          url: merged.url,
          ventureId: merged.ventureId ?? "",
          sizeBytes: merged.sizeBytes ?? undefined,
        }),
      });
      if (!res.ok) throw new Error();
    } catch {
      setError("Couldn't save that change.");
      load();
    }
  }

  async function remove(id: string) {
    if (!confirm("Delete this download?")) return;
    try {
      const res = await fetch(`/api/admin/downloads/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setItems((its) => its.filter((x) => x.id !== id));
    } catch {
      setError("Couldn't delete that download.");
    }
  }

  const input =
    "w-full rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-gold focus:ring-2 focus:ring-gold/30";
  const cell = "rounded border border-line bg-white px-2 py-1 text-xs text-ink outline-none focus:border-gold focus:ring-1 focus:ring-gold/30";

  return (
    <div className="wrap py-10 md:py-14">
      <div>
        <Link href="/admin" className="inline-flex items-center gap-1 text-xs font-medium text-gold-deep hover:underline">
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden /> Dashboard
        </Link>
        <h1 className="mt-1 font-display text-2xl font-semibold text-ink">Downloads</h1>
        <p className="text-sm text-slate">{items.length} files</p>
      </div>

      {/* Add */}
      <div className="mt-6 rounded-xl border border-line bg-white p-4 shadow-card">
        <p className="mb-3 text-sm font-semibold text-ink">Add a download</p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <input value={draft.label} onChange={(e) => setDraft({ ...draft, label: e.target.value })} placeholder="Label" className={input} />
          <select value={draft.category} onChange={(e) => setDraft({ ...draft, category: e.target.value })} className={input}>
            {DOWNLOAD_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <select value={draft.ventureId} onChange={(e) => setDraft({ ...draft, ventureId: e.target.value })} className={input}>
            <option value="">No venture</option>
            {ventures.map((v) => (
              <option key={v.id} value={v.id}>{v.name}</option>
            ))}
          </select>
          <div className="flex gap-2">
            <button onClick={() => fileRef.current?.click()} disabled={uploading} className="btn-ghost flex-1 text-sm disabled:opacity-70">
              {uploading ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden /> …</> : <><UploadCloud className="h-4 w-4" aria-hidden /> PDF</>}
            </button>
            <input ref={fileRef} type="file" accept="application/pdf" onChange={onUpload} className="hidden" />
            <button onClick={add} className="btn-gold flex-1 text-sm">
              <Plus className="h-4 w-4" aria-hidden /> Add
            </button>
          </div>
        </div>
        <input
          value={draft.url}
          onChange={(e) => setDraft({ ...draft, url: e.target.value })}
          placeholder="File URL or /public path (or upload a PDF above)"
          className={`${input} mt-3`}
        />
      </div>

      {error && (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      {/* Table */}
      <div className="mt-6 overflow-x-auto rounded-xl border border-line bg-white shadow-card">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-line bg-paper-200/50 text-xs uppercase tracking-wide text-slate">
              <th className="px-4 py-3 font-medium">Label</th>
              <th className="px-4 py-3 font-medium">Category</th>
              <th className="px-4 py-3 font-medium">Venture</th>
              <th className="px-4 py-3 font-medium">Size</th>
              <th className="px-4 py-3 font-medium">File</th>
              <th className="px-4 py-3 font-medium sr-only">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-slate"><Loader2 className="mx-auto h-5 w-5 animate-spin" aria-hidden /></td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={6} className="px-4 py-12 text-center text-sm text-slate">No downloads yet.</td></tr>
            ) : (
              items.map((d) => (
                <tr key={d.id} className="border-b border-line/60 last:border-0">
                  <td className="px-4 py-3">
                    <input defaultValue={d.label} onBlur={(e) => { if (e.target.value !== d.label) patch(d, { label: e.target.value }); }} className={`${cell} w-full min-w-[180px]`} />
                  </td>
                  <td className="px-4 py-3">
                    <select value={d.category} onChange={(e) => patch(d, { category: e.target.value })} className={cell}>
                      {DOWNLOAD_CATEGORIES.map((c) => (<option key={c} value={c}>{c}</option>))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <select value={d.ventureId ?? ""} onChange={(e) => patch(d, { ventureId: e.target.value })} className={cell}>
                      <option value="">—</option>
                      {ventures.map((v) => (<option key={v.id} value={v.id}>{v.name}</option>))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate">{fmtSize(d.sizeBytes)}</td>
                  <td className="px-4 py-3">
                    <a href={d.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-medium text-gold-deep hover:underline">
                      Open <ExternalLink className="h-3 w-3" aria-hidden />
                    </a>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => remove(d.id)} className="rounded-lg p-1.5 text-slate transition hover:bg-red-50 hover:text-red-600" aria-label={`Delete ${d.label}`}>
                      <Trash2 className="h-4 w-4" aria-hidden />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
