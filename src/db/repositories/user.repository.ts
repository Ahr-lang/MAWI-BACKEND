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

  // Método para encontrar un usuario por nombre de usuario o email
  static async findByUsername(sequelize: any, username: string) {
    const User = sequelize.models.User;
    const user = await User.findOne({ 
      where: { 
        [sequelize.Sequelize.Op.or]: [
          { username: username.toLowerCase() },
          { user_email: username.toLowerCase() }
        ]
      } 
    });
    return user ? { id: user.id, username: user.username, user_email: user.user_email, password_hash: user.password_hash } : null;
  }

  // Método para autenticar un usuario (verificar email y contraseña)
  static async authenticateUser(sequelize: any, email: string, password: string) {
    const user = await this.findByUsername(sequelize, email);
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) return null;

    return { id: user.id, username: user.username, user_email: user.user_email };
  }

  // Método para crear un nuevo usuario
  static async createUser(sequelize: any, username: string, passwordHash: string, user_email?: string) {
    const User = sequelize.models.User;
    const user = await User.create({ username, password_hash: passwordHash, user_email });
    return { id: user.id, username: user.username, user_email: user.user_email };
  }

  // Método para obtener todos los usuarios de un tenant (con ID, username y email)
  static async getAllUsers(sequelize: any) {
    const User = sequelize.models.User;
    const users = await User.findAll({
      attributes: ['id', 'username', 'user_email'], // Retornamos id, username y email
      order: [['username', 'ASC']] // Ordenamos alfabéticamente
    });
    return users.map((user: any) => ({ 
      id: user.id, 
      username: user.username, 
      user_email: user.user_email 
    }));
  }

  // Método para obtener todos los usuarios con el conteo de sus formularios
  static async getUsersWithFormCounts(sequelize: any, tenant: string) {
    const User = sequelize.models.User;
    const users = await User.findAll({
      attributes: ['id', 'username', 'user_email'],
      order: [['username', 'ASC']]
    });

    // Para cada usuario, contar sus formularios
    const usersWithCounts = await Promise.all(users.map(async (user: any) => {
      let formCount = 0;

      if (tenant === 'agromo') {
        // Para agromo, contar formularios en AGROMO_FORMULARIO
        const Formulario = sequelize.models.AGROMO_FORMULARIO;
        if (Formulario) {
          formCount = await Formulario.count({
            where: { id_usuario: user.id }
          });
        }
      } else if (tenant === 'biomo' || tenant === 'robo') {
        // Para biomo/robo, contar en todas las tablas de formularios (1-7)
        for (let i = 1; i <= 7; i++) {
          const modelName = `${tenant.toUpperCase()}_FORM_${i}`;
          const FormModel = sequelize.models[modelName];
          if (FormModel) {
            const count = await FormModel.count({
              where: { id_usuario: user.id }
            });
            formCount += count;
          }
        }
      }

      return {
        id: user.id,
        username: user.username,
        user_email: user.user_email,
        forms_count: formCount
      };
    }));

    return usersWithCounts;
  }

  // Método para encontrar usuario por email (devuelve id, username y email)
  static async findByEmail(sequelize: any, email: string) {
    const User = sequelize.models.User;
    if (!email) return null;
    const user = await User.findOne({ where: { user_email: email.toLowerCase() } });
    return user ? { id: user.id, username: user.username, user_email: user.user_email } : null;
  }
}