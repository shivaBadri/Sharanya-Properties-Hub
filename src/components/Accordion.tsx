"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import type { Faq } from "@/data/content";
import { cn } from "@/lib/utils";

export default function Accordion({ items }: { items: Faq[] }) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={i}>
            <h3>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 py-5 text-left"
              >
                <span className={cn("font-display text-lg font-medium transition-colors", isOpen ? "text-gold-deep" : "text-ink")}>
                  {item.question}
                </span>
                <span className="shrink-0 text-gold-deep">
                  {isOpen ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                </span>
              </button>
            </h3>
            <div
              className={cn(
                "grid transition-all duration-300 ease-out",
                isOpen ? "grid-rows-[1fr] pb-5 opacity-100" : "grid-rows-[0fr] opacity-0"
              )}
            >
              <div className="overflow-hidden">
                <p className="max-w-3xl text-[15px] leading-relaxed text-slate-ink">{item.answer}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
