// Importamos Pool de pg para conexiones directas y Sequelize para ORM
const { Pool } = require("pg");
const { Sequelize } = require("sequelize");
const defineUserModel = require("./models/user.model");

require("dotenv").config();

// Configuramos SSL si es requerido
const useSSL = process.env.DB_SSL === "require" ? { rejectUnauthorized: false } : false;

// Definimos los tenants (bases de datos por inquilino)
const TENANTS = {
  agromo: { database: process.env.DB_AGROMO },
  biomo: { database: process.env.DB_BIOMO },
  robo: { database: process.env.DB_ROBO },
  back: { database: process.env.DB_BACK },
};

// Configuración base para todas las conexiones
const BASE_CONF = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  ssl: useSSL,
};

// Mapas para almacenar pools y instancias de Sequelize por tenant
const pools = new Map();
const sequels = new Map();

// Función para obtener un pool de conexiones para un tenant
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

// Función para obtener una instancia de Sequelize para un tenant
function getSequelize(tenant) {
  const t = TENANTS[tenant];
  if (!t || !t.database) throw new Error(`Unknown tenant: ${tenant}`);

  if (!sequels.has(tenant)) {
    const sequelize = new Sequelize(t.database, BASE_CONF.user, BASE_CONF.password, {
      host: BASE_CONF.host,
      port: BASE_CONF.port,
      dialect: 'postgres',
      ssl: BASE_CONF.ssl,
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
module.exports = { getPool, getSequelize, connectDB, TENANTS };
