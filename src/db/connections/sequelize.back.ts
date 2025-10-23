import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const sequelizeBack = new Sequelize(process.env.POSTGRES_URI_BACK!, {
  dialect: "postgres",
  logging: false,     // disable noisy logs
});
