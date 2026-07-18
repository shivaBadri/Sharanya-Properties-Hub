import type { Metadata } from "next";
import { statSync } from "fs";
import path from "path";
import { Download, FileText, Map as MapIcon } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import { getDownloads, type PublicDownload } from "@/lib/downloads";

export const metadata: Metadata = {
  title: "Downloads — Brochures & Layout Plans",
  description:
    "Download brochures and layout plans for Sharanya Properties Hub' plotted developments and villa communities in Hyderabad.",
  alternates: { canonical: "/downloads" },
};

export const dynamic = "force-dynamic";

function fmtBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function localSize(publicPath: string): string {
  try {
    const abs = path.join(process.cwd(), "public", publicPath.replace(/^\//, ""));
    return fmtBytes(statSync(abs).size);
  } catch {
    return "—";
  }
}

function sizeFor(d: PublicDownload): string {
  if (d.sizeBytes) return fmtBytes(d.sizeBytes);
  if (d.file.startsWith("/")) return localSize(d.file);
  return "—";
}

function fmtDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default async function DownloadsPage() {
  const list = await getDownloads();
  const rows = list.map((d) => ({ ...d, size: sizeFor(d) }));

  return (
    <div className="wrap py-16 md:py-20">
      <SectionHeading
        eyebrow="Downloads"
        title="Brochures & layout plans."
        intro="Grab the full brochure or layout for any venture. For ZIP bundles of a project's documents, ask us on WhatsApp and we'll send a link."
      />

      <Reveal className="mt-12">
        <div className="overflow-hidden rounded-xl border border-line bg-white shadow-card">
          <div className="hidden grid-cols-[2.4fr_1fr_0.8fr_0.8fr_auto] gap-4 border-b border-line bg-paper-200/60 px-6 py-3 text-xs font-semibold uppercase tracking-wide text-slate md:grid">
            <span>File</span>
            <span>Project</span>
            <span>Size</span>
            <span>Updated</span>
            <span className="text-right">Download</span>
          </div>

          {rows.length === 0 ? (
            <p className="px-6 py-12 text-center text-sm text-slate">No downloads yet.</p>
          ) : (
            <ul className="divide-y divide-line">
              {rows.map((d, i) => (
                <li
                  key={`${d.file}-${i}`}
                  className="grid grid-cols-1 gap-3 px-6 py-4 md:grid-cols-[2.4fr_1fr_0.8fr_0.8fr_auto] md:items-center md:gap-4"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gold/12 text-gold-deep">
                      {d.category === "Layout" ? <MapIcon className="h-4 w-4" aria-hidden /> : <FileText className="h-4 w-4" aria-hidden />}
                    </span>
                    <span className="font-medium text-ink">{d.label}</span>
                  </div>
                  <span className="text-sm text-slate-ink md:block">{d.project}</span>
                  <span className="text-sm text-slate-ink">{d.size}</span>
                  <span className="text-sm text-slate-ink">{fmtDate(d.uploaded)}</span>
                  <a
                    href={d.file}
                    download
                    className="btn-ghost justify-self-start px-4 py-2 md:justify-self-end"
                    aria-label={`Download ${d.label}`}
                  >
                    <Download className="h-4 w-4" aria-hidden /> PDF
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Reveal>
    </div>
  );
}
