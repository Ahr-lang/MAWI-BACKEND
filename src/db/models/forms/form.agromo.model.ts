import { DataTypes, Sequelize } from 'sequelize';

export function registerAgromoForms(sequelize: Sequelize) {
  // Users table (referenced by agricultor)
  sequelize.define('AGROMO_USER', {
    id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
    username: DataTypes.STRING,
    password_hash: DataTypes.STRING,
    lastaccess: DataTypes.DATE,
    lastlogin: DataTypes.DATE,
    user_email: DataTypes.STRING,
    telefono: DataTypes.STRING,
    empresa: DataTypes.TEXT,
    cargo: DataTypes.TEXT,
    ubicacion: DataTypes.TEXT,
    rol: DataTypes.STRING,
    estado_conexion: { type: DataTypes.BOOLEAN, defaultValue: false }
  }, { tableName: 'users', schema: 'public', freezeTableName: true, timestamps: false });

  // Agricultor table
  sequelize.define('AGROMO_AGRICULTOR', {
    id_agricultor: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
    nombre: DataTypes.TEXT,
    email: DataTypes.TEXT,
    ubicacion: DataTypes.TEXT,
    estado_conexion: { type: DataTypes.BOOLEAN, defaultValue: false },
    foto_perfil: DataTypes.BLOB,
    id_usuario: { type: DataTypes.INTEGER, references: { model: 'AGROMO_USER', key: 'id' } }
  }, { tableName: 'agricultor', schema: 'public', freezeTableName: true, timestamps: false });

  // Cultivo table
  sequelize.define('AGROMO_CULTIVO', {
    id_cultivo: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
    nombre: DataTypes.TEXT,
    tipo: DataTypes.TEXT,
    fecha_siembra: DataTypes.DATE,
    area: DataTypes.REAL,
    estado: DataTypes.STRING,
    estado_conexion: { type: DataTypes.BOOLEAN, defaultValue: false },
    id_agricultor: { type: DataTypes.INTEGER, references: { model: 'AGROMO_AGRICULTOR', key: 'id_agricultor' } }
  }, { tableName: 'cultivo', schema: 'public', freezeTableName: true, timestamps: false });

  // Formulario table (main form)
  sequelize.define('AGROMO_FORMULARIO', {
    id_formulario: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
    nombre_formulario: DataTypes.TEXT,
    fecha: DataTypes.DATE,
    hora: DataTypes.TIME,
    nombre_operador: DataTypes.TEXT,
    medidas_plantio: DataTypes.TEXT,
    datos_clima: DataTypes.TEXT,
    observaciones: DataTypes.TEXT,
    estado_conexion: { type: DataTypes.BOOLEAN, defaultValue: false },
    id_usuario: { type: DataTypes.INTEGER, allowNull: true }, // User who created the form
    id_agricultor: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'AGROMO_AGRICULTOR', key: 'id_agricultor' } },
    id_cultivo: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'AGROMO_CULTIVO', key: 'id_cultivo' } }
  }, { tableName: 'formulario', schema: 'public', freezeTableName: true, timestamps: false });

  // Condiciones Climaticas
  sequelize.define('AGROMO_CONDICIONES_CLIMATICAS', {
    id_condicion: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
    id_formulario: { type: DataTypes.INTEGER, references: { model: 'AGROMO_FORMULARIO', key: 'id_formulario' } },
    estado_clima: DataTypes.TEXT,
    condiciones_tierra: DataTypes.TEXT,
    temperatura: DataTypes.REAL,
    humedad_ambiente: DataTypes.REAL,
    viento: DataTypes.REAL,
    humedad_tierra: DataTypes.REAL
  }, { tableName: 'condiciones_climaticas', schema: 'public', freezeTableName: true, timestamps: false });

  // Detalles Quimicos
  sequelize.define('AGROMO_DETALLES_QUIMICOS', {
    id_detalle: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
    id_formulario: { type: DataTypes.INTEGER, references: { model: 'AGROMO_FORMULARIO', key: 'id_formulario' } },
    tipo_quimico: DataTypes.TEXT,
    metodo_aplicacion: DataTypes.TEXT
  }, { tableName: 'detalles_quimicos', schema: 'public', freezeTableName: true, timestamps: false });

  // Fotografia
  sequelize.define('AGROMO_FOTOGRAFIA', {
    id_foto: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
    ruta_archivo: DataTypes.TEXT,
    fecha_foto: DataTypes.DATE,
    descripcion: DataTypes.TEXT,
    estado_conexion: { type: DataTypes.BOOLEAN, defaultValue: false },
    id_formulario: { type: DataTypes.INTEGER, references: { model: 'AGROMO_FORMULARIO', key: 'id_formulario' } },
    archivo: DataTypes.BLOB
  }, { tableName: 'fotografia', schema: 'public', freezeTableName: true, timestamps: false });

  // Chat IA
  sequelize.define('AGROMO_CHAT_IA', {
    id_chat: { type: DataTypes.INTEGER, primaryKey: true, allowNull: false, autoIncrement: true },
    id_usuario: { type: DataTypes.INTEGER, references: { model: 'AGROMO_USER', key: 'id' } },
    mensaje: DataTypes.TEXT,
    imagen: DataTypes.BLOB,
    creado_en: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
  }, { tableName: 'chat_ia', schema: 'public', freezeTableName: true, timestamps: false });

  // Define associations
  const Formulario = sequelize.models['AGROMO_FORMULARIO'];
  const Agricultor = sequelize.models['AGROMO_AGRICULTOR'];
  const Cultivo = sequelize.models['AGROMO_CULTIVO'];
  const Condiciones = sequelize.models['AGROMO_CONDICIONES_CLIMATICAS'];
  const Quimicos = sequelize.models['AGROMO_DETALLES_QUIMICOS'];
  const Fotos = sequelize.models['AGROMO_FOTOGRAFIA'];
  const User = sequelize.models['AGROMO_USER'];

  if (Formulario && Agricultor) {
    Formulario.belongsTo(Agricultor, { foreignKey: 'id_agricultor', as: 'agricultor' });
    Agricultor.hasMany(Formulario, { foreignKey: 'id_agricultor' });
  }

  if (Formulario && Cultivo) {
    Formulario.belongsTo(Cultivo, { foreignKey: 'id_cultivo', as: 'cultivo' });
    Cultivo.hasMany(Formulario, { foreignKey: 'id_cultivo' });
  }

  if (Formulario && Condiciones) {
    Formulario.hasMany(Condiciones, { foreignKey: 'id_formulario', as: 'condiciones' });
    Condiciones.belongsTo(Formulario, { foreignKey: 'id_formulario' });
  }

  if (Formulario && Quimicos) {
    Formulario.hasMany(Quimicos, { foreignKey: 'id_formulario', as: 'quimicos' });
    Quimicos.belongsTo(Formulario, { foreignKey: 'id_formulario' });
  }

  if (Formulario && Fotos) {
    Formulario.hasMany(Fotos, { foreignKey: 'id_formulario', as: 'fotos' });
    Fotos.belongsTo(Formulario, { foreignKey: 'id_formulario' });
  }

  if (Agricultor && User) {
    Agricultor.belongsTo(User, { foreignKey: 'id_usuario', as: 'usuario' });
    User.hasMany(Agricultor, { foreignKey: 'id_usuario' });
  }
}
