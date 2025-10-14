// src/services/form.service.ts
import { trace } from '@opentelemetry/api';
import FormRepository from '../db/repositories/form.repository';

class FormService {
  async createSubmission(sequelize: any, tenant: string, formKey: string, payload: any, userId?: number) {
    const span = trace.getActiveSpan();
    span?.setAttribute('app.tenant', tenant);
    span?.setAttribute('app.form.key', formKey);
    if (userId) span?.setAttribute('app.user.id', userId);

    return await FormRepository.insert(sequelize, tenant, formKey, payload, userId);
  }

  async getUserForms(sequelize: any, tenant: string, formKey: string, userId: number) {
    const span = trace.getActiveSpan();
    span?.setAttribute('app.tenant', tenant);
    span?.setAttribute('app.form.key', formKey);
    span?.setAttribute('app.user.id', userId);

    return await FormRepository.getByUser(sequelize, tenant, formKey, userId);
  }

  async getFormById(sequelize: any, tenant: string, formKey: string, formId: number) {
    const span = trace.getActiveSpan();
    span?.setAttribute('app.tenant', tenant);
    span?.setAttribute('app.form.key', formKey);
    span?.setAttribute('app.form.id', formId);

    return await FormRepository.getById(sequelize, tenant, formKey, formId);
  }

  async updateForm(sequelize: any, tenant: string, formKey: string, formId: number, payload: any) {
    const span = trace.getActiveSpan();
    span?.setAttribute('app.tenant', tenant);
    span?.setAttribute('app.form.key', formKey);
    span?.setAttribute('app.form.id', formId);

    return await FormRepository.update(sequelize, tenant, formKey, formId, payload);
  }

  async deleteForm(sequelize: any, tenant: string, formKey: string, formId: number) {
    const span = trace.getActiveSpan();
    span?.setAttribute('app.tenant', tenant);
    span?.setAttribute('app.form.key', formKey);
    span?.setAttribute('app.form.id', formId);

    return await FormRepository.delete(sequelize, tenant, formKey, formId);
  }

  async getAllUserForms(sequelize: any, tenant: string, userId: number) {
    const span = trace.getActiveSpan();
    span?.setAttribute('app.tenant', tenant);
    span?.setAttribute('app.user.id', userId);

    return await FormRepository.getAllUserForms(sequelize, tenant, userId);
  }
}
export default new FormService();
