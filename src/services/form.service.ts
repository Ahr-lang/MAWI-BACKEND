// src/services/form.service.ts
import { trace } from '@opentelemetry/api';
import FormRepository from '../db/repositories/form.repository';

class FormService {
  async createSubmission(sequelize: any, tenant: string, formKey: string, payload: any) {
    const span = trace.getActiveSpan();
    span?.setAttribute('app.tenant', tenant);
    span?.setAttribute('app.form.key', formKey);

    return await FormRepository.insert(sequelize, tenant, formKey, payload);
  }
}
export default new FormService();
