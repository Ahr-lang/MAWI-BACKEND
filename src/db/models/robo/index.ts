import { sequelizeRobo } from "../../connections/sequelize.robo";

export const initRoboModels = async () => {
  await sequelizeRobo.sync();
  console.log("✅ Robo DB synced successfully");
};
