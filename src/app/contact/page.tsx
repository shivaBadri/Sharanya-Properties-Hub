import type { Metadata } from "next";
import { Phone, MessageCircle, Mail, MapPin, Clock } from "lucide-react";
import SectionHeading from "@/components/SectionHeading";
import LeadForm from "@/components/LeadForm";
import Reveal from "@/components/Reveal";
import { site, whatsappLink, telLink } from "@/data/site";

export const metadata: Metadata = {
  title: "Contact — Call or WhatsApp Sharanya Properties Hub",
  description:
    "Get in touch with Sharanya Properties Hub Hyderabad. Call or WhatsApp +91 94937 02929 for plot availability, pricing and site visits.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <div className="wrap py-16 md:py-20">
      <SectionHeading
        eyebrow="Contact"
        title="Let's talk about your next plot."
        intro="Call, WhatsApp, or send an enquiry — whichever is easiest. We'll help you find the right venture and arrange a site visit."
      />

      <div className="mt-12 grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
        {/* Left: contact methods */}
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <a href={telLink()} className="rounded-xl border border-line bg-white p-5 shadow-card transition-colors hover:border-gold">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-gold/12 text-gold-deep">
                <Phone className="h-5 w-5" aria-hidden />
              </span>
              <p className="mt-3 text-sm text-slate">Call us</p>
              <p className="font-display text-lg font-semibold text-ink">{site.phoneDisplay}</p>
            </a>
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-line bg-white p-5 shadow-card transition-colors hover:border-gold"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#25D366]/15 text-[#1c8f4b]">
                <MessageCircle className="h-5 w-5" aria-hidden />
              </span>
              <p className="mt-3 text-sm text-slate">WhatsApp</p>
              <p className="font-display text-lg font-semibold text-ink">{site.phoneDisplay}</p>
            </a>
          </div>

          <div className="rounded-xl border border-line bg-white p-6 shadow-card">
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 text-gold-deep" aria-hidden />
                <div>
                  <p className="text-slate">Email</p>
                  <a href={`mailto:${site.email}`} className="font-medium text-ink hover:text-gold-deep">{site.email}</a>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 text-gold-deep" aria-hidden />
                <div>
                  <p className="text-slate">Office</p>
                  <p className="font-medium text-ink">{site.address}</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Clock className="mt-0.5 h-5 w-5 text-gold-deep" aria-hidden />
                <div>
                  <p className="text-slate">Hours</p>
                  <p className="font-medium text-ink">Mon–Sun, 9:30 AM – 7:00 PM</p>
                </div>
              </li>
            </ul>
          </div>

          <div className="aspect-[16/10] overflow-hidden rounded-xl border border-line">
            <iframe
              title="Sharanya Properties Hub — service area, Hyderabad"
              src={`https://www.google.com/maps?q=${encodeURIComponent("Nadergul, Hyderabad, Telangana")}&output=embed`}
              className="h-full w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        {/* Right: form */}
        <Reveal>
          <div className="rounded-xl border border-line bg-white p-6 shadow-card md:p-8">
            <h2 className="font-display text-2xl font-semibold text-ink">Send an enquiry</h2>
            <p className="mt-2 text-sm text-slate-ink">We typically respond within a few hours on working days.</p>
            <div className="mt-6">
              <LeadForm />
            </div>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
