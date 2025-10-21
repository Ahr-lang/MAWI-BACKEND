import { sequelizeBack } from "../../connections/sequelize.back";
import { UserBack } from "./users.model";
import { DynamicForm } from "./dynamic_forms.model";

export const initBackModels = async () => {
  await sequelizeBack.sync();
  console.log("✅ Back DB synced successfully");
};
