import { sequelizeBiomo } from "../../connections/sequelize.biomo";
import { UserBiomo } from "./users.model";

export const initBiomoModels = async () => {
  await sequelizeBiomo.sync();
  console.log("✅ Biomo DB synced successfully");
};

export { UserBiomo };
