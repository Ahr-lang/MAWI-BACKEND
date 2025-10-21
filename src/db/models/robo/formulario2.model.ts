import { DataTypes } from "sequelize";
import { sequelizeRobo } from "../../connections/sequelize.robo";
import { UserRobo } from "./users.model";

export const Formulario2Robo = sequelizeRobo.define("formulario2", {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  zona: { type: DataTypes.STRING },
  clima: { type: DataTypes.STRING },
  temporada: { type: DataTypes.STRING },
  tipoAnimal: { type: DataTypes.STRING },
  nombreComun: { type: DataTypes.STRING },
  nombreCientifico: { type: DataTypes.STRING },
  numeroIndividuos: { type: DataTypes.STRING },
  tipoObservacion: { type: DataTypes.STRING },
  alturaObservacion: { type: DataTypes.STRING },
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

Formulario2Robo.belongsTo(UserRobo, { foreignKey: "id_usuario" });
