// Importamos bcrypt para hashear contraseñas
import bcrypt from "bcryptjs";
// Importamos el repositorio de usuarios
import UserRepository from "../db/repositories/user.repository";
import { trace } from '@opentelemetry/api';

// Clase UserService para lógica de negocio de usuarios
export default class UserService {
  // Método para registrar un nuevo usuario
  static async registerUser(sequelize: any, username: string, password: string, user_email?: string) {
    const tracer = trace.getTracer('user-service');
    const span = tracer.startSpan('registerUser');
    span.setAttribute('operation', 'user.registerUser');
    span.setAttribute('username', username);

    try {
      // Validamos que username y password estén presentes
      if (!username || !password) {
        span.addEvent('Validation failed: missing username or password');
        throw new Error("Username and password are required");
      }

      span.addEvent('Checking if user exists');

      // Verificamos si el usuario ya existe
      const existingUser = await UserRepository.findByUsername(sequelize, username);
      if (existingUser) {
        span.addEvent('User already exists');
        throw new Error("Username already taken");
      }

      span.addEvent('Hashing password');

      // Hasheamos la contraseña
      const passwordHash = await bcrypt.hash(password, 12);

      span.addEvent('Creating user in database');

      // Creamos el usuario en la base de datos
      const newUser = await UserRepository.createUser(sequelize, username, passwordHash, user_email);

      span.setAttribute('user.id', newUser.id);
      span.addEvent('User registered successfully');

      span.end();
      return newUser;
    } catch (err: any) {
      span.recordException(err);
      span.end();
      throw err;
    }
  }

  // Método para obtener todos los usuarios de un tenant
  static async getAllUsers(sequelize: any) {
    const tracer = trace.getTracer('user-service');
    const span = tracer.startSpan('getAllUsers');
    span.setAttribute('operation', 'user.getAllUsers');

    try {
      span.addEvent('Fetching all users');

      const users = await UserRepository.getAllUsers(sequelize);

      span.setAttribute('users.count', users.length);
      span.addEvent('Users fetched successfully');

      span.end();
      return users;
    } catch (err: any) {
      span.recordException(err);
      span.end();
      throw err;
    }
  }

  // Método para obtener todos los usuarios con conteo de formularios
  static async getUsersWithFormCounts(sequelize: any, tenant: string) {
    const tracer = trace.getTracer('user-service');
    const span = tracer.startSpan('getUsersWithFormCounts');
    span.setAttribute('operation', 'user.getUsersWithFormCounts');
    span.setAttribute('tenant', tenant);

    try {
      span.addEvent('Fetching users with form counts');

      const users = await UserRepository.getUsersWithFormCounts(sequelize, tenant);

      span.setAttribute('users.count', users.length);
      span.addEvent('Users with form counts fetched successfully');

      span.end();
      return users;
    } catch (err: any) {
      span.recordException(err);
      span.end();
      throw err;
    }
  }

  // Obtener un usuario por identificador (username o email)
  static async getUserByIdentifier(sequelize: any, identifier: string) {
    const tracer = trace.getTracer('user-service');
    const span = tracer.startSpan('getUserByIdentifier');
    span.setAttribute('operation', 'user.getUserByIdentifier');
    span.setAttribute('identifier', identifier);

    try {
      span.addEvent('Fetching user by identifier');

      const user = await UserRepository.findByUsername(sequelize, identifier);

      if (user) {
        span.setAttribute('user.id', user.id);
        span.addEvent('User found');
      } else {
        span.addEvent('User not found');
      }

      span.end();
      return user;
    } catch (err: any) {
      span.recordException(err);
      span.end();
      throw err;
    }
  }

  // Buscar usuario por email en un tenant
  static async findUserByEmail(sequelize: any, email: string) {
    const tracer = trace.getTracer('user-service');
    const span = tracer.startSpan('findUserByEmail');
    span.setAttribute('operation', 'user.findUserByEmail');
    span.setAttribute('email', email);

    try {
      span.addEvent('Fetching user by email');

      const user = await UserRepository.findByEmail(sequelize, email);

      if (user) {
        span.setAttribute('user.id', user.id);
        span.addEvent('User found');
      } else {
        span.addEvent('User not found');
      }

      span.end();
      return user;
    } catch (err: any) {
      span.recordException(err);
      span.end();
      throw err;
    }
  }

  static async deleteUserById(sequelize: any, userId: number) {
    const User = sequelize.models.User;
    const deletedCount = await User.destroy({ where: { id: userId } });
    return deletedCount > 0;
  }
}