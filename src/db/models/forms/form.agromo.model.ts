import { DataTypes, Sequelize } from 'sequelize';

export function registerAgromoForms(sequelize: Sequelize) {
  // formulario1
  sequelize.define('AGROMO_FORM_1', {
    id: { type: DataTypes.INTEGER, primaryKey: true, allowNull: true },
    transecto: DataTypes.STRING,
    clima: DataTypes.STRING,
    temporada: DataTypes.STRING,
    tipoanimal: DataTypes.STRING,
    nombrecomun: DataTypes.STRING,
    nombrecientifico: DataTypes.STRING,
    numeroindividuos: DataTypes.STRING,
    tipoobservacion: DataTypes.STRING,
    observaciones: DataTypes.STRING,
    latitude: DataTypes.FLOAT,
    longitude: DataTypes.FLOAT,
    fecha: DataTypes.STRING,
    editado: DataTypes.STRING,
  }, { tableName: 'formulario1', schema: 'public', freezeTableName: true, timestamps: false });

  sequelize.define('AGROMO_FORM_2', { /* TODO */ }, { tableName: 'formulario2', schema: 'public', freezeTableName: true, timestamps: false });
  sequelize.define('AGROMO_FORM_3', { /* TODO */ }, { tableName: 'formulario3', schema: 'public', freezeTableName: true, timestamps: false });
  sequelize.define('AGROMO_FORM_4', { /* TODO */ }, { tableName: 'formulario4', schema: 'public', freezeTableName: true, timestamps: false });
  sequelize.define('AGROMO_FORM_5', { /* TODO */ }, { tableName: 'formulario5', schema: 'public', freezeTableName: true, timestamps: false });
  sequelize.define('AGROMO_FORM_6', { /* TODO */ }, { tableName: 'formulario6', schema: 'public', freezeTableName: true, timestamps: false });
  sequelize.define('AGROMO_FORM_7', { /* TODO */ }, { tableName: 'formulario7', schema: 'public', freezeTableName: true, timestamps: false });
}
