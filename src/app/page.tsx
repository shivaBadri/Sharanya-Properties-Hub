import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  MessageCircle,
  Phone,
  ShieldCheck,
  FileCheck2,
  Route,
  Trees,
  Banknote,
  MapPin,
  Quote,
  Star,
} from "lucide-react";
import Reveal from "@/components/Reveal";
import SectionHeading from "@/components/SectionHeading";
import VentureCard from "@/components/VentureCard";
import Accordion from "@/components/Accordion";
import LeadForm from "@/components/LeadForm";
import HeroEnquiry from "@/components/HeroEnquiry";
import { getPublishedVentures } from "@/lib/ventures";
import { getSettings } from "@/lib/settings";
import { getTestimonials } from "@/lib/testimonials";
import { getFaqs } from "@/lib/faqs";
import { site, whatsappLink, telLink } from "@/data/site";

const whyUs = [
  { icon: FileCheck2, title: "Approved & clear titles", body: "HMDA / DTCP-approved layouts with clear, verifiable titles — so your investment stands on solid legal ground." },
  { icon: Route, title: "Located for growth", body: "Every venture sits on Hyderabad's ORR corridor, minutes from the airport, IT and aerospace hubs." },
  { icon: ShieldCheck, title: "Gated infrastructure", body: "CC roads, underground utilities, compound walls and 24×7 security built in from day one." },
  { icon: Trees, title: "Liveable communities", body: "Landscaped avenues, parks, groves and wellness zones — not just plots, but places to live." },
  { icon: Banknote, title: "Loan assistance", body: "Tie-ups with leading banks make financing straightforward for eligible buyers." },
  { icon: ShieldCheck, title: "Transparent process", body: "Clear pricing, honest documentation and responsive support over call and WhatsApp." },
];

const benefits = [
  { k: "01", title: "Land appreciates", body: "Plotted developments in growth corridors have historically outpaced many asset classes over the long term." },
  { k: "02", title: "Tangible & yours", body: "A registered plot is a real, ownable asset — build when you're ready, or hold and let value compound." },
  { k: "03", title: "Lower entry, high upside", body: "Approved plots let you enter a premium location earlier, ahead of full infrastructure build-out." },
  { k: "04", title: "Airport-corridor demand", body: "Proximity to RGIA, ORR and Adibatla's IT/aerospace zone keeps demand and rental potential strong." },
];

const areas = ["Nadergul", "Majeedpur", "Hasthinapuram", "Badangpet", "Adibatla", "Karmanghat", "ORR Corridor"];

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [published, settings, testimonials, faqs] = await Promise.all([
    getPublishedVentures(),
    getSettings(),
    getTestimonials(),
    getFaqs(),
  ]);
  const featured = published.filter((v) => v.featured).slice(0, 3);
  const ventureOptions = published.map((v) => ({ slug: v.slug, name: v.name }));
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────── */}
<HeroEnquiry hero={settings.hero} ventures={ventureOptions} />

      {/* ── About ────────────────────────────────────────── */}
      <section className="wrap py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          <SectionHeading
            eyebrow="About Sharanya Properties Hub"
            title="A property partner built on transparency, not pressure."
            intro="Sharanya Properties Hub develops approved plotted communities across Hyderabad. We focus on the fundamentals that actually protect a buyer — clear titles, genuine approvals, real infrastructure and honest guidance — so your decision is informed, and your ownership is secure."
          />
          <Reveal delay={0.1} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {[
              { h: "Our mission", p: "Make approved, well-located land ownership accessible and trustworthy for every buyer." },
              { h: "Our vision", p: "Be Hyderabad's most transparent name in plotted developments along the ORR corridor." },
              { h: "Our values", p: "Clarity, accountability and long-term relationships over one-time transactions." },
              { h: "Our focus", p: "Locations with real connectivity and infrastructure that appreciate over time." },
            ].map((c) => (
              <div key={c.h} className="rounded-xl border border-line bg-white p-5 shadow-card">
                <h3 className="font-display text-lg font-semibold text-ink">{c.h}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-ink">{c.p}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ── Why choose us ────────────────────────────────── */}
      <section className="bg-paper-200/60 py-20 md:py-28">
        <div className="wrap">
          <SectionHeading
            eyebrow="Why choose us"
            title="Six reasons buyers pick Sharanya."
            align="center"
          />
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {whyUs.map((f, i) => (
              <Reveal key={f.title} delay={i * 0.04}>
                <div className="h-full rounded-xl border border-line bg-white p-6 shadow-card transition-shadow hover:shadow-lift">
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gold/12 text-gold-deep">
                    <f.icon className="h-5 w-5" aria-hidden />
                  </div>
                  <h3 className="mt-4 font-display text-lg font-semibold text-ink">{f.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-ink">{f.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured ventures ────────────────────────────── */}
      <section className="wrap py-20 md:py-28">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading eyebrow="Featured ventures" title="Current plotted communities." />
          <Reveal>
            <Link href="/ventures" className="btn-ghost">
              All ventures <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </Reveal>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((v) => (
            <Reveal key={v.slug}>
              <VentureCard venture={v} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── Investment benefits ──────────────────────────── */}
      <section className="relative overflow-hidden bg-ink py-20 text-paper md:py-28">
        <div className="absolute inset-0 plot-grid opacity-40" aria-hidden />
        <div className="wrap relative">
          <SectionHeading
            eyebrow="Investment benefits"
            title="Why land, and why here."
            intro="Plotted developments in a growth corridor combine tangible ownership with strong appreciation potential."
            light
          />
          <div className="mt-14 grid gap-px overflow-hidden rounded-xl border border-white/10 bg-white/5 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((b, i) => (
              <Reveal key={b.k} delay={i * 0.05}>
                <div className="h-full bg-ink/50 p-6 backdrop-blur">
                  <span className="font-display text-3xl font-semibold text-gold/40">{b.k}</span>
                  <h3 className="mt-3 font-display text-lg font-semibold text-paper">{b.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-paper/60">{b.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <p className="mt-6 max-w-2xl text-xs text-paper/40">
            Real estate values can rise or fall; past trends don&apos;t guarantee future returns.
            Please evaluate each opportunity on its own merits.
          </p>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────── */}
      <section className="wrap py-20 md:py-28">
        <SectionHeading eyebrow="Testimonials" title="What our buyers say." align="center" />
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.05}>
              <figure className="flex h-full flex-col rounded-xl border border-line bg-white p-6 shadow-card">
                <Quote className="h-7 w-7 text-gold/50" aria-hidden />
                <blockquote className="mt-3 flex-1 text-[15px] leading-relaxed text-ink">
                  &ldquo;{t.quote}&rdquo;
                </blockquote>
                <div className="mt-5 flex items-center gap-0.5" aria-label={`${t.rating} out of 5`}>
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star
                      key={s}
                      className={s < t.rating ? "h-4 w-4 fill-gold text-gold" : "h-4 w-4 text-line"}
                      aria-hidden
                    />
                  ))}
                </div>
                <figcaption className="mt-3 border-t border-line pt-3 text-sm">
                  <span className="font-semibold text-ink">{t.name}</span>
                  <span className="text-slate"> · {t.location} · {t.project}</span>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────── */}
      <section className="bg-paper-200/60 py-20 md:py-28">
        <div className="wrap grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <SectionHeading
            eyebrow="FAQ"
            title="Answers before you ask."
            intro="Still have a question? Message us on WhatsApp — we usually reply within minutes."
          />
          <Reveal delay={0.1}>
            <Accordion items={faqs} />
          </Reveal>
        </div>
      </section>

      {/* ── Location coverage ────────────────────────────── */}
      <section className="wrap py-20 md:py-28">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <Reveal>
            <div className="relative overflow-hidden rounded-xl border border-line shadow-card">
              <Image
                src="/ventures/sr-eco-park.jpg"
                alt="Sharanya Properties Hub layout in Hyderabad's ORR corridor"
                width={800}
                height={600}
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>
          <div>
            <SectionHeading
              eyebrow="Location coverage"
              title="Concentrated on Hyderabad's ORR growth belt."
              intro="We focus where infrastructure and demand are moving together — the southern and south-eastern ORR corridor around Nadergul and the airport."
            />
            <Reveal delay={0.1}>
              <ul className="mt-6 flex flex-wrap gap-2.5">
                {areas.map((a) => (
                  <li
                    key={a}
                    className="inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-4 py-2 text-sm font-medium text-ink"
                  >
                    <MapPin className="h-3.5 w-3.5 text-gold-deep" aria-hidden />
                    {a}
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── Contact CTA ──────────────────────────────────── */}
      <section id="enquire" className="wrap pb-8">
        <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-lift">
          <div className="grid lg:grid-cols-2">
            <div className="relative flex flex-col justify-center bg-ink p-8 text-paper md:p-12">
              <div className="absolute inset-0 plot-grid opacity-40" aria-hidden />
              <div className="relative">
                <h2 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">
                  Ready to find the right plot?
                </h2>
                <p className="mt-4 max-w-md text-paper/70">
                  Tell us what you&apos;re looking for and we&apos;ll share availability, pricing and
                  the fastest way to a site visit.
                </p>
                <div className="mt-8 space-y-3 text-sm">
                  <a href={telLink()} className="flex items-center gap-3 text-paper/80 hover:text-gold-soft">
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                      <Phone className="h-4 w-4 text-gold" aria-hidden />
                    </span>
                    {site.phoneDisplay}
                  </a>
                  <a
                    href={whatsappLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-paper/80 hover:text-gold-soft"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10">
                      <MessageCircle className="h-4 w-4 text-gold" aria-hidden />
                    </span>
                    WhatsApp us anytime
                  </a>
                </div>
              </div>
            </div>
            <div className="p-8 md:p-12">
              <LeadForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
