// Importamos Router de Express para definir rutas
const { Router } = require("express");
// Importamos el middleware useTenant para configurar la base de datos por tenant
const { useTenant } = require("../middlewares/tenant");
// Importamos las funciones del controlador de usuarios
const { ensureAuthenticated, register, login, me, logout } = require("../controllers/user.controller");

// Creamos una instancia de Router
const router = Router();

// Definimos las rutas para usuarios, todas con parámetro :tenant
// Ruta para registrar un nuevo usuario (POST /:tenant/users/register)
router.post("/:tenant/users/register", useTenant, register);
// Ruta para iniciar sesión (POST /:tenant/users/login)
router.post("/:tenant/users/login", useTenant, login);
// Ruta para obtener info del usuario autenticado (GET /:tenant/users/me) - requiere autenticación
router.get("/:tenant/users/me", useTenant, ensureAuthenticated, me);
// Ruta para cerrar sesión (POST /:tenant/users/logout) - requiere autenticación
router.post("/:tenant/users/logout", useTenant, ensureAuthenticated, logout);

// Exportamos el router para usarlo en la app principal
module.exports = router;
