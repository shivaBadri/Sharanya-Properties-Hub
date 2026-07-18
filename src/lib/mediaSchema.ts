import { z } from "zod";

// Client-safe (zod only).

export const MEDIA_CATEGORIES = [
  "Township",
  "Villa",
  "Premium Layout",
  "Club House",
  "Children's Park",
  "Landscape",
  "Roads",
  "Entrance Arch",
  "Drone View",
  "Amenities",
] as const;

const optionalText = z.string().trim().optional().or(z.literal(""));

export const mediaSchema = z.object({
  url: z.string().trim().min(1, "An image URL is required."),
  caption: optionalText,
  category: optionalText,
  ventureId: optionalText,
  kind: z.enum(["image", "video"]).default("image"),
});

export type MediaInput = z.infer<typeof mediaSchema>;
