import { sequelizeBack } from '../../connections/sequelize.back';
import defineUserModel from '../user.model';

export const initBackModels = async () => {
  defineUserModel(sequelizeBack);
  await sequelizeBack.sync();
};