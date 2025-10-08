// Importamos Pool de pg para conexiones directas y Sequelize para ORM
import { Pool } from 'pg';
import { Sequelize } from 'sequelize';
import defineUserModel from './models/user.model';
import * as dotenv from 'dotenv';

dotenv.config();

// Configuramos SSL si es requerido
const useSSL = process.env.DB_SSL === "require" ? { rejectUnauthorized: false } : false;

// Definimos los tenants (bases de datos por inquilino)
const TENANTS: Record<string, { database: string }> = {
  agromo: { database: process.env.DB_AGROMO || 'agromo' },
  biomo: { database: process.env.DB_BIOMO || 'biomo' },
  robo: { database: process.env.DB_ROBO || 'robo' },
  back: { database: process.env.DB_BACK || 'back' },
};

// Configuración base para todas las conexiones
const BASE_CONF = {
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || 'password',
  ssl: useSSL,
};

// Mapas para almacenar pools y instancias de Sequelize por tenant
const pools = new Map();
const sequels = new Map();

// Utility: sleep for ms
function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Función para obtener un pool de conexiones para un tenant
function getPool(tenant: string): Pool {
  const t = TENANTS[tenant];
  if (!t || !t.database) throw new Error(`Unknown tenant: ${tenant}`);

  if (!pools.has(tenant)) {
  // Increase acquire timeout and allow a few more connections for busy workloads
  // Note: keep this conservative relative to your Postgres max_connections
  const pool = new Pool({ ...BASE_CONF, database: t.database, max: 10, idleTimeoutMillis: 10000, connectionTimeoutMillis: 120000 });
    pools.set(tenant, pool);
    console.log(`[DB] Connected pool for tenant "${tenant}" -> ${t.database}`);
  }

  return pools.get(tenant);
}

// Función para obtener una instancia de Sequelize para un tenant
function getSequelize(tenant: string): Sequelize {
  const t = TENANTS[tenant];
  if (!t || !t.database) throw new Error(`Unknown tenant: ${tenant}`);

  if (!sequels.has(tenant)) {
    const sequelize = new Sequelize(t.database, BASE_CONF.user, BASE_CONF.password, {
      host: BASE_CONF.host,
      port: BASE_CONF.port,
      dialect: 'postgres',
      ssl: BASE_CONF.ssl as any,
      logging: false,
      pool: {
  max: 10,
  min: 0,
  acquire: 120000, // increase acquire timeout to 2 minutes
  idle: 10000
      },
      dialectOptions: {
        statement_timeout: 60000,
        idle_in_transaction_session_timeout: 60000
      }
    });

    // Definimos los modelos en la instancia de Sequelize
    defineUserModel(sequelize);

    sequels.set(tenant, sequelize);
    console.log(`[DB] Connected Sequelize for tenant "${tenant}" -> ${t.database}`);
  }

  return sequels.get(tenant);
}

// Función para conectar a todas las bases de datos de tenants
async function connectDB() {
  // Try connecting to each tenant with retries and backoff to handle transient network issues
  for (const tenant of Object.keys(TENANTS)) {
    const maxAttempts = 5;
    let attempt = 0;
    let connected = false;

    while (attempt < maxAttempts && !connected) {
      attempt += 1;
      try {
        const pool = getPool(tenant);
        console.log(`[DB] Testing connection for tenant "${tenant}" (attempt ${attempt}/${maxAttempts})`);
        // Use pool.query which will throw if it cannot acquire a connection
        await pool.query("SELECT 1");
        console.log(`[DB] Connection test successful for tenant "${tenant}"`);

        const sequelize = getSequelize(tenant);
        await sequelize.authenticate();

        try {
          await sequelize.sync(); // Create tables if they don't exist
          await sequelize.sync({ alter: true }); // Then alter to match models
        } catch (syncErr) {
          console.warn(`[DB] Warning: sequelize.sync altered failed for tenant "${tenant}":`, (syncErr as Error).message);
          // Fallback: just sync without alter
          try {
            await sequelize.sync();
          } catch (innerErr) {
            console.error(`[DB] Error: sequelize.sync fallback failed for tenant "${tenant}":`, (innerErr as Error).message);
            throw innerErr;
          }
        }

        connected = true;
      } catch (err) {
        console.error(`[DB] Error connecting to tenant "${tenant}" on attempt ${attempt}:`, (err as Error).message);
        if (attempt < maxAttempts) {
          const backoff = 1000 * Math.pow(2, attempt); // exponential backoff
          console.log(`[DB] Retrying tenant "${tenant}" in ${backoff}ms`);
          // wait before retrying
          // eslint-disable-next-line no-await-in-loop
          await sleep(backoff);
        } else {
          console.error(`[DB] Giving up connecting to tenant "${tenant}" after ${maxAttempts} attempts`);
        }
      }
    }
  }
  console.log("[DB] Tenant connection attempts completed");
}

// Exportamos las funciones y constantes
export { getPool, getSequelize, connectDB, TENANTS };
