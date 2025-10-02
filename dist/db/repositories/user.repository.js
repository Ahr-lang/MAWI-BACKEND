"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Importamos bcrypt para verificar contraseñas
const bcrypt_1 = __importDefault(require("bcrypt"));
// Clase UserRepository para manejar operaciones de base de datos para usuarios
class UserRepository {
    // Método para encontrar un usuario por ID
    static async findById(sequelize, id) {
        const User = sequelize.models.User;
        const user = await User.findByPk(id);
        return user ? { id: user.id, username: user.username } : null;
    }
    // Método para encontrar un usuario por nombre de usuario
    static async findByUsername(sequelize, username) {
        const User = sequelize.models.User;
        const user = await User.findOne({ where: { username: username.toLowerCase() } });
        return user ? { id: user.id, username: user.username, password_hash: user.password_hash } : null;
    }
    // Método para autenticar un usuario (verificar nombre de usuario y contraseña)
    static async authenticateUser(sequelize, username, password) {
        const user = await this.findByUsername(sequelize, username);
        if (!user)
            return null;
        const isValid = await bcrypt_1.default.compare(password, user.password_hash);
        if (!isValid)
            return null;
        return { id: user.id, username: user.username };
    }
    // Método para crear un nuevo usuario
    static async createUser(sequelize, username, passwordHash) {
        const User = sequelize.models.User;
        const user = await User.create({ username, password_hash: passwordHash });
        return { id: user.id, username: user.username };
    }
}
exports.default = UserRepository;
//# sourceMappingURL=user.repository.js.map