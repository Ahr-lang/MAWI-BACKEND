// Importamos Router de Express para definir rutas
const { Router } = require("express");
// Importamos middlewares
const { useTenant } = require("../middlewares/tenant");
const verifyApiKey = require("../middlewares/verifyApiKey");
const tenantRateLimit = require("../middlewares/rateLimit");
// Importamos las funciones del controlador de usuarios
const { ensureAuthenticated, register, login, me, logout } = require("../controllers/user.controller");

// Creamos una instancia de Router
const router = Router();

// Definimos las rutas para usuarios, todas con parámetro :tenant
// Ruta para registrar un nuevo usuario (POST /:tenant/users/register)
router.post("/:tenant/users/register", verifyApiKey, tenantRateLimit, useTenant, register);
// Ruta para iniciar sesión (POST /:tenant/users/login)
router.post("/:tenant/users/login", verifyApiKey, tenantRateLimit, useTenant, login);
// Ruta para obtener info del usuario autenticado (GET /:tenant/users/me) - requiere autenticación
router.get("/:tenant/users/me", verifyApiKey, tenantRateLimit, useTenant, ensureAuthenticated, me);
// Ruta para cerrar sesión (POST /:tenant/users/logout) - requiere autenticación
router.post("/:tenant/users/logout", verifyApiKey, tenantRateLimit, useTenant, ensureAuthenticated, logout);

// Exportamos el router para usarlo en la app principal
module.exports = router;
