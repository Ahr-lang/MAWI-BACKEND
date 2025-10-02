"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signToken = signToken;
// Importamos passport y estrategias de autenticación
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const passport_jwt_1 = require("passport-jwt");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Importamos el repositorio de usuarios
const user_repository_js_1 = __importDefault(require("../db/repositories/user.repository.js"));
// Definimos constantes para JWT
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
// Función para firmar un token JWT
function signToken(payload) {
    // @ts-ignore
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}
// Configuramos la estrategia de autenticación local (login con username/password)
passport_1.default.use(new passport_local_1.Strategy({
    usernameField: "username",
    passwordField: "password",
    passReqToCallback: true, // Pasamos req para acceder a sequelize
    session: false
}, async (req, username, password, done) => {
    try {
        // Obtenemos sequelize del req (seteado por middleware)
        const sequelize = req.sequelize;
        // Autenticamos al usuario
        const user = await user_repository_js_1.default.authenticateUser(sequelize, username, password);
        if (!user)
            return done(null, false, { message: "Invalid credentials" });
        // Retornamos el usuario con el tenant
        return done(null, { id: user.id, username: user.username, tenant: req.tenant });
    }
    catch (err) {
        return done(err);
    }
}));
// Opciones para la estrategia JWT
const jwtOpts = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(), // Extraemos token del header
    secretOrKey: JWT_SECRET,
    passReqToCallback: true
};
// @ts-ignore
// Configuramos la estrategia JWT para verificar tokens
passport_1.default.use(
// @ts-ignore
new passport_jwt_1.Strategy(jwtOpts, async (req, payload, done) => {
    try {
        // Verificamos que el tenant del token coincida con el de la ruta
        if (!payload.tenant || payload.tenant !== req.params.tenant) {
            return done(null, false);
        }
        // Obtenemos sequelize del req
        const sequelize = req.sequelize;
        // Buscamos al usuario por ID
        const user = await user_repository_js_1.default.findById(sequelize, payload.id);
        if (!user)
            return done(null, false);
        // Retornamos el usuario
        return done(null, { id: user.id, username: user.username, tenant: payload.tenant });
    }
    catch (err) {
        return done(err, false);
    }
}));
// Exportamos passport y signToken
exports.default = passport_1.default;
//# sourceMappingURL=auth.service.js.map