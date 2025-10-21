import { DataTypes } from "sequelize";
import { sequelizeBiomo } from "../../connections/sequelize.biomo";
import { UserBiomo } from "./users.model";

export const Formulario3Biomo = sequelizeBiomo.define("formulario3", {
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
  fecha: { type: DataTypes.STRING },
  editado: { type: DataTypes.STRING },
  id_usuario: { type: DataTypes.INTEGER },
  image_url: { type: DataTypes.STRING(500) },
});

Formulario3Biomo.belongsTo(UserBiomo, { foreignKey: "id_usuario" });
