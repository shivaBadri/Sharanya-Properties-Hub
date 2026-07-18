export type DownloadCategory = "Brochure" | "Layout" | "Document";

export interface DownloadItem {
  label: string;
  project: string;
  category: DownloadCategory;
  file: string; // path under /public
  uploaded: string; // ISO date
}

export const downloads: DownloadItem[] = [
  { label: "SR Serenity Heights — Brochure", project: "SR Serenity Heights", category: "Brochure", file: "/downloads/serenity-heights-brochure.pdf", uploaded: "2026-07-01" },
  { label: "SR Eco Park — Brochure", project: "SR Eco Park", category: "Brochure", file: "/downloads/sr-eco-park-brochure.pdf", uploaded: "2026-07-01" },
  { label: "SR Infinity Villas — Brochure", project: "SR Infinity Villas", category: "Brochure", file: "/downloads/sr-infinity-villas-brochure.pdf", uploaded: "2026-07-01" },
  { label: "Aero Villas — Brochure", project: "Aero Villas", category: "Brochure", file: "/downloads/aero-villas-nadergul-brochure.pdf", uploaded: "2026-07-01" },
  { label: "Saffron Skyline — Brochure", project: "Saffron Skyline", category: "Brochure", file: "/downloads/saffron-skyline-brochure.pdf", uploaded: "2026-07-01" },
  { label: "Sree City — Brochure", project: "Sree City", category: "Brochure", file: "/downloads/sree-city-brochure.pdf", uploaded: "2026-07-01" },
  { label: "Sree City — Layout (300 ft road)", project: "Sree City", category: "Layout", file: "/downloads/sree-city-layout.pdf", uploaded: "2026-07-01" },
  { label: "Rock Town — Layout", project: "Rock Town", category: "Layout", file: "/downloads/rock-town-majeedpur-layout.pdf", uploaded: "2026-07-01" },
];
