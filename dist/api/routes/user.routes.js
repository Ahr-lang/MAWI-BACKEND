"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Importamos Router de Express para definir rutas
const express_1 = require("express");
// Importamos middlewares
const tenant_1 = require("../middlewares/tenant");
const verifyApiKey_1 = __importDefault(require("../middlewares/verifyApiKey"));
const rateLimit_1 = __importDefault(require("../middlewares/rateLimit"));
// Importamos las funciones del controlador de usuarios
const user_controller_1 = require("../controllers/user.controller");
// Creamos una instancia de Router
const router = (0, express_1.Router)();
// Definimos las rutas para usuarios, todas con parámetro :tenant
// Ruta para registrar un nuevo usuario (POST /:tenant/users/register)
router.post("/:tenant/users/register", verifyApiKey_1.default, rateLimit_1.default, tenant_1.useTenant, user_controller_1.register);
// Ruta para iniciar sesión (POST /:tenant/users/login)
router.post("/:tenant/users/login", verifyApiKey_1.default, rateLimit_1.default, tenant_1.useTenant, user_controller_1.login);
// Ruta para obtener info del usuario autenticado (GET /:tenant/users/me) - requiere autenticación
router.get("/:tenant/users/me", verifyApiKey_1.default, rateLimit_1.default, tenant_1.useTenant, user_controller_1.ensureAuthenticated, user_controller_1.me);
// Ruta para cerrar sesión (POST /:tenant/users/logout) - requiere autenticación
router.post("/:tenant/users/logout", verifyApiKey_1.default, rateLimit_1.default, tenant_1.useTenant, user_controller_1.ensureAuthenticated, user_controller_1.logout);
// Exportamos el router para usarlo en la app principal
exports.default = router;
//# sourceMappingURL=user.routes.js.map