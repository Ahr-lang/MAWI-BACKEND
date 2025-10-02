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
    // Campo 'lastActiveAt': fecha y hora de la última actividad del usuario (opcional, se puede inferir de logins)
    lastActiveAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    // Nombre de la tabla en la base de datos
    tableName: 'users',
    // Habilitamos timestamps automáticos: createdAt y updatedAt
    timestamps: true, // Esto añade createdAt y updatedAt automáticamente
  });

  // Retornamos el modelo definido
  return User;
}

// Exportamos la función para usarla en otros archivos
export default defineUserModel;