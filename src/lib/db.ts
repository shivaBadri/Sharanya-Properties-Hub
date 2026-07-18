import { Pool } from "pg";

/**
 * Single shared connection pool.
 *
 * - Reads DATABASE_URL (also accepts POSTGRES_URL, which Vercel Postgres sets).
 * - Returns null when no connection string is configured, so the app still
 *   runs in local dev and `next build` never needs a database.
 * - Cached on globalThis to survive Next.js hot-reload without leaking pools.
 *
 * On serverless (Vercel), prefer your provider's POOLED connection string
 * (pgbouncer) to avoid exhausting connections.
 */

const connectionString =
  process.env.DATABASE_URL || process.env.POSTGRES_URL || "";

const globalForDb = globalThis as unknown as { __pgPool?: Pool | null };

function createPool(): Pool | null {
  if (!connectionString) return null;
  const needsSsl =
    /sslmode=require/.test(connectionString) ||
    process.env.NODE_ENV === "production";
  return new Pool({
    connectionString,
    max: 5,
    ssl: needsSsl ? { rejectUnauthorized: false } : undefined,
  });
}

export const pool: Pool | null =
  globalForDb.__pgPool ?? (globalForDb.__pgPool = createPool());

export const hasDatabase = pool !== null;
