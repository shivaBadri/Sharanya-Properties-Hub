# Deployment guide

## TL;DR

The **public marketing site + lead capture work on Vercel** (static pages + a Postgres-backed lead API). What's left:

1. **Set a database URL.** Lead persistence is already coded (PostgreSQL via `pg`). Just set `DATABASE_URL` and run `db/schema.sql` — otherwise leads fall back to a JSON file that does **not** persist on Vercel's read-only filesystem.
2. **File uploads** (Phase-2 admin) still need external storage (Vercel Blob / Cloudinary / S3) — the read-only FS applies to uploads too.
3. **Admin auth.** `/admin` ships without login. Gate it before exposing real data.

---

## 1. Deploy the site to Vercel

1. Push this repo to GitHub.
2. Import it in Vercel. Framework preset: **Next.js** (auto-detected). No build config changes needed.
3. Set environment variables (from `.env.example`) — at minimum `NEXT_PUBLIC_SITE_URL`.
4. Also set `url` in `data/site.ts` to your real domain.
5. Deploy.

That gets you a fast, SEO-ready site with working WhatsApp/call CTAs and the lead form posting to `/api/leads`. To actually *keep* those leads, do step 2.

---

## 2. Database (leads) — already wired

Lead capture uses `pg` and is verified against real PostgreSQL. To activate:

1. Add a Postgres database (Vercel Postgres, Neon, Supabase, Railway). Copy its connection string into `DATABASE_URL`. On serverless, use the provider's **pooled** URL (pgbouncer). Vercel Postgres also sets `POSTGRES_URL`, which the app reads automatically.
2. Create the table:
   ```bash
   psql "$DATABASE_URL" -f db/schema.sql
   ```
3. Deploy. New enquiries persist and show on `/admin`.

No connection string set → the app falls back to a local JSON file (dev only), so `npm run dev` and `next build` work with zero database setup.

**Notifications** are wired in `src/lib/notify.ts` and fire from `/api/leads`:
- Email to sales: set `RESEND_API_KEY` + `NOTIFY_EMAIL` (+ a Resend-verified `NOTIFY_FROM`).
- WhatsApp / anything: set `LEAD_WEBHOOK_URL` to a Zapier/Make/n8n endpoint that forwards to WhatsApp Business.
Both are best-effort — a notification failure is logged and never blocks the lead from saving.

The broader `prisma/schema.prisma` (ventures, media, downloads, testimonials, FAQs, page content, users + roles + per-employee permissions) is the blueprint for the Phase-2 admin. Adopt Prisma there, or keep extending the SQL in `db/`.

---

## 3. Uploads — do NOT use local disk on Vercel

The spec mentioned "local uploads." On Vercel this silently fails (read-only FS). Pick one:

- **Vercel Blob** — simplest on Vercel. `npm i @vercel/blob`, set `BLOB_READ_WRITE_TOKEN`.
- **Cloudinary** — great for image transforms. Set `CLOUDINARY_URL`.
- **AWS S3** — most control. Set the `S3_*` / `AWS_*` vars.

Whichever you choose, add its hostname to `images.remotePatterns` in `next.config.mjs` so `<Image>` can optimize remote files.

---

## 4. Admin authentication (NextAuth)

1. `npm i next-auth @auth/prisma-adapter`
2. Add `NEXTAUTH_SECRET` (`openssl rand -base64 32`) and `NEXTAUTH_URL`.
3. Add a credentials (or Google) provider backed by the `User` model.
4. Protect `/admin` with `middleware.ts` (redirect unauthenticated users to sign-in) and check `role` / `permissions` per module.

`/admin` and `/api/` are already disallowed in `robots.txt`.

---

## 5. Performance checklist (for Lighthouse 95+)

Already done: static rendering, `next/image` with AVIF/WebP, lazy-loaded gallery + map iframes, self-hosted fonts (no render-blocking font fetch), code-split routes, ~105 kB shared JS.

You still control:
- **Image weight** — the venture/gallery JPGs are rasterized brochure pages; re-export hero/marketing images as tighter WebP where you can.
- **Map embeds** — each Google Maps iframe adds weight; they're lazy-loaded, but consider a static map image + "open in Maps" link if you need to squeeze the last points.
- **Hosting** — run Lighthouse against the deployed Vercel URL, not `localhost`.

Lighthouse scores are earned on the deployed site with real content — treat 95+ as a target to verify, not a guarantee baked into the code.
