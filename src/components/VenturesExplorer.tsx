"use client";

import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import VentureCard from "./VentureCard";
import type { Venture } from "@/data/ventures";
import { cn } from "@/lib/utils";

const ALL = "All";

export default function VenturesExplorer({
  ventures,
  locations,
  types,
  statuses,
}: {
  ventures: Venture[];
  locations: string[];
  types: string[];
  statuses: string[];
}) {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState(ALL);
  const [type, setType] = useState(ALL);
  const [status, setStatus] = useState(ALL);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ventures.filter((v) => {
      if (location !== ALL && v.location !== location) return false;
      if (type !== ALL && v.type !== type) return false;
      if (status !== ALL && v.status !== status) return false;
      if (q) {
        const hay = `${v.name} ${v.location} ${v.tagline} ${v.summary}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [ventures, query, location, type, status]);

  const selectCls =
    "rounded-lg border border-line bg-white px-3 py-2.5 text-sm text-ink focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30";

  return (
    <div>
      <div className="rounded-xl border border-line bg-white p-4 shadow-card">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search projects, locations…"
              aria-label="Search ventures"
              className="w-full rounded-lg border border-line bg-paper/60 py-2.5 pl-10 pr-4 text-sm text-ink placeholder:text-slate focus:border-gold focus:outline-none focus:ring-2 focus:ring-gold/30"
            />
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate lg:hidden">
            <SlidersHorizontal className="h-4 w-4" aria-hidden /> Filters
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            <select value={location} onChange={(e) => setLocation(e.target.value)} className={selectCls} aria-label="Filter by location">
              <option value={ALL}>All locations</option>
              {locations.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
            <select value={type} onChange={(e) => setType(e.target.value)} className={selectCls} aria-label="Filter by type">
              <option value={ALL}>All types</option>
              {types.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className={selectCls} aria-label="Filter by status">
              <option value={ALL}>All statuses</option>
              {statuses.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <p className="mt-5 text-sm text-slate">
        Showing <span className="font-semibold text-ink">{results.length}</span> of {ventures.length} ventures
      </p>

      {results.length > 0 ? (
        <div className="mt-4 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((v) => (
            <VentureCard key={v.slug} venture={v} />
          ))}
        </div>
      ) : (
        <div className={cn("mt-4 rounded-xl border border-dashed border-line py-16 text-center")}>
          <p className="text-ink">No ventures match those filters.</p>
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setLocation(ALL);
              setType(ALL);
              setStatus(ALL);
            }}
            className="btn-ghost mt-4"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
