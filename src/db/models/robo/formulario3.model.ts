import { DataTypes } from "sequelize";
import { sequelizeRobo } from "../../connections/sequelize.robo";
import { UserRobo } from "./users.model";

export const Formulario3Robo = sequelizeRobo.define("formulario3", {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  codigo: { type: DataTypes.STRING },
  clima: { type: DataTypes.STRING },
  temporada: { type: DataTypes.STRING },
  seguimiento: { type: DataTypes.BOOLEAN },
  cambio: { type: DataTypes.BOOLEAN },
  cobertura: { type: DataTypes.STRING },
  tipoCultivo: { type: DataTypes.STRING },
  disturbio: { type: DataTypes.STRING },
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

Formulario3Robo.belongsTo(UserRobo, { foreignKey: "id_usuario" });
