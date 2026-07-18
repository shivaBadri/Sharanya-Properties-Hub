import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Logo({ light = false, className }: { light?: boolean; className?: string }) {
  return (
    <Link
      href="/"
      aria-label="Sharanya Properties Hub — home"
      className={cn("group inline-flex items-center gap-2.5", className)}
    >
      {/* Plot-square mark: four survey plots forming an S-implied grid */}
      <span
        aria-hidden
        className="relative grid h-9 w-9 grid-cols-2 grid-rows-2 gap-[3px] rounded-[4px] border border-gold/60 p-[3px]"
      >
        <span className="rounded-[1px] bg-gold" />
        <span className="rounded-[1px] bg-gold/30" />
        <span className="rounded-[1px] bg-gold/30" />
        <span className="rounded-[1px] bg-gold" />
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-lg font-semibold tracking-tight",
            light ? "text-paper" : "text-ink"
          )}
        >
          Sharanya
        </span>
        <span
          className={cn(
            "font-sans text-[10px] font-semibold uppercase tracking-eyebrow",
            light ? "text-gold-soft" : "text-gold-deep"
          )}
        >
          Properties Hub
        </span>
      </span>
    </Link>
  );
}
