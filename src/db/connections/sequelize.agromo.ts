import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const sequelizeAgromo = new Sequelize(process.env.POSTGRES_URI_AGROMO!, {
  dialect: "postgres",
  logging: false,     // disable noisy logs
});
