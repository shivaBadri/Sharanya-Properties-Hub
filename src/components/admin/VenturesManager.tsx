"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { VENTURE_STATUS_LABELS, VENTURE_STATUSES } from "@/lib/ventureSchema";

interface VentureRow {
  id: string;
  slug: string;
  name: string;
  location: string;
  type: string;
  status: (typeof VENTURE_STATUSES)[number];
  publishState: "DRAFT" | "PUBLISHED";
  featured: boolean;
  updatedAt: string;
}

export default function VenturesManager() {
  const [rows, setRows] = useState<VentureRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/ventures", { cache: "no-store" });
      if (res.status === 401) {
        setError("Your session has expired. Please sign in again.");
        return;
      }
      if (!res.ok) throw new Error();
      const data = await res.json();
      setRows(data.ventures ?? []);
    } catch {
      setError("Couldn't load ventures.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function remove(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This can't be undone.`)) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/ventures/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setRows((rs) => rs.filter((r) => r.id !== id));
    } catch {
      setError("Couldn't delete that venture.");
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div className="wrap py-10 md:py-14">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link href="/admin" className="inline-flex items-center gap-1 text-xs font-medium text-gold-deep hover:underline">
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden /> Dashboard
          </Link>
          <h1 className="mt-1 font-display text-2xl font-semibold text-ink">Ventures</h1>
          <p className="text-sm text-slate">{rows.length} total</p>
        </div>
        <Link href="/admin/ventures/new" className="btn-gold text-sm">
          <Plus className="h-4 w-4" aria-hidden /> New venture
        </Link>
      </div>

      {error && (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      <div className="mt-6 overflow-x-auto rounded-xl border border-line bg-white shadow-card">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-line bg-paper-200/50 text-xs uppercase tracking-wide text-slate">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Location</th>
              <th className="px-4 py-3 font-medium">Type</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Visibility</th>
              <th className="px-4 py-3 font-medium sr-only">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-slate">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin" aria-hidden />
                </td>
              </tr>
            ) : rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-sm text-slate">
                  No ventures yet. Create your first one.
                </td>
              </tr>
            ) : (
              rows.map((v) => (
                <tr key={v.id} className="border-b border-line/60 last:border-0">
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 font-medium text-ink">
                      {v.featured && <Star className="h-3.5 w-3.5 fill-gold text-gold" aria-label="Featured" />}
                      {v.name}
                    </span>
                    <span className="block text-xs text-slate">/{v.slug}</span>
                  </td>
                  <td className="px-4 py-3 text-slate-ink">{v.location}</td>
                  <td className="px-4 py-3 text-slate-ink">{v.type}</td>
                  <td className="px-4 py-3 text-slate-ink">{VENTURE_STATUS_LABELS[v.status] ?? v.status}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        v.publishState === "PUBLISHED"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-slate-100 text-slate-700"
                      }`}
                    >
                      {v.publishState === "PUBLISHED" ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/ventures/${v.id}/edit`}
                        className="rounded-lg p-1.5 text-slate transition hover:bg-gold/10 hover:text-gold-deep"
                        aria-label={`Edit ${v.name}`}
                      >
                        <Pencil className="h-4 w-4" aria-hidden />
                      </Link>
                      <button
                        onClick={() => remove(v.id, v.name)}
                        disabled={busyId === v.id}
                        className="rounded-lg p-1.5 text-slate transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                        aria-label={`Delete ${v.name}`}
                      >
                        <Trash2 className="h-4 w-4" aria-hidden />
                      </button>
                    </div>
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
