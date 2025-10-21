import { DataTypes } from "sequelize";
import { sequelizeBiomo } from "../../connections/sequelize.biomo";
import { UserBiomo } from "./users.model";

export const Formulario1Biomo = sequelizeBiomo.define("formulario1", {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  transecto: { type: DataTypes.STRING },
  clima: { type: DataTypes.STRING },
  temporada: { type: DataTypes.STRING },
  tipoAnimal: { type: DataTypes.STRING },
  nombreComun: { type: DataTypes.STRING },
  nombreCientifico: { type: DataTypes.STRING },
  numeroIndividuos: { type: DataTypes.STRING },
  tipoObservacion: { type: DataTypes.STRING },
  observaciones: { type: DataTypes.STRING },
  latitude: { type: DataTypes.DOUBLE },
  longitude: { type: DataTypes.DOUBLE },
  fecha: { type: DataTypes.STRING },
  editado: { type: DataTypes.STRING },
  id_usuario: { type: DataTypes.INTEGER },
  image_url: { type: DataTypes.STRING(500) },
});

Formulario1Biomo.belongsTo(UserBiomo, { foreignKey: "id_usuario" });
