// Importamos passport para autenticación
import passport from "passport";
// Importamos signToken de auth.service
import { signToken } from "../../services/auth.service";
// Importamos UserService
import UserService from "../../services/user.service";

// Función para asegurar que el usuario esté autenticado
function ensureAuthenticated(req: any, res: any, next: any) {
  passport.authenticate("jwt", { session: false }, (err: any, user: any) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    if (!user) return res.status(401).json({ error: "Unauthorized" });
    req.user = user;
    next();
  })(req, res, next);
}

// Función para registrar un nuevo usuario
async function register(req: any, res: any) {
  // Obtenemos la instancia de Sequelize del tenant
  const sequelize = req.sequelize;
  const { username, password, user_email } = req.body || {};

  try {
    // Llamamos al servicio para registrar el usuario
    const newUser = await UserService.registerUser(sequelize, username, password, user_email);

    // Respondemos con éxito
    return res.status(201).json({
      message: "User registered successfully",
      user: newUser,
      tenant: req.tenant
    });
  } catch (err: any) {
    // Manejamos errores específicos
    if (err.message === "Username and password are required") {
      return res.status(400).json({ error: err.message });
    }
    if (err.message === "Username already taken") {
      return res.status(409).json({ error: err.message });
    }
    console.error("[Register] Error:", err);
    return res.status(500).json({ error: "Server error during registration" });
  }
}

// Función para iniciar sesión
function login(req: any, res: any, next: any) {
  passport.authenticate("local", { session: false }, (err: any, user: any, info: any) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ error: info?.message || "Invalid credentials" });
    }

    // Generamos el token JWT
    const token = signToken({ id: user.id, username: user.username, tenant: user.tenant });
    return res.json({
      message: "Login successful",
      user,
      token,
      token_type: "Bearer",
      expires_in: process.env.JWT_EXPIRES_IN
    });
  })(req, res, next);
}

// Función para obtener información del usuario autenticado
function me(req: any, res: any) {
  return res.json({
    authenticated: true,
    user: req.user,
    tenant: req.user?.tenant
  });
}

// Función para cerrar sesión
function logout(_req: any, res: any) {
  return res.json({ message: "Logged out" });
}

// Exportamos las funciones
export { ensureAuthenticated, register, login, me, logout };
