// src/api/routes/admin.routes.ts
import { Router } from "express";
import { getAllUsers, getUsersWithForms, getUserForms, getUserByEmail, createUserAdmin, getTopUsersByFormType } from "../controllers/admin.controller";
import { protectAuth } from "../middlewares/protect";
import { ensureBackendUser } from "../middlewares/common/backendAuth";
import { deleteUserAdmin } from "../controllers/admin.controller"

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

export default router;