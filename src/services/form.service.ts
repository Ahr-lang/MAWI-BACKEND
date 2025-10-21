import { trace } from '@opentelemetry/api';
import FormRepository from '../db/repositories/form.repository';

class FormService {
  async createSubmission(
    sequelize: any,
    tenant: string,
    formKey: string,
    payload: any,
    userId?: number
  ) {
    const span = trace.getActiveSpan();
    span?.setAttribute('app.tenant', tenant);
    span?.setAttribute('app.form.key', formKey);
    if (userId) span?.setAttribute('app.user.id', userId);

    // Optional: basic validation for the image URL you already place in payload.image_url
    if (payload?.image_url) {
      span?.setAttribute('app.image.present', true);
      if (typeof payload.image_url !== 'string' || !/^https?:\/\//i.test(payload.image_url)) {
        throw Object.assign(new Error('Invalid image_url format'), { status: 400 });
      }
    }

    // Delegate to repository (no mutation of payload)
    return FormRepository.insert(sequelize, tenant, formKey, payload, userId);
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

  async getAllFormsForUser(sequelize: any, tenant: string, targetUserId: number) {
    const span = trace.getActiveSpan();
    span?.setAttribute('app.tenant', tenant);
    span?.setAttribute('app.target.user.id', targetUserId);

    return await FormRepository.getAllFormsForUser(sequelize, tenant, targetUserId);
  }
}
export default new FormService();
