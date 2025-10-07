// Importamos passport y estrategias de autenticación
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import jwt from "jsonwebtoken";
// Importamos el repositorio de usuarios
import UserRepository from "../db/repositories/user.repository";

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
      // Verificamos que el tenant del token coincida con el de la ruta
      if (!payload.tenant || payload.tenant !== req.params.tenant) {
        return done(null, false);
      }

      // Obtenemos sequelize del req
      const sequelize = req.sequelize;
      // Buscamos al usuario por ID
      const user = await UserRepository.findById(sequelize, payload.id);
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
