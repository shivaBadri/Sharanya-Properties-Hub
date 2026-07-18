import Link from "next/link";
import { Phone, MessageCircle, Mail, MapPin } from "lucide-react";
import Logo from "./Logo";
import { nav, site, whatsappLink, telLink } from "@/data/site";
import { getPublishedVentures } from "@/lib/ventures";

export default async function Footer() {
  const year = new Date().getFullYear();
  const ventures = await getPublishedVentures();

  return (
    <footer className="mt-24 bg-ink text-paper/80">
      <div className="wrap grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Logo light />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-paper/60">
            {site.tagline}. Clear titles, gated infrastructure and locations built for
            long-term value.
          </p>
        </div>

        <div>
          <h4 className="font-sans text-xs font-semibold uppercase tracking-eyebrow text-gold-soft">
            Explore
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            {nav.slice(1).map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-paper/70 transition-colors hover:text-gold-soft">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-sans text-xs font-semibold uppercase tracking-eyebrow text-gold-soft">
            Ventures
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm">
            {ventures.slice(0, 6).map((v) => (
              <li key={v.slug}>
                <Link
                  href={`/ventures/${v.slug}`}
                  className="text-paper/70 transition-colors hover:text-gold-soft"
                >
                  {v.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-sans text-xs font-semibold uppercase tracking-eyebrow text-gold-soft">
            Get in touch
          </h4>
          <ul className="mt-4 space-y-3 text-sm">
            <li>
              <a href={telLink()} className="flex items-center gap-2.5 text-paper/70 hover:text-gold-soft">
                <Phone className="h-4 w-4 text-gold" aria-hidden /> {site.phoneDisplay}
              </a>
            </li>
            <li>
              <a
                href={whatsappLink()}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-paper/70 hover:text-gold-soft"
              >
                <MessageCircle className="h-4 w-4 text-gold" aria-hidden /> WhatsApp us
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="flex items-center gap-2.5 text-paper/70 hover:text-gold-soft">
                <Mail className="h-4 w-4 text-gold" aria-hidden /> {site.email}
              </a>
            </li>
            <li className="flex items-start gap-2.5 text-paper/70">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-gold" aria-hidden /> {site.address}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="wrap flex flex-col items-center justify-between gap-3 py-6 text-xs text-paper/50 sm:flex-row">
          <p>© {year} {site.legalName}. All rights reserved.</p>
          <p>Plots &amp; villas across Hyderabad&apos;s ORR corridor · HMDA / DTCP approved layouts</p>
        </div>
      </div>
    </footer>
  );
}
