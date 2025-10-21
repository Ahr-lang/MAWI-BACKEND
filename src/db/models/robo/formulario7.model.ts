import { DataTypes } from "sequelize";
import { sequelizeRobo } from "../../connections/sequelize.robo";
import { UserRobo } from "./users.model";

export const Formulario7Robo = sequelizeRobo.define("formulario7", {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  clima: { type: DataTypes.STRING },
  temporada: { type: DataTypes.STRING },
  zona: { type: DataTypes.STRING },
  pluviosidad: { type: DataTypes.STRING },
  temperaturaMaxima: { type: DataTypes.STRING },
  humedadMaxima: { type: DataTypes.STRING },
  temperaturaMinima: { type: DataTypes.STRING },
  nivelQuebrada: { type: DataTypes.STRING },
  latitude: { type: DataTypes.DOUBLE },
  longitude: { type: DataTypes.DOUBLE },
  fecha: { type: DataTypes.STRING },
  editado: { type: DataTypes.STRING },
  id_usuario: { type: DataTypes.INTEGER },
  image_url: { type: DataTypes.STRING(500) },
});

Formulario7Robo.belongsTo(UserRobo, { foreignKey: "id_usuario" });
