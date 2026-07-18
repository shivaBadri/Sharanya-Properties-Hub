// Create or update an admin user (bcrypt hash). Run against your DB:
//   DATABASE_URL="postgres://..." node scripts/create-admin.mjs <email> <password> [name] [role]
// role ∈ SUPER_ADMIN | ADMIN | EMPLOYEE (default SUPER_ADMIN)
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const [, , email, password, name = "Admin", role = "SUPER_ADMIN"] = process.argv;
if (!email || !password) {
  console.error("Usage: node scripts/create-admin.mjs <email> <password> [name] [role]");
  process.exit(1);
}
const cs = process.env.DATABASE_URL || process.env.POSTGRES_URL;
if (!cs) {
  console.error("Set DATABASE_URL (or POSTGRES_URL) first.");
  process.exit(1);
}

const pool = new Pool({
  connectionString: cs,
  ssl: /sslmode=require/.test(cs) ? { rejectUnauthorized: false } : undefined,
});
const hash = await bcrypt.hash(password, 10);
await pool.query(
  `INSERT INTO users (name, email, password_hash, role)
   VALUES ($1, lower($2), $3, $4)
   ON CONFLICT (email) DO UPDATE
     SET password_hash = EXCLUDED.password_hash,
         name = EXCLUDED.name,
         role = EXCLUDED.role`,
  [name, email, hash, role]
);
console.log(`✓ Admin ready: ${email} (${role})`);
await pool.end();
