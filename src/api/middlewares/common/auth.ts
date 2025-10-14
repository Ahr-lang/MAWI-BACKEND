// src/api/middlewares/auth.ts
import passport from "passport";

// Middleware para asegurar que el usuario esté autenticado
export function ensureAuthenticated(req: any, res: any, next: any) {
  passport.authenticate("jwt", { session: false }, (err: any, user: any) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    req.user = user;
    next();
  })(req, res, next);
}