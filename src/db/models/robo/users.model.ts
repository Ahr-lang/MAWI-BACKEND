import { DataTypes } from "sequelize";
import { sequelizeRobo } from "../../connections/sequelize.robo";

export const UserRobo = sequelizeRobo.define("users", {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  username: { type: DataTypes.STRING, allowNull: false },
  password_hash: { type: DataTypes.STRING, allowNull: false },
  lastaccess: { type: DataTypes.DATE },
  lastlogin: { type: DataTypes.DATE },
  user_email: { type: DataTypes.STRING },
});
