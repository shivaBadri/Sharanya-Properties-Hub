export const site = {
  name: "Sharanya Properties Hub",
  legalName: "Sharanya Properties Hub Hyderabad",
  tagline: "HMDA & DTCP approved plotted developments across Hyderabad",
  description:
    "Sharanya Properties Hub develops premium, approved open plots and villa layouts across Hyderabad's ORR growth corridor — clear titles, gated infrastructure, and locations built for long-term value.",
  // Update this to your live domain before deploying (used for canonical URLs, sitemap, OG tags)
  url: "https://sharanyaproperties.in",
  city: "Hyderabad",
  region: "Telangana",
  country: "IN",

  phone: "+919493702929",
  phoneDisplay: "+91 94937 02929",
  whatsapp: "919493702929",
  email: "info@sharanyaproperties.in",
  address: "Nadergul, Hyderabad, Telangana",

  // A one-line, pre-filled WhatsApp opener
  whatsappMessage: "Hi Sharanya Properties Hub, I'd like details about your plotted projects.",

  social: {
    instagram: "",
    facebook: "",
    youtube: "",
  },
} as const;

export function whatsappLink(message?: string) {
  const text = encodeURIComponent(message ?? site.whatsappMessage);
  return `https://wa.me/${site.whatsapp}?text=${text}`;
}

export function telLink() {
  return `tel:${site.phone}`;
}

export const nav = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Ventures", href: "/ventures" },
  { label: "Gallery", href: "/gallery" },
  { label: "Downloads", href: "/downloads" },
  { label: "Testimonials", href: "/testimonials" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
] as const;
