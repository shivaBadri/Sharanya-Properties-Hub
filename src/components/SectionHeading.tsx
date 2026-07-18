import type { ReactNode } from "react";
import Reveal from "./Reveal";
import { cn } from "@/lib/utils";

interface Props {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  light?: boolean;
  className?: string;
}

export default function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  light = false,
  className,
}: Props) {
  return (
    <Reveal
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      {eyebrow && (
        <div
          className={cn(
            "flex items-center gap-3",
            align === "center" && "justify-center"
          )}
        >
          <span className="h-px w-8 bg-gold" aria-hidden />
          <span className="eyebrow">{eyebrow}</span>
        </div>
      )}
      <h2
        className={cn(
          "mt-4 text-balance text-3xl font-semibold leading-[1.1] sm:text-4xl md:text-[2.75rem]",
          light ? "text-paper" : "text-ink"
        )}
      >
        {title}
      </h2>
      {intro && (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed",
            light ? "text-paper/70" : "text-slate-ink"
          )}
        >
          {intro}
        </p>
      )}
    </Reveal>
  );
}
