import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const sequelizeBiomo = new Sequelize(process.env.POSTGRES_URI_BIOMO!, {
  dialect: "postgres",
  logging: false,     // disable noisy logs
});
