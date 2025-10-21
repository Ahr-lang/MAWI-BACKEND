import { DataTypes } from "sequelize";
import { sequelizeRobo } from "../../connections/sequelize.robo";
import { UserRobo } from "./users.model";

export const Formulario4Robo = sequelizeRobo.define("formulario4", {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  codigo: { type: DataTypes.STRING },
  clima: { type: DataTypes.STRING },
  temporada: { type: DataTypes.STRING },
  quad_a: { type: DataTypes.STRING },
  quad_b: { type: DataTypes.STRING },
  sub_quad: { type: DataTypes.STRING },
  habitoDeCrecimiento: { type: DataTypes.STRING },
  nombreComun: { type: DataTypes.STRING },
  nombreCientifico: { type: DataTypes.STRING },
  placa: { type: DataTypes.STRING },
  circunferencia: { type: DataTypes.STRING },
  distancia: { type: DataTypes.STRING },
  estatura: { type: DataTypes.STRING },
  altura: { type: DataTypes.STRING },
  observaciones: { type: DataTypes.STRING },
  latitude: { type: DataTypes.DOUBLE },
  longitude: { type: DataTypes.DOUBLE },
  temperaturaMaxima: { type: DataTypes.STRING },
  humedadMaxima: { type: DataTypes.STRING },
  temperaturaMinima: { type: DataTypes.STRING },
  fecha: { type: DataTypes.STRING },
  editado: { type: DataTypes.STRING },
  id_usuario: { type: DataTypes.INTEGER },
  image_url: { type: DataTypes.STRING(500) },
});

Formulario4Robo.belongsTo(UserRobo, { foreignKey: "id_usuario" });
