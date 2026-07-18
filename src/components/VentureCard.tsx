import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, MapPin } from "lucide-react";
import type { Venture } from "@/data/ventures";
import { cn } from "@/lib/utils";

const statusStyles: Record<Venture["status"], string> = {
  Ongoing: "bg-gold/15 text-gold-deep",
  Upcoming: "bg-ink/10 text-ink",
  "Ready to Register": "bg-emerald-600/15 text-emerald-700",
  "Sold Out": "bg-slate/15 text-slate-ink",
};

export default function VentureCard({ venture }: { venture: Venture }) {
  return (
    <Link
      href={`/ventures/${venture.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-line bg-white shadow-card transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-lift"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-paper-200">
        <Image
          src={venture.cover}
          alt={`${venture.name} — ${venture.location}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 380px"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
        />
        <div className="absolute left-3 top-3 flex gap-2">
          <span className={cn("rounded-full px-3 py-1 text-xs font-semibold backdrop-blur", statusStyles[venture.status])}>
            {venture.status}
          </span>
        </div>
        <span className="absolute right-3 top-3 rounded-full bg-ink/80 px-3 py-1 text-xs font-medium text-paper backdrop-blur">
          {venture.type}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-1.5 text-xs font-medium text-slate">
          <MapPin className="h-3.5 w-3.5 text-gold-deep" aria-hidden />
          {venture.location}, {venture.city}
        </div>
        <h3 className="mt-2 font-display text-xl font-semibold text-ink">{venture.name}</h3>
        <p className="mt-1.5 line-clamp-2 flex-1 text-sm leading-relaxed text-slate-ink">
          {venture.tagline}
        </p>

        {venture.sizeRange && (
          <p className="mt-3 text-xs text-slate">
            <span className="font-semibold text-ink">{venture.sizeRange}</span>
            {venture.extent ? ` · ${venture.extent}` : ""}
          </p>
        )}

        <div className="mt-4 flex items-center justify-between border-t border-line pt-4">
          <span className="text-sm font-semibold text-gold-deep">{venture.priceLabel}</span>
          <span className="inline-flex items-center gap-1 text-sm font-semibold text-ink transition-colors group-hover:text-gold-deep">
            Details
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />
          </span>
        </div>
      </div>
    </Link>
  );
}
