import type { Metadata } from "next";
import SectionHeading from "@/components/SectionHeading";
import Accordion from "@/components/Accordion";
import JsonLd from "@/components/JsonLd";
import { getFaqs } from "@/lib/faqs";

export const metadata: Metadata = {
  title: "FAQ — Buying Plots & Villas in Hyderabad",
  description:
    "Answers to common questions about approvals, plot sizes, loans, site visits and pricing for Sharanya Properties Hub ventures.",
  alternates: { canonical: "/faq" },
};

export const dynamic = "force-dynamic";

export default async function FaqPage() {
  const faqs = await getFaqs();
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <div className="wrap py-16 md:py-20">
      <JsonLd data={faqJsonLd} />
      <SectionHeading
        eyebrow="FAQ"
        title="Questions, answered."
        intro="If your question isn't here, call or WhatsApp us on +91 94937 02929."
      />
      <div className="mt-12 max-w-3xl">
        <Accordion items={faqs} />
      </div>
    </div>
  );
}
