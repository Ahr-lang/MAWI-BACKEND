import { sequelizeAgromo } from "../../connections/sequelize.agromo";
import { UserAgromo } from "./users.model";
import { Formulario1Agromo } from "./formulario1.model";

export const initAgromoModels = async () => {
  await sequelizeAgromo.sync();
  console.log("✅ Agromo DB synced successfully");
};

export { UserAgromo, Formulario1Agromo };
