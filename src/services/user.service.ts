// Importamos bcrypt para hashear contraseñas
import bcrypt from "bcrypt";
// Importamos el repositorio de usuarios
import UserRepository from "../db/repositories/user.repository.js";

// Clase UserService para lógica de negocio de usuarios
export default class UserService {
  // Método para registrar un nuevo usuario
  static async registerUser(sequelize: any, username: string, password: string) {
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
    const newUser = await UserRepository.createUser(sequelize, username, passwordHash);
    return newUser;
  }
}