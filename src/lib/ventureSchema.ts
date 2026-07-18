import { z } from "zod";

// Client-safe (zod only) — shared by the admin form and the API.

export const VENTURE_STATUSES = ["ONGOING", "UPCOMING", "READY", "SOLD_OUT"] as const;
export const PUBLISH_STATES = ["DRAFT", "PUBLISHED"] as const;

export const VENTURE_STATUS_LABELS: Record<(typeof VENTURE_STATUSES)[number], string> = {
  ONGOING: "Ongoing",
  UPCOMING: "Upcoming",
  READY: "Ready to Register",
  SOLD_OUT: "Sold Out",
};

const optionalText = z.string().trim().optional().or(z.literal(""));

export const ventureSchema = z.object({
  name: z.string().trim().min(2, "Name is required."),
  slug: z
    .string()
    .trim()
    .min(1, "Slug is required.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens only."),
  location: z.string().trim().min(1, "Location is required."),
  city: z.string().trim().min(1).default("Hyderabad"),
  type: z.string().trim().min(1, "Type is required."),
  status: z.enum(VENTURE_STATUSES),
  publishState: z.enum(PUBLISH_STATES),
  featured: z.boolean().default(false),
  priceLabel: z.string().trim().default("Price on request"),
  tagline: z.string().trim().default(""),
  summary: z.string().trim().default(""),
  extent: optionalText,
  plots: optionalText,
  sizeRange: optionalText,
  mapQuery: z.string().trim().default(""),
  highlights: z.array(z.string().trim().min(1)).default([]),
  amenities: z.array(z.string().trim().min(1)).default([]),
  approvals: z.array(z.string().trim().min(1)).default([]),
  connectivity: z
    .array(z.object({ label: z.string().trim().min(1), time: z.string().trim().min(1) }))
    .default([]),
  coverImage: optionalText,
  metaTitle: optionalText,
  metaDescription: optionalText,
});

export type VentureInput = z.infer<typeof ventureSchema>;
