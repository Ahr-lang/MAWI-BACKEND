// src/api/middlewares/common/backendAuth.ts
import { Request, Response, NextFunction } from 'express';

// Middleware para verificar que el usuario sea del tenant "back" (usuario backend)
// Los usuarios del tenant "back" pueden acceder a datos de cualquier tenant
export function ensureBackendUser(req: any, res: Response, next: NextFunction) {
  const user = req.user;
  const tenant = req.tenant;

  if (!user) {
    return res.status(401).json({ error: "Authentication required" });
  }

  // Verificar si el usuario pertenece al tenant "back" (usuario backend)
  // Los usuarios del tenant "back" tienen acceso administrativo a todos los tenants
  const isBackendUser = user.tenant === 'back';

  if (!isBackendUser) {
    return res.status(403).json({
      error: "Access denied. This endpoint is only accessible to backend tenant users.",
      message: "Esta funcionalidad solo está disponible para usuarios del tenant backend"
    });
  }

  next();
}