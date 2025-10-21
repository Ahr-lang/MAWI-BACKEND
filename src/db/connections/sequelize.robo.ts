import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const sequelizeRobo = new Sequelize(process.env.POSTGRES_URI_ROBO!, {
  dialect: "postgres",
  logging: false,     // disable noisy logs
});
