"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import UserRepository from '../db/repositories/user.repository.js';mportamos bcrypt para hashear contraseñas
const bcrypt_1 = __importDefault(require("bcrypt"));
// Importamos el repositorio de usuarios
const user_repository_1 = __importDefault(require("../db/repositories/user.repository"));
// Clase UserService para lógica de negocio de usuarios
class UserService {
    // Método para registrar un nuevo usuario
    static async registerUser(sequelize, username, password) {
        // Validamos que username y password estén presentes
        if (!username || !password) {
            throw new Error("Username and password are required");
        }
        // Verificamos si el usuario ya existe
        const existingUser = await user_repository_1.default.findByUsername(sequelize, username);
        if (existingUser) {
            throw new Error("Username already taken");
        }
        // Hasheamos la contraseña
        const passwordHash = await bcrypt_1.default.hash(password, 12);
        // Creamos el usuario en la base de datos
        const newUser = await user_repository_1.default.createUser(sequelize, username, passwordHash);
        return newUser;
    }
}
exports.default = UserService;
// Exportamos la clase
module.exports = UserService;
//# sourceMappingURL=user.service.js.map