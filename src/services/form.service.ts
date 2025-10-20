import { trace } from '@opentelemetry/api';
import FormRepository from '../db/repositories/form.repository';

class FormService {
  async createSubmission(sequelize: any, tenant: string, formKey: string, payload: any, userId?: number) {
    const span = trace.getActiveSpan();
    span?.setAttribute('app.tenant', tenant);
    span?.setAttribute('app.form.key', formKey);
    if (userId) span?.setAttribute('app.user.id', userId);

    // Process image if present
    if (payload.imageUrl) {
      span?.setAttribute("app.image.present", true);
      console.log("[FormService] Processing image URL:", payload.imageUrl);
      
      // Validate image URL format
      if (!payload.imageUrl.startsWith('http')) {
        console.error("[FormService] Invalid image URL format:", payload.imageUrl);
        throw new Error('Invalid image URL format');
      }
      
      // Add image processing timestamp
      payload.imageProcessedAt = new Date().toISOString();
      console.log("[FormService] Image processed at:", payload.imageProcessedAt);
    }

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

  async getAllFormsForUser(sequelize: any, tenant: string, targetUserId: number) {
    const span = trace.getActiveSpan();
    span?.setAttribute('app.tenant', tenant);
    span?.setAttribute('app.target.user.id', targetUserId);

    return await FormRepository.getAllFormsForUser(sequelize, tenant, targetUserId);
  }
}
export default new FormService();
