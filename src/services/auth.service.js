// Importamos passport y estrategias de autenticación
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const jwt = require("jsonwebtoken");
// Importamos el repositorio de usuarios
const UserRepository = require("../db/repositories/user.repository");

// Definimos constantes para JWT
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;

// Función para firmar un token JWT
function signToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

// Configuramos la estrategia de autenticación local (login con username/password)
passport.use(
  new LocalStrategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true, // Pasamos req para acceder a sequelize
      session: false
    },
    async (req, username, password, done) => {
      try {
        // Obtenemos sequelize del req (seteado por middleware)
        const sequelize = req.sequelize;
        // Autenticamos al usuario
        const user = await UserRepository.authenticateUser(sequelize, username, password);
        if (!user) return done(null, false, { message: "Invalid credentials" });

        // Retornamos el usuario con el tenant
        return done(null, { id: user.id, username: user.username, tenant: req.tenant });
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

// Configuramos la estrategia JWT para verificar tokens
passport.use(
  new JwtStrategy(jwtOpts, async (req, payload, done) => {
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
module.exports = passport;
module.exports.signToken = signToken;
