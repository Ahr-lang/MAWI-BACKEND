// Importamos Router de Express para definir rutas
import { Router } from "express";
// Importamos middlewares
import { useTenant } from "../middlewares/tenant";
import verifyApiKey from "../middlewares/verifyApiKey";
import tenantRateLimit from "../middlewares/rateLimit";
import { validateRequest } from "../middlewares/validation";
// Importamos las funciones del controlador de usuarios
import { ensureAuthenticated, register, login, me, logout } from "../controllers/user.controller";
// Importamos las funciones del controlador de formularios
import { createSubmission } from "../controllers/form.controller"
// Creamos una instancia de Router
const router = Router();

// Definimos las rutas para usuarios, todas con parámetro :tenant
// Ruta para registrar un nuevo usuario (POST /:tenant/users/register)
router.post("/:tenant/users/register", verifyApiKey, tenantRateLimit, useTenant, validateRequest, register);
// Ruta para iniciar sesión (POST /:tenant/users/login)
router.post("/:tenant/users/login", verifyApiKey, tenantRateLimit, useTenant, validateRequest, login);
// Ruta para obtener info del usuario autenticado (GET /:tenant/users/me) - requiere autenticación
router.get("/:tenant/users/me", verifyApiKey, tenantRateLimit, useTenant, ensureAuthenticated, me);
// Ruta para cerrar sesión (POST /:tenant/users/logout) - requiere autenticación
router.post("/:tenant/users/logout", verifyApiKey, tenantRateLimit, useTenant, ensureAuthenticated, logout);

// Exportamos el router para usarlo en la app principal
export default router;
