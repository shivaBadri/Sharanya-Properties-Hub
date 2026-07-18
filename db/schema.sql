-- Sharanya Properties Hub — full database schema (PostgreSQL). Idempotent & re-runnable.
--   psql "$DATABASE_URL" -f db/schema.sql      # tables
--   psql "$DATABASE_URL" -f db/seed.sql        # sample content
--
-- Mirrors prisma/schema.prisma (kept as the ORM blueprint) in plain SQL, since the
-- app persists via `pg`. Enums are modelled as TEXT + CHECK — matching the existing
-- leads table and staying trivially alterable. Lead status values expand in Module 5.

-- updated_at helper -----------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS trigger AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Users & sessions (auth wired in Module 3) -----------------------------------
CREATE TABLE IF NOT EXISTS users (
  id            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name          TEXT NOT NULL,
  email         TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role          TEXT NOT NULL DEFAULT 'EMPLOYEE'
                CHECK (role IN ('SUPER_ADMIN','ADMIN','EMPLOYEE')),
  permissions   TEXT[] NOT NULL DEFAULT '{}',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sessions (
  id         TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  user_id    TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires    TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON sessions(user_id);

-- Leads (created in Module 1; canonical definition kept here) ------------------
CREATE TABLE IF NOT EXISTS leads (
  id         TEXT PRIMARY KEY DEFAULT ('lead_' || floor(extract(epoch from now()))::text || '_' || substr(md5(random()::text), 1, 6)),
  name       TEXT NOT NULL,
  phone      TEXT NOT NULL,
  email      TEXT,
  project    TEXT,
  budget     TEXT,
  message    TEXT,
  status     TEXT NOT NULL DEFAULT 'New'
             CHECK (status IN ('New','Contacted','Interested','Site Visit','Booked','Closed')),
  source     TEXT DEFAULT 'website',
  ip         TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE leads ADD COLUMN IF NOT EXISTS budget TEXT;
ALTER TABLE leads ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'website';
ALTER TABLE leads ADD COLUMN IF NOT EXISTS ip     TEXT;
-- Expand lead statuses (Module 5) — safe on fresh + existing installs.
UPDATE leads SET status = 'Contacted' WHERE status = 'Follow Up';
ALTER TABLE leads DROP CONSTRAINT IF EXISTS leads_status_check;
ALTER TABLE leads ADD CONSTRAINT leads_status_check
  CHECK (status IN ('New','Contacted','Interested','Site Visit','Booked','Closed'));
CREATE INDEX IF NOT EXISTS leads_created_at_idx ON leads (created_at DESC);
CREATE INDEX IF NOT EXISTS leads_status_idx     ON leads (status);

-- Ventures --------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS ventures (
  id            TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  slug          TEXT NOT NULL UNIQUE,
  name          TEXT NOT NULL,
  location      TEXT NOT NULL,
  city          TEXT NOT NULL DEFAULT 'Hyderabad',
  type          TEXT NOT NULL,
  status        TEXT NOT NULL DEFAULT 'ONGOING'
                CHECK (status IN ('ONGOING','UPCOMING','READY','SOLD_OUT')),
  publish_state TEXT NOT NULL DEFAULT 'PUBLISHED'
                CHECK (publish_state IN ('DRAFT','PUBLISHED')),
  featured      BOOLEAN NOT NULL DEFAULT false,
  price_label   TEXT NOT NULL DEFAULT 'Price on request',
  tagline       TEXT NOT NULL DEFAULT '',
  summary       TEXT NOT NULL DEFAULT '',
  extent        TEXT,
  plots         TEXT,
  size_range    TEXT,
  map_query     TEXT NOT NULL DEFAULT '',
  highlights    TEXT[] NOT NULL DEFAULT '{}',
  amenities     TEXT[] NOT NULL DEFAULT '{}',
  approvals     TEXT[] NOT NULL DEFAULT '{}',
  connectivity  JSONB,
  cover_image   TEXT,
  meta_title       TEXT,
  meta_description TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS ventures_status_idx   ON ventures(status);
CREATE INDEX IF NOT EXISTS ventures_featured_idx ON ventures(featured);
DROP TRIGGER IF EXISTS ventures_set_updated_at ON ventures;
CREATE TRIGGER ventures_set_updated_at BEFORE UPDATE ON ventures
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Media (gallery images + video embeds) ---------------------------------------
CREATE TABLE IF NOT EXISTS media (
  id         TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  url        TEXT NOT NULL,
  caption    TEXT,
  kind       TEXT NOT NULL DEFAULT 'image' CHECK (kind IN ('image','video')),
  category   TEXT,
  venture_id TEXT REFERENCES ventures(id) ON DELETE SET NULL,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS media_venture_id_idx ON media(venture_id);

-- Downloads -------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS download_files (
  id             TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  label          TEXT NOT NULL,
  category       TEXT NOT NULL DEFAULT 'Brochure'
                 CHECK (category IN ('Brochure','Layout','Document')),
  url            TEXT NOT NULL,
  size_bytes     INTEGER,
  download_count INTEGER NOT NULL DEFAULT 0,
  venture_id     TEXT REFERENCES ventures(id) ON DELETE SET NULL,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS download_files_venture_id_idx ON download_files(venture_id);

-- Testimonials ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS testimonials (
  id         TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  name       TEXT NOT NULL,
  location   TEXT,
  project    TEXT,
  rating     INTEGER NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
  quote      TEXT NOT NULL,
  published  BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- FAQs ------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS faqs (
  id         TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  question   TEXT NOT NULL,
  answer     TEXT NOT NULL,
  sort_order INTEGER NOT NULL DEFAULT 0
);

-- Editable per-page SEO + content blocks --------------------------------------
CREATE TABLE IF NOT EXISTS page_contents (
  id               TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  key              TEXT NOT NULL UNIQUE,
  meta_title       TEXT,
  meta_description TEXT,
  og_image         TEXT,
  blocks           JSONB,
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);
DROP TRIGGER IF EXISTS page_contents_set_updated_at ON page_contents;
CREATE TRIGGER page_contents_set_updated_at BEFORE UPDATE ON page_contents
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- Global site settings (singleton row keyed 'site') ---------------------------
CREATE TABLE IF NOT EXISTS site_settings (
  id         TEXT PRIMARY KEY DEFAULT 'site',
  data       JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
DROP TRIGGER IF EXISTS site_settings_set_updated_at ON site_settings;
CREATE TRIGGER site_settings_set_updated_at BEFORE UPDATE ON site_settings
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
