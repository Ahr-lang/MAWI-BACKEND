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

// Función para obtener un pool de conexiones para un tenant
function getPool(tenant: string): Pool {
  const t = TENANTS[tenant];
  if (!t || !t.database) throw new Error(`Unknown tenant: ${tenant}`);

  if (!pools.has(tenant)) {
    const pool = new Pool({ ...BASE_CONF, database: t.database });
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
  for (const tenant of Object.keys(TENANTS)) {
    const pool = getPool(tenant);
    await pool.query("SELECT 1");

    const sequelize = getSequelize(tenant);
    await sequelize.authenticate();
  }
  console.log("[DB] All tenant connections successful");
}

// Exportamos las funciones y constantes
export { getPool, getSequelize, connectDB, TENANTS };
