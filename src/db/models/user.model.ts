// Importamos DataTypes de Sequelize para definir tipos de datos
import { DataTypes } from "sequelize";

// Función que define el modelo de Usuario para una instancia de Sequelize
function defineUserModel(sequelize: any) {
  // Definimos el modelo 'User' que representa la tabla 'users' en la base de datos
  const User = sequelize.define('User', {
    // Campo 'id': clave primaria, entero, se autoincrementa
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    // Campo 'username': cadena de texto, no puede ser nulo, debe ser único
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    // Campo 'password_hash': cadena de texto para la contraseña hasheada, no puede ser nulo
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Campo 'user_email': mapea a la columna DB `user_email` (si existe)
    user_email: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'user_email',
    },
    // Campo 'lastAccess': fecha y hora del último acceso del usuario (mapea a la columna DB `lastaccess`)
    lastAccess: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'lastaccess',
    },
    // Campo 'lastLogin': fecha y hora del último login (mapea a la columna DB `lastlogin`)
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'lastlogin',
    },
  }, {
    // Nombre de la tabla en la base de datos
    tableName: 'users',
    // No usamos timestamps automáticos porque la tabla existente tiene columnas diferentes
    timestamps: false,
  });

  // Retornamos el modelo definido
  return User;
}

// Exportamos la función para usarla en otros archivos
export default defineUserModel;