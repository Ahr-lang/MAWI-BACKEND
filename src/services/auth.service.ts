// Importamos passport y estrategias de autenticación
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import jwt from "jsonwebtoken";
// Importamos el repositorio de usuarios
import UserRepository from "../db/repositories/user.repository";
import { getSequelize } from "../db/index";

// Definimos constantes para JWT
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_jwt_key_replace_with_random_string_in_production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Función para firmar un token JWT
function signToken(payload: any): string {
  // @ts-ignore
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Configuramos la estrategia de autenticación local (login con email/password)
passport.use(
  new LocalStrategy(
    {
      usernameField: "user_email",
      passwordField: "password",
      passReqToCallback: true, // Pasamos req para acceder a sequelize
      session: false
    },
    async (req: any, email: string, password: string, done: any) => {
      try {
        // Obtenemos sequelize del req (seteado por middleware)
        const sequelize = req.sequelize;
        // Autenticamos al usuario
        const user = await UserRepository.authenticateUser(sequelize, email, password);
        if (!user) return done(null, false, { message: "Invalid credentials" });

        // Retornamos el usuario con el tenant
        return done(null, { id: user.id, username: user.username, user_email: user.user_email, tenant: req.tenant });
      } catch (err) {
        return done(err);
      }
    }
  )
);

// Opciones para la estrategia JWT
const jwtOpts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extraemos token del header
  secretOrKey: JWT_SECRET,
  passReqToCallback: true
};

// @ts-ignore
// Configuramos la estrategia JWT para verificar tokens
passport.use(
  // @ts-ignore
  new JwtStrategy(jwtOpts, async (req: any, payload: any, done: any) => {
    try {
      // Excepción para rutas de administración: usuarios del tenant "back" pueden acceder a cualquier tenant
      const isAdminRoute = req.path && req.path.includes('/admin/');
      const isBackTenantUser = payload.tenant === 'back';
      // Debug logging
      console.debug('[JWT] payload:', payload);
      console.debug('[JWT] req.path:', req.path, 'req.params.tenant:', req.params?.tenant, 'isAdminRoute:', isAdminRoute);
      console.debug('[JWT] isBackTenantUser:', isBackTenantUser);

      if (!isAdminRoute || !isBackTenantUser) {
        // Para rutas normales o usuarios no-backend, verificar que el tenant coincida
        if (!payload.tenant || payload.tenant !== req.params.tenant) {
          console.debug('[JWT] tenant mismatch - rejecting token');
          return done(null, false);
        }
      }

      // Determinar la instancia de Sequelize usada para validar el usuario.
      // Si el token pertenece al tenant 'back' (usuario admin) lo validamos contra la DB de 'back'.
      // En solicitudes normales usamos el sequelize ya adjuntado al request.
      let sequelize: any = req.sequelize;
      if (payload.tenant === 'back') {
        try {
          sequelize = getSequelize('back');
        } catch (err) {
          // si no existe la instancia de back, caemos a la instancia del req (fallback)
          sequelize = req.sequelize;
        }
      }

  // Buscamos al usuario por ID en la instancia correspondiente
  console.debug('[JWT] using sequelize for tenant:', payload.tenant === 'back' ? 'back' : req.params?.tenant);
  const user = await UserRepository.findById(sequelize, payload.id);
  console.debug('[JWT] found user:', user);
      if (!user) return done(null, false);

      // Retornamos el usuario
      return done(null, { id: user.id, username: user.username, tenant: payload.tenant });
    } catch (err) {
      return done(err, false);
    }
  })
);

// Exportamos passport y signToken
export default passport;
export { signToken };
