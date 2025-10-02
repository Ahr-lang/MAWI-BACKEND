"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTenant = useTenant;
// Importamos funciones de db/index.js
const index_1 = require("../../db/index");
// Middleware para configurar el tenant (base de datos) basado en la ruta
function useTenant(req, res, next) {
    // Obtenemos el tenant de los parámetros de la ruta
    const { tenant } = req.params;
    // Verificamos si el tenant es válido
    if (!tenant || !index_1.TENANTS[tenant]) {
        return res.status(400).json({ error: "Invalid tenant." });
    }
    try {
        // Asignamos el tenant a la request
        req.tenant = tenant;
        // Obtenemos el pool de conexiones para el tenant
        req.db = (0, index_1.getPool)(tenant);
        // Obtenemos la instancia de Sequelize para el tenant
        req.sequelize = (0, index_1.getSequelize)(tenant);
        // Pasamos al siguiente middleware
        next();
    }
    catch (err) {
        console.error("[Tenant] Error setting DB:", err.message);
        res.status(500).json({ error: "Failed to connect to tenant database" });
    }
}
//# sourceMappingURL=tenant.js.map