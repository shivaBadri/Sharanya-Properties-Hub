import { z } from "zod";

/**
 * Single source of truth for lead validation — imported by both the
 * client form (HeroEnquiry) and the server route (/api/leads).
 *
 * Optional text fields accept "" so the client can post its full form
 * state without pruning empty values. `venture` and `project` are kept
 * as aliases: the new home-page hero posts `venture`, the existing
 * LeadForm posts `project`; the API maps whichever is present onto the
 * `project` column, so both keep working.
 */

const digitsOf = (v: string) => v.replace(/\D/g, "");

export const leadSchema = z.object({
  name: z.string().trim().min(2, "Please enter your full name."),
  phone: z
    .string()
    .trim()
    .min(1, "Mobile number is required.")
    .refine((v) => {
      const d = digitsOf(v);
      return d.length >= 10 && d.length <= 13;
    }, "Enter a valid mobile number."),
  email: z
    .union([z.string().trim().email("Enter a valid email address."), z.literal("")])
    .optional(),
  venture: z.string().trim().max(120).optional(),
  project: z.string().trim().max(120).optional(),
  budget: z.string().trim().max(60).optional(),
  message: z.string().trim().max(1000, "Message is a little long — please shorten it.").optional(),
  source: z.string().trim().max(60).optional(),
});

export type LeadFormValues = z.infer<typeof leadSchema>;
