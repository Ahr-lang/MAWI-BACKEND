import { DataTypes, Sequelize } from 'sequelize';

export function registerAgromoForms(sequelize: Sequelize) {
  // registro del modelo: AGROMO_FORM_1
  sequelize.define('AGROMO_FORM_1', {
    id:                { type: DataTypes.BIGINT, primaryKey: true, allowNull: false, autoIncrement: true },
    id_usuario:        { type: DataTypes.INTEGER, allowNull: true },
    cultivo:           { type: DataTypes.STRING(100), allowNull: false },
    fecha_siembra:     { type: DataTypes.DATEONLY, allowNull: false },
    humedad:           { type: DataTypes.INTEGER, allowNull: true },
    metodo_humedad:    { type: DataTypes.STRING(100), allowNull: true },
    ph:                { type: DataTypes.INTEGER, allowNull: true },
    metodo_ph:         { type: DataTypes.STRING(100), allowNull: true },
    altura_planta:     { type: DataTypes.DOUBLE, allowNull: true },
    metodo_altura:     { type: DataTypes.STRING(100), allowNull: true },
    estado_fenologico: { type: DataTypes.STRING(100), allowNull: true },
    densidad_follaje:  { type: DataTypes.STRING(100), allowNull: true },
    color_follaje:     { type: DataTypes.STRING(100), allowNull: true },
    estado_follaje:    { type: DataTypes.STRING(100), allowNull: true },
    observaciones:     { type: DataTypes.TEXT, allowNull: true },
    fecha_registro:    { type: DataTypes.DATEONLY, allowNull: true, defaultValue: DataTypes.NOW },
    hora_registro:     { type: DataTypes.TIME, allowNull: true, defaultValue: DataTypes.NOW },
    estado:            { type: DataTypes.INTEGER, allowNull: true, defaultValue: 1 },
    localizacion:      { type: DataTypes.STRING(255), allowNull: true },
    image_url:         { type: DataTypes.STRING(500), allowNull: true, defaultValue: null },
  }, {
    tableName: 'formulario1',
    schema: 'public',
    freezeTableName: true,
    timestamps: false,
  });
}
