"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureAuthenticated = ensureAuthenticated;
exports.register = register;
exports.login = login;
exports.me = me;
exports.logout = logout;
// Importamos passport para autenticación
const passport_1 = __importDefault(require("passport"));
// Importamos signToken de auth.service
const auth_service_js_1 = require("../../services/auth.service.js");
// Importamos UserService
const user_service_js_1 = __importDefault(require("../../services/user.service.js"));
// Función para asegurar que el usuario esté autenticado
function ensureAuthenticated(req, res, next) {
    passport_1.default.authenticate("jwt", { session: false }, (err, user) => {
        if (err)
            return res.status(401).json({ error: "Invalid token" });
        if (!user)
            return res.status(401).json({ error: "Unauthorized" });
        req.user = user;
        next();
    })(req, res, next);
}
// Función para registrar un nuevo usuario
async function register(req, res) {
    // Obtenemos la instancia de Sequelize del tenant
    const sequelize = req.sequelize;
    const { username, password } = req.body || {};
    try {
        // Llamamos al servicio para registrar el usuario
        const newUser = await user_service_js_1.default.registerUser(sequelize, username, password);
        // Respondemos con éxito
        return res.status(201).json({
            message: "User registered successfully",
            user: newUser,
            tenant: req.tenant
        });
    }
    catch (err) {
        // Manejamos errores específicos
        if (err.message === "Username and password are required") {
            return res.status(400).json({ error: err.message });
        }
        if (err.message === "Username already taken") {
            return res.status(409).json({ error: err.message });
        }
        console.error("[Register] Error:", err.message);
        return res.status(500).json({ error: "Server error during registration" });
    }
}
// Función para iniciar sesión
function login(req, res, next) {
    passport_1.default.authenticate("local", { session: false }, (err, user, info) => {
        if (err)
            return next(err);
        if (!user) {
            return res.status(401).json({ error: info?.message || "Invalid credentials" });
        }
        // Generamos el token JWT
        const token = (0, auth_service_js_1.signToken)({ id: user.id, username: user.username, tenant: user.tenant });
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
function me(req, res) {
    return res.json({
        authenticated: true,
        user: req.user,
        tenant: req.user?.tenant
    });
}
// Función para cerrar sesión
function logout(_req, res) {
    return res.json({ message: "Logged out" });
}
//# sourceMappingURL=user.controller.js.map