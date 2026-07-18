"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Phone, Menu, X, MessageCircle } from "lucide-react";
import Logo from "./Logo";
import { nav, site, whatsappLink, telLink } from "@/data/site";
import { cn } from "@/lib/utils";

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "border-b border-line bg-paper/90 backdrop-blur-md"
          : "border-b border-transparent bg-paper"
      )}
    >
      <div className="wrap flex h-16 items-center justify-between gap-4">
        <Logo />

        <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
          {nav.map((item) => {
            const active =
              item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "link-underline text-sm font-medium transition-colors",
                  active ? "text-gold-deep after:w-full" : "text-slate-ink hover:text-ink"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <a href={telLink()} className="btn-ghost hidden px-4 py-2 sm:inline-flex" aria-label={`Call ${site.phoneDisplay}`}>
            <Phone className="h-4 w-4" aria-hidden />
            <span className="hidden md:inline">Call</span>
          </a>
          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold px-4 py-2"
          >
            <MessageCircle className="h-4 w-4" aria-hidden />
            <span className="hidden sm:inline">WhatsApp</span>
          </a>
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="btn-ghost p-2 lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-line bg-paper lg:hidden">
          <nav aria-label="Mobile" className="wrap flex flex-col py-2">
            {nav.map((item) => {
              const active =
                item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "border-b border-line/60 py-3 text-sm font-medium",
                    active ? "text-gold-deep" : "text-ink"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            <a href={telLink()} className="btn-ghost mt-3 mb-1">
              <Phone className="h-4 w-4" /> Call {site.phoneDisplay}
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
