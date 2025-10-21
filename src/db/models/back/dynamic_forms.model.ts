import { DataTypes } from "sequelize";
import { sequelizeBack } from "../../connections/sequelize.back";

export const DynamicForm = sequelizeBack.define("dynamic_forms", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  tenant: { type: DataTypes.STRING },
  formKey: { type: DataTypes.STRING },
  name: { type: DataTypes.STRING },
  schema: { type: DataTypes.JSON },
  submissions: { type: DataTypes.JSON },
  createdBy: { type: DataTypes.INTEGER },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true },
  createdAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  updatedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
});
