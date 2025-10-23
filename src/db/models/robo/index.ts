import { sequelizeRobo } from '../../connections/sequelize.robo';
import { registerRoboForms } from '../forms/form.robo.model';

export const initRoboModels = async () => {
  registerRoboForms(sequelizeRobo);
  await sequelizeRobo.sync();
};