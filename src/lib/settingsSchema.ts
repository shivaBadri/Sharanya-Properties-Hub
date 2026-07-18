import { z } from "zod";

const s = z.string().trim();

export const settingsSchema = z.object({
  // Company
  name: s.default(""),
  legalName: s.default(""),
  tagline: s.default(""),
  description: s.default(""),
  url: s.default(""),
  // Location
  city: s.default(""),
  region: s.default(""),
  country: s.default(""),
  mapQuery: s.default(""),
  // Contact
  phone: s.default(""),
  phoneDisplay: s.default(""),
  whatsapp: s.default(""),
  email: s.default(""),
  address: s.default(""),
  whatsappMessage: s.default(""),
  // Social
  social: z
    .object({
      instagram: s.default(""),
      facebook: s.default(""),
      youtube: s.default(""),
      linkedin: s.default(""),
    })
    .default({}),
  // Hero
  hero: z
    .object({
      title: s.default(""),
      subtitle: s.default(""),
      image: s.default(""),
    })
    .default({}),
  // Footer
  footer: z.object({ note: s.default("") }).default({}),
});

export type Settings = z.infer<typeof settingsSchema>;
