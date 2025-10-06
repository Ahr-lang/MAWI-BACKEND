// Importamos bcrypt para verificar contraseñas
import bcrypt from "bcryptjs";

// Clase UserRepository para manejar operaciones de base de datos para usuarios
export default class UserRepository {
  // Método para encontrar un usuario por ID
  static async findById(sequelize: any, id: number) {
    const User = sequelize.models.User;
    const user = await User.findByPk(id);
    return user ? { id: user.id, username: user.username } : null;
  }

  // Método para encontrar un usuario por nombre de usuario
  static async findByUsername(sequelize: any, username: string) {
    const User = sequelize.models.User;
    const user = await User.findOne({ where: { username: username.toLowerCase() } });
    return user ? { id: user.id, username: user.username, password_hash: user.password_hash } : null;
  }

  // Método para autenticar un usuario (verificar nombre de usuario y contraseña)
  static async authenticateUser(sequelize: any, username: string, password: string) {
    const user = await this.findByUsername(sequelize, username);
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) return null;

    return { id: user.id, username: user.username };
  }

  // Método para crear un nuevo usuario
  static async createUser(sequelize: any, username: string, passwordHash: string) {
    const User = sequelize.models.User;
    const user = await User.create({ username, password_hash: passwordHash });
    return { id: user.id, username: user.username };
  }
}