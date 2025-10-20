// src/api/routes/admin.routes.ts
import { Router } from "express";
import { getAllUsers, getUsersWithForms, getUserForms, getUserByEmail, createUserAdmin, getTopUsersByFormType, getTenantErrors, deleteUserAdmin, getStatusPageData } from "../controllers/admin.controller";
import { protectAuth } from "../middlewares/protect";
import { ensureBackendUser } from "../middlewares/common/backendAuth";

const router = Router();

// Todas las rutas admin requieren autenticación + ser usuario backend
const adminAuth = [...protectAuth, ensureBackendUser];

// Ruta para obtener todos los usuarios con información completa (GET /:tenant/admin/users)
router.get("/:tenant/admin/users", ...adminAuth, getAllUsers);

// Ruta para obtener todos los usuarios con conteo de formularios (GET /:tenant/admin/users/forms)
router.get("/:tenant/admin/users/forms", ...adminAuth, getUsersWithForms);

// Ruta para obtener todos los formularios de un usuario específico (GET /:tenant/admin/users/:userId/forms)
router.get("/:tenant/admin/users/:userId/forms", ...adminAuth, getUserForms);

// Ruta para obtener un usuario por email/identifier y su actividad completa (GET /:tenant/admin/users/email/:email)
router.get("/:tenant/admin/users/email/:email", ...adminAuth, getUserByEmail);

// Crear usuario en tenant (admin)
router.post("/:tenant/admin/users", ...adminAuth, createUserAdmin);
// Eliminar usuario por ID (DELETE /:tenant/admin/users/:userId)
router.delete("/:tenant/admin/users/:userId", ...adminAuth, deleteUserAdmin);

// Ruta para obtener el usuario con más formularios de cada tipo (GET /:tenant/admin/users/top-by-form-type)
router.get("/:tenant/admin/users/top-by-form-type", ...adminAuth, getTopUsersByFormType);

// Ruta para obtener errores por tenant (GET /:tenant/admin/errors)
router.get("/:tenant/admin/errors", ...adminAuth, getTenantErrors);

// Ruta para obtener datos de página de estado (GET /:tenant/admin/status)
router.get("/:tenant/admin/status", ...adminAuth, getStatusPageData);

export default router;