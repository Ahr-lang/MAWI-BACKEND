const { Pool } = require("pg");
require("dotenv").config();

const useSSL = process.env.DB_SSL === "require" ? { rejectUnauthorized: false } : false;

const TENANTS = {
  a: { database: process.env.DB_AGROMO },
  b: { database: process.env.DB_BIOMO },
  c: { database: process.env.DB_ROBO },
  d: { database: process.env.DB_BACK },
};

const BASE_CONF = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  ssl: useSSL,
};

const pools = new Map();

function getPool(tenant) {
  const t = TENANTS[tenant];
  if (!t || !t.database) throw new Error(`Unknown tenant: ${tenant}`);

  if (!pools.has(tenant)) {
    const pool = new Pool({ ...BASE_CONF, database: t.database });
    pools.set(tenant, pool);
    console.log(`[DB] Connected pool for tenant "${tenant}" -> ${t.database}`);
  }

  return pools.get(tenant);
}

async function connectDB() {
  for (const tenant of Object.keys(TENANTS)) {
    const pool = getPool(tenant);
    await pool.query("SELECT 1");
  }
  console.log("[DB] All tenant connections successful");
}

module.exports = { getPool, connectDB, TENANTS };
