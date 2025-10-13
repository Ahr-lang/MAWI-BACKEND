// Importamos passport para autenticación
import passport from "passport";
// Importamos signToken de auth.service
import { signToken } from "../../services/auth.service";
// Importamos UserService
import UserService from "../../services/user.service";
import { trace, SpanStatusCode } from '@opentelemetry/api';

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
  const span = trace.getActiveSpan();
  span?.setAttribute('operation', 'user.register');
  span?.setAttribute('tenant', req.tenant);
  span?.setAttribute('username', req.body?.username);

  // Obtenemos la instancia de Sequelize del tenant
  const sequelize = req.sequelize;
  const { username, password, user_email } = req.body || {};

  try {
    span?.addEvent('Iniciando registro de usuario');
    
    // Llamamos al servicio para registrar el usuario
    const newUser = await UserService.registerUser(sequelize, username, password, user_email);

    span?.setAttribute('user.id', newUser.id);
    span?.addEvent('Usuario registrado exitosamente');

    // Respondemos con éxito
    return res.status(201).json({
      message: "User registered successfully",
      user: newUser,
      tenant: req.tenant
    });
  } catch (err: any) {
    span?.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
    span?.recordException(err);
    
    // Manejamos errores específicos
    if (err.message === "Username and password are required") {
      span?.addEvent('Error de validación: campos requeridos faltantes');
      return res.status(400).json({ error: err.message });
    }
    if (err.message === "Username already taken") {
      span?.addEvent('Error: nombre de usuario ya existe');
      return res.status(409).json({ error: err.message });
    }
    // Detect Sequelize connection acquire timeout and return 503
    if (err.name && err.name === 'SequelizeConnectionAcquireTimeoutError') {
      span?.addEvent('Error de base de datos: pool agotado');
      console.error('[Register] DB pool exhausted:', err);
      return res.status(503).json({ error: 'Service unavailable - database busy, try again later' });
    }
    span?.addEvent('Error interno del servidor');
    console.error("[Register] Error:", err);
    return res.status(500).json({ error: "Server error during registration" });
  }
}

// Función para iniciar sesión
function login(req: any, res: any, next: any) {
  const span = trace.getActiveSpan();
  span?.setAttribute('operation', 'user.login');
  span?.setAttribute('tenant', req.tenant);
  span?.setAttribute('user_email', req.body?.user_email);

  passport.authenticate("local", { session: false }, (err: any, user: any, info: any) => {
    if (err) {
      span?.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
      span?.recordException(err);
      return next(err);
    }
    
    if (!user) {
      span?.setAttribute('auth.failed', true);
      span?.addEvent('Credenciales inválidas');
      return res.status(401).json({ error: info?.message || "Invalid credentials" });
    }

    span?.setAttribute('auth.success', true);
    span?.setAttribute('user.id', user.id);
    span?.setAttribute('user.username', user.username);
    span?.addEvent('Login exitoso');

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

// Función para obtener todos los usuarios de un tenant
async function getUsers(req: any, res: any) {
  const span = trace.getActiveSpan();
  span?.setAttribute('operation', 'user.getUsers');
  span?.setAttribute('tenant', req.tenant);

  // Obtenemos la instancia de Sequelize del tenant
  const sequelize = req.sequelize;

  try {
    span?.addEvent('Obteniendo lista de usuarios');
    
    // Llamamos al servicio para obtener todos los usuarios
    const users = await UserService.getAllUsers(sequelize);

    span?.setAttribute('users.count', users.length);
    span?.addEvent('Lista de usuarios obtenida exitosamente');

    // Respondemos con los usuarios
    return res.status(200).json({
      users,
      tenant: req.tenant,
      count: users.length
    });
  } catch (err: any) {
    span?.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
    span?.recordException(err);
    
    span?.addEvent('Error obteniendo usuarios');
    console.error("[GetUsers] Error:", err);
    return res.status(500).json({ error: "Server error getting users" });
  }
}

// Exportamos las funciones
export { ensureAuthenticated, register, login, me, logout, getUsers };
