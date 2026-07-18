# Sharanya Properties Hub — Website

Premium real-estate site for **Sharanya Properties Hub Hyderabad** — plotted developments and villa communities across the ORR corridor. Built with Next.js 15 (App Router), TypeScript, Tailwind CSS and Framer Motion.

Contact wired throughout: **+91 94937 02929** (call + WhatsApp).

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000
```

Production build:

```bash
npm run build
npm run start
```

The build is verified — `npm run build` compiles, type-checks, lints and statically prerenders all pages with zero errors.

---

## What's included (working today)

- **Home** — hero, about, why-us, featured ventures, investment benefits, testimonials, FAQ, location coverage, contact CTA with lead form.
- **Ventures listing** (`/ventures`) — searchable, filterable by location / type / status.
- **Venture detail** (`/ventures/[slug]`) — SSG pages for all 7 projects: overview, highlights, amenities, location advantages, Google Map, downloads, inquiry form, WhatsApp CTA, `Residence` JSON-LD.
- **Gallery** (`/gallery`) — image grid with lightbox + a Videos tab (add YouTube IDs in `data/gallery.ts`).
- **Downloads** (`/downloads`) — brochures/layouts with real file sizes.
- **Testimonials, FAQ, Contact, About** pages.
- **SEO** — per-page metadata, Open Graph, Twitter cards, `RealEstateAgent` + `FAQPage` + `Residence` JSON-LD, dynamic `sitemap.xml`, `robots.txt`.
- **Lead capture** — `/api/leads` with validation, **PostgreSQL persistence**, and email/WhatsApp notifications; floating WhatsApp + Call buttons. Works with zero setup in dev (JSON fallback) and with a database in production.
- **Admin scaffold** (`/admin`) — dashboard with live counters + module map (see *Phase 2* below).

### Content sourced from your brochures
Venture data in `data/ventures.ts` was seeded from the supplied PDFs. Records where the brochure was image-only (no extractable text) are flagged `needsContent: true` — **verify pricing, sizes and approvals before launch**. Testimonials in `data/content.ts` are placeholders; replace with real, consented reviews.

---

## Editing content (no admin needed yet)

All content lives in typed files under `/data`:

| File | Controls |
|------|----------|
| `data/site.ts` | Company name, phone, WhatsApp, email, address, nav, domain |
| `data/ventures.ts` | All projects (the main content) |
| `data/content.ts` | Testimonials + FAQs |
| `data/gallery.ts` | Gallery images + videos |
| `data/downloads.ts` | Downloadable files |

Images live in `/public/ventures` and `/public/gallery`. Brochures go in `/public/downloads` (see that folder's `README.txt`).

**Before deploying:** set your real domain in `data/site.ts` (`url`) — it drives canonical URLs, sitemap and OG tags.

---

## Turn on the database (leads) — done, just configure

Lead capture is already wired to PostgreSQL via `pg`. To activate it:

1. Create a Postgres database (Vercel Postgres, Neon, Supabase, Railway…).
2. Set `DATABASE_URL` (see `.env.example`). Leave it unset in dev to use the JSON fallback.
3. Create the table once:
   ```bash
   psql "$DATABASE_URL" -f db/schema.sql
   ```
4. That's it — new enquiries now persist and appear on `/admin`.

**Lead notifications** (optional, all in `src/lib/notify.ts`): set `RESEND_API_KEY` + `NOTIFY_EMAIL` for email alerts to sales, and/or `LEAD_WEBHOOK_URL` to POST each lead to a Zapier/Make/n8n flow that forwards to WhatsApp. A failed notification never blocks the lead from saving.

## Phase 2 — full admin

Still deferred (and intentionally not half-built):

1. Auth — add NextAuth and gate `/admin` (schema already models users + roles + per-employee permissions in `prisma/schema.prisma`).
2. Admin CRUD for ventures, media, testimonials, FAQs, downloads.
3. Uploads — move to Vercel Blob / Cloudinary / S3 (**required** on Vercel — see DEPLOYMENT.md).

Full details in **DEPLOYMENT.md**.

---

## Tech

Next.js 15 · React 19 · TypeScript · Tailwind CSS 3 · Framer Motion · lucide-react · self-hosted fonts (Fraunces + Manrope via `@fontsource`, no external font fetch).
