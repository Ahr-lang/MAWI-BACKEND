import { sequelizeBiomo } from '../../connections/sequelize.biomo';
import { registerBiomoForms } from '../forms/form.biomo.model';

export const initBiomoModels = async () => {
  registerBiomoForms(sequelizeBiomo);
  await sequelizeBiomo.sync();
};