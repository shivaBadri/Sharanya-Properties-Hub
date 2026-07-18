import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MapPin,
  Check,
  Download,
  MessageCircle,
  Phone,
  ArrowLeft,
  Ruler,
  LandPlot,
  BadgeCheck,
  Map as MapIcon,
} from "lucide-react";
import type { Venture } from "@/data/ventures";
import { getPublishedVentureBySlug } from "@/lib/ventures";
import { site, whatsappLink, telLink } from "@/data/site";
import LeadForm from "@/components/LeadForm";
import Reveal from "@/components/Reveal";
import JsonLd from "@/components/JsonLd";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const v = await getPublishedVentureBySlug(slug);
  if (!v) return { title: "Venture not found" };

  const title = v.metaTitle || `${v.name} — ${v.type} in ${v.location}, ${v.city}`;
  const description = v.metaDescription || v.summary;
  return {
    title,
    description,
    alternates: { canonical: `/ventures/${v.slug}` },
    openGraph: {
      title,
      description,
      images: [{ url: v.cover, width: 1200, height: 900, alt: v.name }],
      type: "website",
    },
  };
}

const factItems = (v: Venture) =>
  [
    v.extent && { icon: LandPlot, label: "Extent", value: v.extent },
    v.plots && { icon: LandPlot, label: "Units", value: v.plots },
    v.sizeRange && { icon: Ruler, label: "Sizes", value: v.sizeRange },
    { icon: BadgeCheck, label: "Approvals", value: v.approvals.join(", ") },
  ].filter(Boolean) as { icon: typeof Ruler; label: string; value: string }[];

export default async function VentureDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const v = await getPublishedVentureBySlug(slug);
  if (!v) notFound();

  const downloads = [
    v.brochure && { label: "Brochure", href: v.brochure },
    v.layout && { label: "Layout plan", href: v.layout },
  ].filter(Boolean) as { label: string; href: string }[];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Residence",
    name: v.name,
    description: v.summary,
    url: `${site.url}/ventures/${v.slug}`,
    image: `${site.url}${v.cover}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: v.location,
      addressRegion: site.region,
      addressCountry: site.country,
    },
  };

  return (
    <article>
      <JsonLd data={jsonLd} />

      {/* Hero */}
     <section className="relative text-paper">
  <div className="absolute inset-0">
    <Image
      src={v.cover}
      alt={v.name}
      fill
      priority
      sizes="100vw"
      className="
        object-cover
        object-center
        opacity-100
        brightness-105
        contrast-105
        saturate-110
      "
    />

    <div
      className="absolute inset-0 bg-gradient-to-r from-black/45 via-black/18 to-transparent"
      aria-hidden
    />

    <div
      className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"
      aria-hidden
    />
  </div>
        <div className="wrap relative py-14 md:py-20">
          <Link href="/ventures" className="inline-flex items-center gap-1.5 text-sm text-paper/70 hover:text-gold-soft">
            <ArrowLeft className="h-4 w-4" aria-hidden /> All ventures
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-gold px-3 py-1 text-xs font-semibold text-ink">{v.status}</span>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-paper backdrop-blur">{v.type}</span>
          </div>
          <h1 className="mt-4 font-display text-4xl font-semibold leading-tight sm:text-5xl">{v.name}</h1>
          <p className="mt-3 flex items-center gap-2 text-paper/70">
            <MapPin className="h-4 w-4 text-gold" aria-hidden /> {v.location}, {v.city}
          </p>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-paper/80">{v.tagline}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#enquire" className="btn-gold">Enquire now</a>
            <a href={whatsappLink(`Hi, I'm interested in ${v.name} at ${v.location}.`)} target="_blank" rel="noopener noreferrer" className="btn-ghost-light">
              <MessageCircle className="h-4 w-4" aria-hidden /> WhatsApp
            </a>
            <a href={telLink()} className="btn-ghost-light">
              <Phone className="h-4 w-4" aria-hidden /> Call
            </a>
          </div>
        </div>
      </section>

      <div className="wrap grid gap-12 py-16 lg:grid-cols-[1.6fr_1fr] lg:gap-16">
        {/* Main column */}
        <div className="space-y-14">
          {v.needsContent && (
            <div className="rounded-lg border border-gold/40 bg-gold/5 px-4 py-3 text-sm text-gold-deep">
              Full specifications for this venture are being finalised. Contact us for current
              details, pricing and availability.
            </div>
          )}

          {/* Overview */}
          <Reveal>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-gold" aria-hidden />
              <span className="eyebrow">Overview</span>
            </div>
            <p className="mt-4 text-lg leading-relaxed text-slate-ink">{v.summary}</p>
          </Reveal>

          {/* Highlights */}
          {v.highlights.length > 0 && (
            <Reveal>
              <h2 className="font-display text-2xl font-semibold text-ink">Project highlights</h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-2">
                {v.highlights.map((h) => (
                  <li key={h} className="flex items-start gap-2.5 text-sm text-slate-ink">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold-deep" aria-hidden />
                    {h}
                  </li>
                ))}
              </ul>
            </Reveal>
          )}

          {/* Amenities */}
          {v.amenities.length > 0 && (
            <Reveal>
              <h2 className="font-display text-2xl font-semibold text-ink">Amenities</h2>
              <div className="mt-5 flex flex-wrap gap-2.5">
                {v.amenities.map((a) => (
                  <span key={a} className="rounded-full border border-line bg-white px-4 py-2 text-sm text-ink">
                    {a}
                  </span>
                ))}
              </div>
            </Reveal>
          )}

          {/* Location advantages */}
          {v.connectivity.length > 0 && (
            <Reveal>
              <h2 className="font-display text-2xl font-semibold text-ink">Location advantages</h2>
              <ul className="mt-5 divide-y divide-line border-y border-line">
                {v.connectivity.map((c) => (
                  <li key={c.label} className="flex items-center justify-between py-3">
                    <span className="flex items-center gap-2 text-sm text-slate-ink">
                      <MapPin className="h-4 w-4 text-gold-deep" aria-hidden /> {c.label}
                    </span>
                    <span className="text-sm font-semibold text-ink">{c.time}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          )}

          {/* Map */}
          <Reveal>
            <h2 className="flex items-center gap-2 font-display text-2xl font-semibold text-ink">
              <MapIcon className="h-5 w-5 text-gold-deep" aria-hidden /> On the map
            </h2>
            <div className="mt-5 aspect-[16/9] overflow-hidden rounded-xl border border-line">
              <iframe
                title={`Map — ${v.name}, ${v.location}`}
                src={`https://www.google.com/maps?q=${encodeURIComponent(v.mapQuery)}&output=embed`}
                className="h-full w-full"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <p className="mt-2 text-xs text-slate">Approximate area location. Contact us for the exact site pin.</p>
          </Reveal>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border border-line bg-white p-6 shadow-card">
            <p className="text-sm text-slate">Pricing</p>
            <p className="mt-1 font-display text-2xl font-semibold text-gold-deep">{v.priceLabel}</p>

            <dl className="mt-5 space-y-3 border-t border-line pt-5">
              {factItems(v).map((f) => (
                <div key={f.label} className="flex items-start justify-between gap-4">
                  <dt className="flex items-center gap-2 text-sm text-slate">
                    <f.icon className="h-4 w-4 text-gold-deep" aria-hidden /> {f.label}
                  </dt>
                  <dd className="text-right text-sm font-medium text-ink">{f.value}</dd>
                </div>
              ))}
            </dl>

            <a href="#enquire" className="btn-ink mt-6 w-full">Request details</a>
            <a
              href={whatsappLink(`Hi, I'm interested in ${v.name}.`)}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold mt-2 w-full"
            >
              <MessageCircle className="h-4 w-4" aria-hidden /> WhatsApp
            </a>
          </div>

          {downloads.length > 0 && (
            <div className="rounded-xl border border-line bg-white p-6 shadow-card">
              <h3 className="font-display text-lg font-semibold text-ink">Downloads</h3>
              <ul className="mt-4 space-y-2">
                {downloads.map((d) => (
                  <li key={d.href}>
                    <a
                      href={d.href}
                      className="flex items-center justify-between rounded-lg border border-line px-4 py-3 text-sm font-medium text-ink transition-colors hover:border-gold hover:text-gold-deep"
                      download
                    >
                      {d.label}
                      <Download className="h-4 w-4" aria-hidden />
                    </a>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-slate">PDF files. Drop your latest brochures into <code className="text-slate-ink">/public/downloads</code>.</p>
            </div>
          )}
        </aside>
      </div>

      {/* Enquiry */}
      <section id="enquire" className="border-t border-line bg-paper-200/50 py-16 md:py-20">
        <div className="wrap grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-8 bg-gold" aria-hidden />
              <span className="eyebrow">Enquire</span>
            </div>
            <h2 className="mt-4 font-display text-3xl font-semibold text-ink sm:text-4xl">
              Interested in {v.name}?
            </h2>
            <p className="mt-4 max-w-md text-slate-ink">
              Share your details and our team will get back with pricing, availability and a site-visit slot.
            </p>
          </div>
          <div className="rounded-xl border border-line bg-white p-6 shadow-card md:p-8">
            <LeadForm defaultProject={v.name} />
          </div>
        </div>
      </section>
    </article>
  );
}
