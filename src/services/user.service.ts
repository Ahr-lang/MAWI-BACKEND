// Importamos bcrypt para hashear contraseñas
import bcrypt from "bcryptjs";
// Importamos el repositorio de usuarios
import UserRepository from "../db/repositories/user.repository";

// Clase UserService para lógica de negocio de usuarios
export default class UserService {
  // Método para registrar un nuevo usuario
  static async registerUser(sequelize: any, username: string, password: string, user_email?: string) {
    // Validamos que username y password estén presentes
    if (!username || !password) {
      throw new Error("Username and password are required");
    }

    // Verificamos si el usuario ya existe
    const existingUser = await UserRepository.findByUsername(sequelize, username);
    if (existingUser) {
      throw new Error("Username already taken");
    }

    // Hasheamos la contraseña
    const passwordHash = await bcrypt.hash(password, 12);

    // Creamos el usuario en la base de datos
    const newUser = await UserRepository.createUser(sequelize, username, passwordHash, user_email);
    return newUser;
  }

  // Método para obtener todos los usuarios de un tenant
  static async getAllUsers(sequelize: any) {
    return await UserRepository.getAllUsers(sequelize);
  }

  // Método para obtener todos los usuarios con conteo de formularios
  static async getUsersWithFormCounts(sequelize: any, tenant: string) {
    return await UserRepository.getUsersWithFormCounts(sequelize, tenant);
  }

  // Obtener un usuario por identificador (username o email)
  static async getUserByIdentifier(sequelize: any, identifier: string) {
    return await UserRepository.findByUsername(sequelize, identifier);
  }

  // Buscar usuario por email en un tenant
  static async findUserByEmail(sequelize: any, email: string) {
    return await UserRepository.findByEmail(sequelize, email);
  }
}