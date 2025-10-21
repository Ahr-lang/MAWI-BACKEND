import { DataTypes } from "sequelize";
import { sequelizeRobo } from "../../connections/sequelize.robo";
import { UserRobo } from "./users.model";

export const UsuarioFormularioRobo = sequelizeRobo.define("usuarioformulario", {
  usuarioId: { type: DataTypes.BIGINT, primaryKey: true },
  formId: { type: DataTypes.BIGINT, primaryKey: true },
  formType: { type: DataTypes.STRING, primaryKey: true },
});

UsuarioFormularioRobo.belongsTo(UserRobo, { foreignKey: "usuarioId" });
