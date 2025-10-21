import { DataTypes } from "sequelize";
import { sequelizeAgromo } from "../../connections/sequelize.agromo";
import { UserAgromo } from "./users.model";

export const Formulario1Agromo = sequelizeAgromo.define("formulario1", {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  id_usuario: { type: DataTypes.INTEGER, allowNull: true },
  cultivo: { type: DataTypes.STRING(100), allowNull: false },
  fecha_siembra: { type: DataTypes.TEXT, allowNull: false },
  humedad: { type: DataTypes.INTEGER },
  metodo_humedad: { type: DataTypes.STRING(100) },
  ph: { type: DataTypes.INTEGER },
  metodo_ph: { type: DataTypes.STRING(100) },
  altura_planta: { type: DataTypes.FLOAT },
  metodo_altura: { type: DataTypes.STRING(100) },
  estado_fenologico: { type: DataTypes.STRING(100) },
  densidad_follaje: { type: DataTypes.STRING(100) },
  color_follaje: { type: DataTypes.STRING(100) },
  estado_follaje: { type: DataTypes.STRING(100) },
  observaciones: { type: DataTypes.TEXT },
  fecha_registro: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  hora_registro: { type: DataTypes.TIME },
  estado: { type: DataTypes.INTEGER, defaultValue: 1 },
  localizacion: { type: DataTypes.STRING(255) },
  image_url: { type: DataTypes.STRING(500) },
});

Formulario1Agromo.belongsTo(UserAgromo, { foreignKey: "id_usuario" });
