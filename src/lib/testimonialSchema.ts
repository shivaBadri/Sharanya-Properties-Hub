import { z } from "zod";

const optionalText = z.string().trim().optional().or(z.literal(""));

export const testimonialSchema = z.object({
  name: z.string().trim().min(1, "A name is required."),
  location: optionalText,
  project: optionalText,
  rating: z.number().int().min(1).max(5).default(5),
  quote: z.string().trim().min(1, "A quote is required."),
  published: z.boolean().default(true),
});

export type TestimonialInput = z.infer<typeof testimonialSchema>;
