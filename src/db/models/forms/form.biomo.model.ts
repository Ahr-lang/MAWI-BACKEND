// src/db/models/form.biomo.model.ts
import { Sequelize, DataTypes } from 'sequelize';

export function registerBiomoForms(sequelize: Sequelize) {
  // formulario1
  sequelize.define('BIOMO_FORM_1', {
    id: { type: DataTypes.BIGINT, primaryKey: true, allowNull: false, autoIncrement: true },
    transecto: DataTypes.STRING,
    clima: DataTypes.STRING,
    temporada: DataTypes.STRING,
    tipoanimal: DataTypes.STRING,
    nombrecomun: DataTypes.STRING,
    nombrecientifico: DataTypes.STRING,
    numeroindividuos: DataTypes.STRING,
    tipoobservacion: DataTypes.STRING,
    observaciones: DataTypes.STRING,
    latitude: DataTypes.DOUBLE,
    longitude: DataTypes.DOUBLE,
    fecha: DataTypes.STRING,
    editado: DataTypes.STRING,
  }, { tableName: 'formulario1', schema: 'public', freezeTableName: true, timestamps: false });

  // formulario2
  sequelize.define('BIOMO_FORM_2', {
    id: { type: DataTypes.BIGINT, primaryKey: true, allowNull: false, autoIncrement: true },
    zona: DataTypes.STRING,
    clima: DataTypes.STRING,
    temporada: DataTypes.STRING,
    tipoanimal: DataTypes.STRING,
    nombrecomun: DataTypes.STRING,
    nombrecientifico: DataTypes.STRING,
    numeroindividuos: DataTypes.STRING,
    tipoobservacion: DataTypes.STRING,
    alturaobservacion: DataTypes.STRING,
    observaciones: DataTypes.STRING,
    latitude: DataTypes.DOUBLE,
    longitude: DataTypes.DOUBLE,
    fecha: DataTypes.STRING,
    editado: DataTypes.STRING,
  }, { tableName: 'formulario2', schema: 'public', freezeTableName: true, timestamps: false });

  // formulario3
  sequelize.define('BIOMO_FORM_3', {
    id: { type: DataTypes.BIGINT, primaryKey: true, allowNull: false, autoIncrement: true },
    codigo: DataTypes.STRING,
    clima: DataTypes.STRING,
    temporada: DataTypes.STRING,
    seguimiento: DataTypes.BOOLEAN,
    cambio: DataTypes.BOOLEAN,
    cobertura: DataTypes.STRING,
    tipocultivo: DataTypes.STRING,
    disturbio: DataTypes.STRING,
    observaciones: DataTypes.STRING,
    latitude: DataTypes.DOUBLE,
    longitude: DataTypes.DOUBLE,
    fecha: DataTypes.STRING,
    editado: DataTypes.STRING,
  }, { tableName: 'formulario3', schema: 'public', freezeTableName: true, timestamps: false });

  // formulario4
  sequelize.define('BIOMO_FORM_4', {
    id: { type: DataTypes.BIGINT, primaryKey: true, allowNull: false, autoIncrement: true },
    codigo: DataTypes.STRING,
    clima: DataTypes.STRING,
    temporada: DataTypes.STRING,
    quad_a: DataTypes.STRING,
    quad_b: DataTypes.STRING,
    sub_quad: DataTypes.STRING,
    habitodecrecimiento: DataTypes.STRING,
    nombrecomun: DataTypes.STRING,
    nombrecientifico: DataTypes.STRING,
    placa: DataTypes.STRING,
    circunferencia: DataTypes.STRING,
    distancia: DataTypes.STRING,
    estatura: DataTypes.STRING,
    altura: DataTypes.STRING,
    observaciones: DataTypes.STRING,
    latitude: DataTypes.DOUBLE,
    longitude: DataTypes.DOUBLE,
    fecha: DataTypes.STRING,
    editado: DataTypes.STRING,
  }, { tableName: 'formulario4', schema: 'public', freezeTableName: true, timestamps: false });

  // formulario5
  sequelize.define('BIOMO_FORM_5', {
    id: { type: DataTypes.BIGINT, primaryKey: true, allowNull: false, autoIncrement: true },
    zona: DataTypes.STRING,
    clima: DataTypes.STRING,
    temporada: DataTypes.STRING,
    tipoanimal: DataTypes.STRING,
    nombrecomun: DataTypes.STRING,
    nombrecientifico: DataTypes.STRING,
    numeroindividuos: DataTypes.STRING,
    tipoobservacion: DataTypes.STRING,
    alturaobservacion: DataTypes.STRING,
    observaciones: DataTypes.STRING,
    latitude: DataTypes.DOUBLE,
    longitude: DataTypes.DOUBLE,
    fecha: DataTypes.STRING,
    editado: DataTypes.STRING,
  }, { tableName: 'formulario5', schema: 'public', freezeTableName: true, timestamps: false });

  // formulario6
  sequelize.define('BIOMO_FORM_6', {
    id: { type: DataTypes.BIGINT, primaryKey: true, allowNull: false, autoIncrement: true },
    codigo: DataTypes.STRING,
    clima: DataTypes.STRING,
    temporada: DataTypes.STRING,
    zona: DataTypes.STRING,
    nombrecamara: DataTypes.STRING,
    placacamara: DataTypes.STRING,
    placaguaya: DataTypes.STRING,
    anchocamino: DataTypes.STRING,
    fechainstalacion: DataTypes.STRING,
    distanciaobjetivo: DataTypes.STRING,
    alturalente: DataTypes.STRING,
    checklist: DataTypes.STRING,
    observaciones: DataTypes.STRING,
    latitude: DataTypes.DOUBLE,
    longitude: DataTypes.DOUBLE,
    fecha: DataTypes.STRING,
    editado: DataTypes.STRING,
  }, { tableName: 'formulario6', schema: 'public', freezeTableName: true, timestamps: false });

  // formulario7
  sequelize.define('BIOMO_FORM_7', {
    id: { type: DataTypes.BIGINT, primaryKey: true, allowNull: false, autoIncrement: true },
    clima: DataTypes.STRING,
    temporada: DataTypes.STRING,
    zona: DataTypes.STRING,
    pluviosidad: DataTypes.STRING,
    temperaturamaxima: DataTypes.STRING,
    humedadmaxima: DataTypes.STRING,
    temperaturaminima: DataTypes.STRING,
    nivelquebrada: DataTypes.STRING,
    latitude: DataTypes.DOUBLE,
    longitude: DataTypes.DOUBLE,
    fecha: DataTypes.STRING,
    editado: DataTypes.STRING,
  }, { tableName: 'formulario7', schema: 'public', freezeTableName: true, timestamps: false });
}
