import type { Metadata } from "next";
import { Quote, Star } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import Reveal from "@/components/Reveal";
import { getTestimonials } from "@/lib/testimonials";

export const metadata: Metadata = {
  title: "Testimonials — What Our Buyers Say",
  description:
    "Read reviews from Sharanya Properties Hub buyers about transparency, approvals, connectivity and the buying experience.",
  alternates: { canonical: "/testimonials" },
};

export const dynamic = "force-dynamic";

export default async function TestimonialsPage() {
  const testimonials = await getTestimonials();
  return (
    <div className="wrap py-16 md:py-20">
      <SectionHeading
        eyebrow="Testimonials"
        title="Buyers, in their own words."
        intro="Real experiences from people who chose Sharanya Properties Hub."
      />
      <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {testimonials.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.05}>
            <figure className="flex h-full flex-col rounded-xl border border-line bg-white p-6 shadow-card">
              <Quote className="h-7 w-7 text-gold/50" aria-hidden />
              <blockquote className="mt-3 flex-1 text-[15px] leading-relaxed text-ink">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="mt-5 flex items-center gap-0.5" aria-label={t.rating + " out of 5"}>
                {Array.from({ length: 5 }).map((_, s) => (
                  <Star key={s} className={s < t.rating ? "h-4 w-4 fill-gold text-gold" : "h-4 w-4 text-line"} aria-hidden />
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
    </div>
  );
}
