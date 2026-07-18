// Client-safe: no server/db imports, so both the admin UI and API can use it.

export type LeadStatus =
  | "New"
  | "Contacted"
  | "Interested"
  | "Site Visit"
  | "Booked"
  | "Closed";

export const LEAD_STATUSES: LeadStatus[] = [
  "New",
  "Contacted",
  "Interested",
  "Site Visit",
  "Booked",
  "Closed",
];

export const LEAD_STATUS_STYLES: Record<LeadStatus, string> = {
  New: "bg-gold/15 text-gold-deep",
  Contacted: "bg-blue-50 text-blue-700",
  Interested: "bg-violet-50 text-violet-700",
  "Site Visit": "bg-amber-50 text-amber-700",
  Booked: "bg-emerald-50 text-emerald-700",
  Closed: "bg-slate-100 text-slate-700",
};
