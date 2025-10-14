// Importamos Router de Express para definir rutas
import { Router } from "express";
// Importamos middlewares
import { protect, protectAuth } from "../middlewares/protect";
// Importamos las funciones del controlador de usuarios
import { register, login, me, logout, getUsers } from "../controllers/user.controller";

// Creamos una instancia de Router
const router = Router();

// Definimos las rutas para usuarios, todas con parámetro :tenant
// Ruta para registrar un nuevo usuario (POST /:tenant/users/register)
router.post("/:tenant/users/register", ...protect, register);
// Ruta para iniciar sesión (POST /:tenant/users/login)
router.post("/:tenant/users/login", ...protect, login);
// Ruta para obtener info del usuario autenticado (GET /:tenant/users/me) - requiere autenticación
router.get("/:tenant/users/me", ...protectAuth, me);
// Ruta para obtener todos los usuarios (GET /:tenant/users) - requiere autenticación
router.get("/:tenant/users", ...protectAuth, getUsers);
// Ruta para cerrar sesión (POST /:tenant/users/logout) - requiere autenticación
router.post("/:tenant/users/logout", ...protectAuth, logout);

// Exportamos el router para usarlo en la app principal
export default router;
