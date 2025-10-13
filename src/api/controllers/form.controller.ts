import { Request, Response } from 'express';
import { trace, SpanStatusCode } from '@opentelemetry/api';
import FormService from '../../services/form.service';

export async function createSubmission(req: any, res: Response) {
  const span = trace.getActiveSpan();
  span?.setAttribute('operation', 'form.submission');
  span?.setAttribute('tenant', req.tenant);
  span?.setAttribute('form.key', req.params.formKey);

  const sequelize = req.sequelize;
  const tenant = req.tenant as string;
  const { formKey } = req.params;
  const payload = req.body || {};

  try {
    span?.addEvent('Creating form submission');
    
    const created = await FormService.createSubmission(sequelize, tenant, formKey, payload);
    
    span?.setAttribute('submission.id', created.id);
    span?.addEvent('Form submission created successfully');

    return res.status(201).json({
      message: 'Submission created',
      tenant,
      formKey,
      data: created,
    });
  } catch (err: any) {
    span?.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
    span?.recordException(err);
    
    if (err.status) return res.status(err.status).json({ error: err.message });
    if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: err.message, details: err.errors });
    }
    console.error('[FormSubmission] Error:', err);
    return res.status(500).json({ error: 'Server error during submission' });
  }
}
