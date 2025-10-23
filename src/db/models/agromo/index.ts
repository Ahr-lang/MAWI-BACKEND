import { sequelizeAgromo } from '../../connections/sequelize.agromo';
import { registerAgromoForms } from '../forms/form.agromo.model';

export const initAgromoModels = async () => {
  registerAgromoForms(sequelizeAgromo);
  await sequelizeAgromo.sync();
};