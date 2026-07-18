"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Copy,
  Folder,
  ImagePlus,
  Loader2,
  Trash2,
  Home,
} from "lucide-react";

interface Resource {
  publicId: string;
  url: string;
  thumb: string;
  format: string;
  bytes: number;
  width: number;
  height: number;
}
interface CloudFolder {
  name: string;
  path: string;
}

function fmtBytes(b: number): string {
  if (!b) return "—";
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(0)} KB`;
  return `${(b / 1024 / 1024).toFixed(1)} MB`;
}
const basename = (id: string) => id.split("/").pop() || id;

export default function LibraryManager() {
  const [folder, setFolder] = useState("");
  const [resources, setResources] = useState<Resource[]>([]);
  const [folders, setFolders] = useState<CloudFolder[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notConfigured, setNotConfigured] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [added, setAdded] = useState<Set<string>>(new Set());

  const load = useCallback(async (f: string, cursor?: string, append = false) => {
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (f) params.set("folder", f);
      if (cursor) params.set("cursor", cursor);
      const res = await fetch(`/api/admin/library?${params.toString()}`, { cache: "no-store" });
      if (res.status === 401) {
        setError("Your session has expired. Please sign in again.");
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (res.status === 503 && data.configured === false) {
        setNotConfigured(true);
        return;
      }
      if (!res.ok) throw new Error(data.error ?? "Couldn't load the library.");
      setNotConfigured(false);
      setResources((prev) => (append ? [...prev, ...data.resources] : data.resources));
      setFolders(data.folders ?? []);
      setNextCursor(data.nextCursor ?? null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Couldn't load the library.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(folder);
  }, [folder, load]);

  async function copy(url: string, id: string) {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(id);
      setTimeout(() => setCopied((c) => (c === id ? null : c)), 1500);
    } catch {
      setError("Couldn't copy to clipboard.");
    }
  }

  async function addToGallery(r: Resource) {
    setBusyId(r.publicId);
    try {
      const res = await fetch("/api/admin/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: r.url, caption: basename(r.publicId), kind: "image" }),
      });
      if (!res.ok) throw new Error();
      setAdded((s) => new Set(s).add(r.publicId));
    } catch {
      setError("Couldn't add that image to the gallery.");
    } finally {
      setBusyId(null);
    }
  }

  async function remove(publicId: string) {
    if (!confirm(`Delete "${basename(publicId)}" from Cloudinary? This can't be undone.`)) return;
    setBusyId(publicId);
    try {
      const res = await fetch("/api/admin/library", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ publicId }),
      });
      if (!res.ok) throw new Error();
      setResources((rs) => rs.filter((r) => r.publicId !== publicId));
    } catch {
      setError("Couldn't delete that asset.");
    } finally {
      setBusyId(null);
    }
  }

  const crumbs = folder ? folder.split("/") : [];

  return (
    <div className="wrap py-10 md:py-14">
      <div>
        <Link href="/admin" className="inline-flex items-center gap-1 text-xs font-medium text-gold-deep hover:underline">
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden /> Dashboard
        </Link>
        <h1 className="mt-1 font-display text-2xl font-semibold text-ink">Media Library</h1>
        <p className="text-sm text-slate">Your Cloudinary assets</p>
      </div>

      {notConfigured ? (
        <div className="mt-8 rounded-xl border border-gold/40 bg-gold/5 p-6 text-sm text-gold-deep">
          <p className="font-semibold">Cloudinary isn&apos;t connected.</p>
          <p className="mt-1 text-slate-ink">
            Set <code>CLOUDINARY_URL</code> in your environment to browse, upload and manage media here.
            Until then, you can still add gallery images by URL in the{" "}
            <Link href="/admin/media" className="font-medium text-gold-deep underline">Gallery</Link>.
          </p>
        </div>
      ) : (
        <>
          {/* Breadcrumb */}
          <div className="mt-6 flex flex-wrap items-center gap-1 text-sm text-slate">
            <button onClick={() => setFolder("")} className="inline-flex items-center gap-1 hover:text-gold-deep">
              <Home className="h-3.5 w-3.5" aria-hidden /> root
            </button>
            {crumbs.map((c, i) => (
              <span key={i} className="inline-flex items-center gap-1">
                <span>/</span>
                <button onClick={() => setFolder(crumbs.slice(0, i + 1).join("/"))} className="hover:text-gold-deep">
                  {c}
                </button>
              </span>
            ))}
          </div>

          {error && (
            <p className="mt-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
              {error}
            </p>
          )}

          {/* Folders */}
          {folders.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {folders.map((fd) => (
                <button
                  key={fd.path}
                  onClick={() => setFolder(fd.path)}
                  className="inline-flex items-center gap-2 rounded-lg border border-line bg-white px-3 py-2 text-sm text-ink shadow-card transition hover:border-gold/50"
                >
                  <Folder className="h-4 w-4 text-gold-deep" aria-hidden /> {fd.name}
                </button>
              ))}
            </div>
          )}

          {/* Assets */}
          {loading && resources.length === 0 ? (
            <div className="py-16 text-center text-slate"><Loader2 className="mx-auto h-5 w-5 animate-spin" aria-hidden /></div>
          ) : resources.length === 0 ? (
            <p className="py-16 text-center text-sm text-slate">No assets in this folder.</p>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {resources.map((r) => (
                <div key={r.publicId} className="overflow-hidden rounded-xl border border-line bg-white shadow-card">
                  <div className="relative aspect-[4/3] bg-paper-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={r.thumb} alt={basename(r.publicId)} className="h-full w-full object-cover" loading="lazy" />
                    <button
                      onClick={() => remove(r.publicId)}
                      disabled={busyId === r.publicId}
                      className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-lg bg-ink/60 text-paper backdrop-blur transition hover:bg-red-600 disabled:opacity-50"
                      aria-label="Delete from Cloudinary"
                    >
                      <Trash2 className="h-4 w-4" aria-hidden />
                    </button>
                  </div>
                  <div className="p-3">
                    <p className="truncate text-sm font-medium text-ink" title={r.publicId}>{basename(r.publicId)}</p>
                    <p className="text-xs text-slate">{r.format.toUpperCase()} · {r.width}×{r.height} · {fmtBytes(r.bytes)}</p>
                    <div className="mt-2 flex gap-2">
                      <button onClick={() => copy(r.url, r.publicId)} className="btn-ghost flex-1 px-2 py-1.5 text-xs">
                        {copied === r.publicId ? <><Check className="h-3.5 w-3.5" aria-hidden /> Copied</> : <><Copy className="h-3.5 w-3.5" aria-hidden /> URL</>}
                      </button>
                      <button
                        onClick={() => addToGallery(r)}
                        disabled={busyId === r.publicId || added.has(r.publicId)}
                        className="btn-gold flex-1 px-2 py-1.5 text-xs disabled:opacity-60"
                      >
                        {added.has(r.publicId) ? <><Check className="h-3.5 w-3.5" aria-hidden /> Added</> : <><ImagePlus className="h-3.5 w-3.5" aria-hidden /> Gallery</>}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {nextCursor && (
            <div className="mt-6 text-center">
              <button onClick={() => load(folder, nextCursor, true)} disabled={loading} className="btn-ghost text-sm disabled:opacity-60">
                {loading ? <><Loader2 className="h-4 w-4 animate-spin" aria-hidden /> Loading…</> : "Load more"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
