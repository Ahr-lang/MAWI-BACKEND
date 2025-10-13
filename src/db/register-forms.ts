import { Sequelize } from 'sequelize';
import { registerBiomoForms } from './models/forms/form.biomo.model';
import { registerAgromoForms } from './models/forms/form.agromo.model';
import { registerRoboForms } from './models/forms/form.robo.model';

export function registerFormsForTenant(tenant: string, sequelize: Sequelize) {
  switch (tenant) {
    case 'agromo': return registerAgromoForms(sequelize);
    case 'biomo':  return registerBiomoForms(sequelize);
    case 'robo':   return registerRoboForms(sequelize);
    default:       return;
  }
}
