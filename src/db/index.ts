import { Pool } from 'pg';
import { Sequelize } from 'sequelize';
import defineUserModel from './models/user.model';
import { registerFormsForTenant } from './utils/register-forms';
import * as dotenv from 'dotenv';

dotenv.config();

const useSSL = process.env.DB_SSL === "require" ? { rejectUnauthorized: false } : false;

const TENANTS: Record<string, { database: string }> = {
  agromo: { database: process.env.DB_AGROMO! },
  biomo:  { database: process.env.DB_BIOMO! },
  robo:   { database: process.env.DB_ROBO! },
  back:   { database: process.env.DB_BACK! },
};

const BASE_CONF = {
  host: process.env.DB_HOST!,
  port: Number(process.env.DB_PORT)!,
  user: process.env.DB_USER!,
  password: process.env.DB_PASS!,
  ssl: useSSL,
};

const pools = new Map<string, Pool>();
const sequels = new Map<string, Sequelize>();

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)); }

function getPool(tenant: string): Pool {
  const t = TENANTS[tenant];
  if (!t?.database) throw new Error(`Unknown tenant: ${tenant}`);

  if (!pools.has(tenant)) {
    const pool = new Pool({
      ...BASE_CONF,
      database: t.database,
      max: 10,
      idleTimeoutMillis: 10000,
      connectionTimeoutMillis: 120000
    });
    pools.set(tenant, pool);
    console.log(`[DB] Connected pool for tenant "${tenant}" -> ${t.database}`);
  }
  return pools.get(tenant)!;
}

function getSequelize(tenant: string): Sequelize {
  const t = TENANTS[tenant];
  if (!t?.database) throw new Error(`Unknown tenant: ${tenant}`);

  if (!sequels.has(tenant)) {
    const sequelize = new Sequelize(t.database, BASE_CONF.user, BASE_CONF.password, {
      host: BASE_CONF.host,
      port: BASE_CONF.port,
      dialect: 'postgres',
      ssl: BASE_CONF.ssl as any,
      logging: false,
      pool: { max: 10, min: 0, acquire: 120000, idle: 10000 },
      dialectOptions: {
        statement_timeout: 60000,
        idle_in_transaction_session_timeout: 60000
      }
    });

    // Modelos base
    defineUserModel(sequelize);
    registerFormsForTenant(tenant, sequelize);

    sequels.set(tenant, sequelize);
    console.log(`[DB] Connected Sequelize for tenant "${tenant}" -> ${t.database}`);
  }
  return sequels.get(tenant)!;
}

async function connectDB() {
  for (const tenant of Object.keys(TENANTS)) {
    const maxAttempts = 5;
    let attempt = 0, connected = false;

    while (attempt < maxAttempts && !connected) {
      attempt += 1;
      try {
        const pool = getPool(tenant);
        console.log(`[DB] Testing connection for tenant "${tenant}" (attempt ${attempt}/${maxAttempts})`);
        await pool.query("SELECT 1");
        console.log(`[DB] Connection test successful for tenant "${tenant}"`);

        const sequelize = getSequelize(tenant);
        await sequelize.authenticate();

        // await sequelize.sync(); // Disabled to prevent automatic schema changes

        connected = true;
      } catch (err) {
        console.error(`[DB] Error connecting to tenant "${tenant}" on attempt ${attempt}:`, (err as Error).message);
        if (attempt < maxAttempts) {
          const backoff = 1000 * Math.pow(2, attempt);
          console.log(`[DB] Retrying tenant "${tenant}" in ${backoff}ms`);
          await sleep(backoff);
        } else {
          console.error(`[DB] Giving up connecting to tenant "${tenant}" after ${maxAttempts} attempts`);
        }
      }
    }
  }
  console.log("[DB] Tenant connection attempts completed");
}

export { getPool, getSequelize, connectDB, TENANTS };
