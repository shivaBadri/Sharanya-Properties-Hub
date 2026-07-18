import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Logo({
  light = false,
  className,
}: {
  light?: boolean;
  className?: string;
}) {
  return (
    <Link
      href="/"
      aria-label="Sharanya Properties Hub"
      className={cn("group inline-flex items-center gap-3", className)}
    >
      {/* Logo Image */}
      <Image
        src="/brand/sharanya-logo.jpg"
        alt="Sharanya Properties Hub"
        width={52}
        height={52}
        priority
        className="h-12 w-12 rounded-md object-contain transition-transform duration-300 group-hover:scale-105"
      />

      {/* Company Name */}
      <div className="leading-none">
        <h1
          className={cn(
            "font-display text-[1.55rem] font-semibold tracking-tight",
            light ? "text-paper" : "text-ink"
          )}
        >
          Sharanya
        </h1>

        <p
          className={cn(
            "mt-1 text-[11px] font-semibold uppercase tracking-[0.28em]",
            light ? "text-gold-soft" : "text-gold-deep"
          )}
        >
          Properties Hub
        </p>
      </div>
    </Link>
  );
}
