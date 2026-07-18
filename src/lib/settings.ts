import { pool, hasDatabase } from "@/lib/db";
import { site } from "@/data/site";
import { settingsSchema, type Settings } from "@/lib/settingsSchema";

export const DEFAULT_SETTINGS: Settings = {
  name: site.name,
  legalName: site.legalName,
  tagline: site.tagline,
  description: site.description,
  url: site.url,
  city: site.city,
  region: site.region,
  country: site.country,
  mapQuery: site.address,
  phone: site.phone,
  phoneDisplay: site.phoneDisplay,
  whatsapp: site.whatsapp,
  email: site.email,
  address: site.address,
  whatsappMessage: site.whatsappMessage,
  social: {
    instagram: site.social.instagram,
    facebook: site.social.facebook,
    youtube: site.social.youtube,
    linkedin: "",
  },
  hero: {
    title: "Land you can trust, in the city that grows with you.",
    subtitle:
      "HMDA & DTCP-approved open plots and villa layouts across the ORR corridor with clear titles, gated infrastructure, and locations built for long-term value.",
    image: "/ventures/sree-city.jpg",
  },
  footer: { note: "" },
};

export async function getSettings(): Promise<Settings> {
  if (hasDatabase && pool) {
    const { rows } = await pool.query(`SELECT data FROM site_settings WHERE id = 'site' LIMIT 1`);
    const stored = (rows[0]?.data ?? {}) as Record<string, unknown>;
    const storedSocial = (stored.social ?? {}) as Record<string, unknown>;
    const storedHero = (stored.hero ?? {}) as Record<string, unknown>;
    const storedFooter = (stored.footer ?? {}) as Record<string, unknown>;
    // Merge stored over defaults so older/partial rows (e.g. the raw site.ts seed) still fill gaps.
    return settingsSchema.parse({
      ...DEFAULT_SETTINGS,
      ...stored,
      social: { ...DEFAULT_SETTINGS.social, ...storedSocial },
      hero: { ...DEFAULT_SETTINGS.hero, ...storedHero },
      footer: { ...DEFAULT_SETTINGS.footer, ...storedFooter },
    });
  }
  return DEFAULT_SETTINGS;
}

export async function updateSettings(input: Settings): Promise<void> {
  await pool!.query(
    `INSERT INTO site_settings (id, data) VALUES ('site', $1::jsonb)
     ON CONFLICT (id) DO UPDATE SET data = EXCLUDED.data`,
    [JSON.stringify(input)]
  );
}
