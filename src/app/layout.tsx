import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FloatingActions from "@/components/FloatingActions";
import JsonLd from "@/components/JsonLd";
import { site } from "@/data/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.legalName} | ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: [
    "Real Estate Hyderabad",
    "Open Plots Hyderabad",
    "Villa Projects Hyderabad",
    "HMDA Approved Plots",
    "DTCP Approved Projects",
    "Investment Properties Hyderabad",
    "Plots in Nadergul",
  ],
  applicationName: site.name,
  authors: [{ name: site.legalName }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: site.name,
    title: `${site.legalName} | ${site.tagline}`,
    description: site.description,
    url: site.url,
    images: [{ url: "/brand/sharanya-logo.jpg", width: 720, height: 709, alt: site.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.legalName}`,
    description: site.description,
    images: ["/brand/sharanya-logo.jpg"],
  },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.svg" },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  name: site.legalName,
  description: site.description,
  url: site.url,
  telephone: site.phone,
  areaServed: { "@type": "City", name: "Hyderabad" },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Nadergul",
    addressRegion: site.region,
    addressCountry: site.country,
  },
  knowsAbout: ["Open plots", "Villa plots", "HMDA approved layouts", "Real estate investment"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-pt-20">
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[60] focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
        >
          Skip to content
        </a>
        <JsonLd data={orgJsonLd} />
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <FloatingActions />
      </body>
    </html>
  );
}
