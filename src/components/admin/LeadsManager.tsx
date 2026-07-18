"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Download,
  Loader2,
  Search,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  LEAD_STATUSES,
  LEAD_STATUS_STYLES,
  type LeadStatus,
} from "@/lib/leadStatus";

interface Lead {
  id: string;
  name: string;
  phone: string;
  email?: string;
  project?: string;
  budget?: string;
  message?: string;
  source?: string;
  status: LeadStatus;
  createdAt: string;
}

type Sort = "newest" | "oldest" | "name";

function fmtDate(iso: string): string {
  const d = new Date(iso);
  return (
    d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "2-digit" }) +
    " · " +
    d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false })
  );
}

export default function LeadsManager() {
  const [q, setQ] = useState("");
  const [debouncedQ, setDebouncedQ] = useState("");
  const [status, setStatus] = useState<"" | LeadStatus>("");
  const [sort, setSort] = useState<Sort>("newest");
  const [page, setPage] = useState(1);
  const pageSize = 20;

  const [leads, setLeads] = useState<Lead[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  // Debounce the search box.
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(q), 300);
    return () => clearTimeout(t);
  }, [q]);

  // Reset to page 1 whenever filters change.
  useEffect(() => {
    setPage(1);
  }, [debouncedQ, status, sort]);

  const params = useCallback(() => {
    const p = new URLSearchParams();
    if (debouncedQ) p.set("q", debouncedQ);
    if (status) p.set("status", status);
    p.set("sort", sort);
    p.set("page", String(page));
    p.set("pageSize", String(pageSize));
    return p;
  }, [debouncedQ, status, sort, page]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/leads?${params().toString()}`, { cache: "no-store" });
      if (res.status === 401) {
        setError("Your session has expired. Please sign in again.");
        setLeads([]);
        setTotal(0);
        return;
      }
      if (!res.ok) throw new Error("Failed to load leads.");
      const data = await res.json();
      setLeads(data.leads ?? []);
      setTotal(data.total ?? 0);
    } catch {
      setError("Couldn't load leads. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [params]);

  useEffect(() => {
    load();
  }, [load]);

  async function changeStatus(id: string, next: LeadStatus) {
    const prev = leads;
    setLeads((ls) => ls.map((l) => (l.id === id ? { ...l, status: next } : l)));
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      if (!res.ok) throw new Error();
    } catch {
      setLeads(prev); // revert
      setError("Couldn't update status.");
    } finally {
      setBusyId(null);
    }
  }

  async function remove(id: string, name: string) {
    if (!confirm(`Delete the enquiry from ${name}? This can't be undone.`)) return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/leads/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      // If we just removed the last row on a page beyond the first, step back.
      if (leads.length === 1 && page > 1) setPage((p) => p - 1);
      else load();
    } catch {
      setError("Couldn't delete that lead.");
      setBusyId(null);
    }
  }

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const exportHref = `/api/admin/leads/export?${(() => {
    const p = new URLSearchParams();
    if (debouncedQ) p.set("q", debouncedQ);
    if (status) p.set("status", status);
    p.set("sort", sort);
    return p.toString();
  })()}`;

  const controlCls =
    "rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-gold focus:ring-2 focus:ring-gold/30";

  return (
    <div className="wrap py-10 md:py-14">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <Link
            href="/admin"
            className="inline-flex items-center gap-1 text-xs font-medium text-gold-deep hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden /> Dashboard
          </Link>
          <h1 className="mt-1 font-display text-2xl font-semibold text-ink">Leads</h1>
          <p className="text-sm text-slate">{total} total</p>
        </div>
        <a href={exportHref} className="btn-ghost text-sm">
          <Download className="h-4 w-4" aria-hidden /> Export CSV
        </a>
      </div>

      {/* Controls */}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate" aria-hidden />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search name, phone, email, venture…"
            className={`${controlCls} w-full pl-9`}
            aria-label="Search leads"
          />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as "" | LeadStatus)}
          className={controlCls}
          aria-label="Filter by status"
        >
          <option value="">All statuses</option>
          {LEAD_STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as Sort)}
          className={controlCls}
          aria-label="Sort leads"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="name">Name (A–Z)</option>
        </select>
      </div>

      {error && (
        <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}

      {/* Table */}
      <div className="mt-4 overflow-x-auto rounded-xl border border-line bg-white shadow-card">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead>
            <tr className="border-b border-line bg-paper-200/50 text-xs uppercase tracking-wide text-slate">
              <th className="px-4 py-3 font-medium">Name</th>
              <th className="px-4 py-3 font-medium">Phone</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Venture</th>
              <th className="px-4 py-3 font-medium">Budget</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Source</th>
              <th className="px-4 py-3 font-medium">When</th>
              <th className="px-4 py-3 font-medium sr-only">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="px-4 py-12 text-center text-slate">
                  <Loader2 className="mx-auto h-5 w-5 animate-spin" aria-hidden />
                </td>
              </tr>
            ) : leads.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-12 text-center text-sm text-slate">
                  {debouncedQ || status ? "No leads match your filters." : "No leads yet."}
                </td>
              </tr>
            ) : (
              leads.map((l) => (
                <tr key={l.id} className="border-b border-line/60 last:border-0 align-top">
                  <td className="px-4 py-3 font-medium text-ink">{l.name}</td>
                  <td className="px-4 py-3 text-slate-ink">
                    <a href={`tel:${l.phone}`} className="hover:text-gold-deep">
                      {l.phone}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-slate-ink">{l.email || "—"}</td>
                  <td className="px-4 py-3 text-slate-ink">{l.project || "—"}</td>
                  <td className="px-4 py-3 text-slate-ink">{l.budget || "—"}</td>
                  <td className="px-4 py-3">
                    <select
                      value={l.status}
                      onChange={(e) => changeStatus(l.id, e.target.value as LeadStatus)}
                      disabled={busyId === l.id}
                      className={`rounded-full border-0 px-2.5 py-1 text-xs font-medium outline-none ring-1 ring-inset ring-line focus:ring-gold ${
                        LEAD_STATUS_STYLES[l.status] ?? ""
                      }`}
                      aria-label={`Status for ${l.name}`}
                    >
                      {LEAD_STATUSES.map((s) => (
                        <option key={s} value={s} className="bg-white text-ink">
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate">{l.source || "—"}</td>
                  <td className="px-4 py-3 text-xs text-slate">{fmtDate(l.createdAt)}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => remove(l.id, l.name)}
                      disabled={busyId === l.id}
                      className="rounded-lg p-1.5 text-slate transition hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
                      aria-label={`Delete ${l.name}`}
                    >
                      <Trash2 className="h-4 w-4" aria-hidden />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {total > pageSize && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <p className="text-slate">
            Page {page} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page <= 1 || loading}
              className="btn-ghost px-3 py-1.5 text-sm disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden /> Prev
            </button>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages || loading}
              className="btn-ghost px-3 py-1.5 text-sm disabled:opacity-40"
            >
              Next <ChevronRight className="h-4 w-4" aria-hidden />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
