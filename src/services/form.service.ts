// src/services/form.service.ts
import { trace } from '@opentelemetry/api';
import FormRepository from '../db/repositories/form.repository';

class FormService {
  async createSubmission(sequelize: any, tenant: string, formKey: string, payload: any, userId?: number) {
    const tracer = trace.getTracer('form-service');
    const span = tracer.startSpan('createSubmission');
    span.setAttribute('operation', 'form.createSubmission');
    span.setAttribute('tenant', tenant);
    span.setAttribute('form.key', formKey);
    if (userId) span.setAttribute('user.id', userId);

    try {
      span.addEvent('Creating form submission');

      const result = await FormRepository.insert(sequelize, tenant, formKey, payload, userId);

      span.setAttribute('submission.id', result.id);
      span.addEvent('Submission created successfully');

      span.end();
      return result;
    } catch (err: any) {
      span.recordException(err);
      span.end();
      throw err;
    }
  }

  async getUserForms(sequelize: any, tenant: string, formKey: string, userId: number) {
    const tracer = trace.getTracer('form-service');
    const span = tracer.startSpan('getUserForms');
    span.setAttribute('operation', 'form.getUserForms');
    span.setAttribute('tenant', tenant);
    span.setAttribute('form.key', formKey);
    span.setAttribute('user.id', userId);

    try {
      span.addEvent('Fetching user forms');

      const forms = await FormRepository.getByUser(sequelize, tenant, formKey, userId);

      span.setAttribute('forms.count', forms.length);
      span.addEvent('User forms fetched successfully');

      span.end();
      return forms;
    } catch (err: any) {
      span.recordException(err);
      span.end();
      throw err;
    }
  }

  async getFormById(sequelize: any, tenant: string, formKey: string, formId: number) {
    const tracer = trace.getTracer('form-service');
    const span = tracer.startSpan('getFormById');
    span.setAttribute('operation', 'form.getFormById');
    span.setAttribute('tenant', tenant);
    span.setAttribute('form.key', formKey);
    span.setAttribute('form.id', formId);

    try {
      span.addEvent('Fetching form by ID');

      const form = await FormRepository.getById(sequelize, tenant, formKey, formId);

      if (form) {
        span.addEvent('Form found');
      } else {
        span.addEvent('Form not found');
      }

      span.end();
      return form;
    } catch (err: any) {
      span.recordException(err);
      span.end();
      throw err;
    }
  }

  async updateForm(sequelize: any, tenant: string, formKey: string, formId: number, payload: any) {
    const tracer = trace.getTracer('form-service');
    const span = tracer.startSpan('updateForm');
    span.setAttribute('operation', 'form.updateForm');
    span.setAttribute('tenant', tenant);
    span.setAttribute('form.key', formKey);
    span.setAttribute('form.id', formId);

    try {
      span.addEvent('Updating form');

      const result = await FormRepository.update(sequelize, tenant, formKey, formId, payload);

      span.addEvent('Form updated successfully');

      span.end();
      return result;
    } catch (err: any) {
      span.recordException(err);
      span.end();
      throw err;
    }
  }

  async deleteForm(sequelize: any, tenant: string, formKey: string, formId: number) {
    const tracer = trace.getTracer('form-service');
    const span = tracer.startSpan('deleteForm');
    span.setAttribute('operation', 'form.deleteForm');
    span.setAttribute('tenant', tenant);
    span.setAttribute('form.key', formKey);
    span.setAttribute('form.id', formId);

    try {
      span.addEvent('Deleting form');

      const result = await FormRepository.delete(sequelize, tenant, formKey, formId);

      if (result) {
        span.addEvent('Form deleted successfully');
      } else {
        span.addEvent('Form not found');
      }

      span.end();
      return result;
    } catch (err: any) {
      span.recordException(err);
      span.end();
      throw err;
    }
  }

  async getAllUserForms(sequelize: any, tenant: string, userId: number) {
    const tracer = trace.getTracer('form-service');
    const span = tracer.startSpan('getAllUserForms');
    span.setAttribute('operation', 'form.getAllUserForms');
    span.setAttribute('tenant', tenant);
    span.setAttribute('user.id', userId);

    try {
      span.addEvent('Fetching all user forms');

      const forms = await FormRepository.getAllUserForms(sequelize, tenant, userId);

      span.setAttribute('forms.count', forms.length);
      span.addEvent('All user forms fetched successfully');

      span.end();
      return forms;
    } catch (err: any) {
      span.recordException(err);
      span.end();
      throw err;
    }
  }

  async getAllFormsForUser(sequelize: any, tenant: string, targetUserId: number) {
    const tracer = trace.getTracer('form-service');
    const span = tracer.startSpan('getAllFormsForUser');
    span.setAttribute('operation', 'form.getAllFormsForUser');
    span.setAttribute('tenant', tenant);
    span.setAttribute('target.user.id', targetUserId);

    try {
      span.addEvent('Fetching all forms for user');

      const forms = await FormRepository.getAllFormsForUser(sequelize, tenant, targetUserId);

      span.setAttribute('forms.count', forms.length);
      span.addEvent('All forms for user fetched successfully');

      span.end();
      return forms;
    } catch (err: any) {
      span.recordException(err);
      span.end();
      throw err;
    }
  }
}
export default new FormService();
