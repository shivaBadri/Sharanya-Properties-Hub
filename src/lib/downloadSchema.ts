import { z } from "zod";

export const DOWNLOAD_CATEGORIES = ["Brochure", "Layout", "Document"] as const;

const optionalText = z.string().trim().optional().or(z.literal(""));

export const downloadSchema = z.object({
  label: z.string().trim().min(1, "A label is required."),
  category: z.enum(DOWNLOAD_CATEGORIES).default("Brochure"),
  url: z.string().trim().min(1, "A file URL is required."),
  ventureId: optionalText,
  sizeBytes: z.number().int().nonnegative().optional(),
});

export type DownloadInput = z.infer<typeof downloadSchema>;
