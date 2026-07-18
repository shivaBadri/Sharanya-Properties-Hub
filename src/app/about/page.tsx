import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Eye, HeartHandshake, Building2, ArrowRight } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: "About Us — Trust & Transparency in Hyderabad Real Estate",
  description:
    "Sharanya Properties Hub develops approved plotted communities across Hyderabad with a focus on clear titles, genuine approvals and honest guidance.",
  alternates: { canonical: "/about" },
};

const pillars = [
  { icon: Building2, title: "Mission", body: "Make approved, well-located land ownership accessible and genuinely trustworthy for every buyer — first-time or seasoned." },
  { icon: Eye, title: "Vision", body: "Become Hyderabad's most transparent name in plotted developments along the Outer Ring Road growth corridor." },
  { icon: HeartHandshake, title: "Values", body: "Clarity over jargon, accountability over promises, and long-term relationships over one-time transactions." },
  { icon: ShieldCheck, title: "Trust focus", body: "Every venture is chosen and documented so a buyer's ownership stands on solid legal and infrastructural ground." },
];

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-ink py-20 text-paper md:py-28">
        <Image src="/ventures/rock-town-majeedpur.jpg" alt="" fill sizes="100vw" className="object-cover opacity-[0.12] [filter:saturate(1.1)]" />
        <div className="absolute inset-0 bg-gradient-to-br from-ink/85 via-ink/70 to-ink/95" aria-hidden />
        <div className="absolute inset-0 plot-grid opacity-40" aria-hidden />
        <div className="wrap relative grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
          <SectionHeading
            eyebrow="About Sharanya Properties Hub"
            title="We sell certainty, not just square yards."
            intro={`${site.legalName} develops approved plotted communities across Hyderabad. Our work centres on the things that actually protect a buyer — clear titles, real approvals, genuine infrastructure and straight answers.`}
            light
          />
          <Reveal delay={0.1} className="justify-self-center lg:justify-self-end">
            <div className="rounded-2xl bg-paper p-5 shadow-lift">
              <Image
                src="/brand/sharanya-logo.jpg"
                alt={`${site.legalName} logo`}
                width={280}
                height={276}
                className="h-auto w-52 sm:w-60"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="wrap py-20 md:py-28">
        <div className="grid gap-6 sm:grid-cols-2">
          {pillars.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.05}>
              <div className="h-full rounded-xl border border-line bg-white p-7 shadow-card">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gold/12 text-gold-deep">
                  <p.icon className="h-5 w-5" aria-hidden />
                </div>
                <h3 className="mt-4 font-display text-xl font-semibold text-ink">{p.title}</h3>
                <p className="mt-2 leading-relaxed text-slate-ink">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-16">
          <div className="rounded-xl border border-line bg-paper-200/60 p-8 md:p-10">
            <h2 className="font-display text-2xl font-semibold text-ink">Our expertise</h2>
            <p className="mt-4 max-w-3xl leading-relaxed text-slate-ink">
              We concentrate on Hyderabad&apos;s southern and south-eastern ORR belt — Nadergul and
              the airport corridor — where infrastructure and demand are moving together. That focus
              lets us evaluate approvals, connectivity and long-term potential with real depth, rather
              than spreading thin across the city. From HMDA-approved gated layouts to villa
              communities, our ventures are planned for people who intend to build, live or hold for
              the long term.
            </p>
            <Link href="/ventures" className="btn-gold mt-6">
              Explore our ventures <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </Reveal>
      </section>
    </>
  );
}
