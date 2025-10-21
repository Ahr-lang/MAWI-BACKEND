import { DataTypes } from "sequelize";
import { sequelizeBiomo } from "../../connections/sequelize.biomo";
import { UserBiomo } from "./users.model";

export const UsuarioFormularioBiomo = sequelizeBiomo.define("usuarioformulario", {
  usuarioId: { type: DataTypes.BIGINT, primaryKey: true },
  formId: { type: DataTypes.BIGINT, primaryKey: true },
  formType: { type: DataTypes.STRING, primaryKey: true },
});

UsuarioFormularioBiomo.belongsTo(UserBiomo, { foreignKey: "usuarioId" });
