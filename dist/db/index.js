"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TENANTS = void 0;
exports.getPool = getPool;
exports.getSequelize = getSequelize;
exports.connectDB = connectDB;
// Importamos Pool de pg para conexiones directas y Sequelize para ORM
const pg_1 = require("pg");
const sequelize_1 = require("sequelize");
const user_model_js_1 = __importDefault(require("./models/user.model.js"));
const dotenv = __importStar(require("dotenv"));
dotenv.config();
// Configuramos SSL si es requerido
const useSSL = process.env.DB_SSL === "require" ? { rejectUnauthorized: false } : false;
// Definimos los tenants (bases de datos por inquilino)
const TENANTS = {
    agromo: { database: process.env.DB_AGROMO || 'agromo' },
    biomo: { database: process.env.DB_BIOMO || 'biomo' },
    robo: { database: process.env.DB_ROBO || 'robo' },
    back: { database: process.env.DB_BACK || 'back' },
};
exports.TENANTS = TENANTS;
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
function getPool(tenant) {
    const t = TENANTS[tenant];
    if (!t || !t.database)
        throw new Error(`Unknown tenant: ${tenant}`);
    if (!pools.has(tenant)) {
        const pool = new pg_1.Pool({ ...BASE_CONF, database: t.database });
        pools.set(tenant, pool);
        console.log(`[DB] Connected pool for tenant "${tenant}" -> ${t.database}`);
    }
    return pools.get(tenant);
}
// Función para obtener una instancia de Sequelize para un tenant
function getSequelize(tenant) {
    const t = TENANTS[tenant];
    if (!t || !t.database)
        throw new Error(`Unknown tenant: ${tenant}`);
    if (!sequels.has(tenant)) {
        const sequelize = new sequelize_1.Sequelize(t.database, BASE_CONF.user, BASE_CONF.password, {
            host: BASE_CONF.host,
            port: BASE_CONF.port,
            dialect: 'postgres',
            ssl: BASE_CONF.ssl,
            logging: false,
        });
        // Definimos los modelos en la instancia de Sequelize
        (0, user_model_js_1.default)(sequelize);
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
//# sourceMappingURL=index.js.map