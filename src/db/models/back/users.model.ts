import { DataTypes } from "sequelize";
import { sequelizeBack } from "../../connections/sequelize.back";

export const UserBack = sequelizeBack.define("users", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  username: { type: DataTypes.STRING, allowNull: false },
  password_hash: { type: DataTypes.STRING, allowNull: false },
  user_email: { type: DataTypes.STRING },
  lastaccess: { type: DataTypes.DATE },
  lastlogin: { type: DataTypes.DATE },
});
