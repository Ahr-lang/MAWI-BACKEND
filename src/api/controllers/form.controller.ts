import { Request, Response } from 'express';
import { trace, SpanStatusCode } from '@opentelemetry/api';
import FormService from '../../services/form.service';
import { formSubmissions } from '../../server';

export async function createSubmission(req: any, res: Response) {
  const span = trace.getActiveSpan();
  span?.setAttribute('operation', 'form.submission');
  span?.setAttribute('tenant', req.tenant);
  span?.setAttribute('form.key', req.params.formKey);

  const sequelize = req.sequelize;
  const tenant = req.tenant as string;
  const { formKey } = req.params;
  const payload = req.body || {};
  const userId = req.user?.id;

  try {
    span?.addEvent('Creating form submission');

    const created = await FormService.createSubmission(sequelize, tenant, formKey, payload, userId);

    span?.setAttribute('submission.id', created.id);
    span?.addEvent('Form submission created successfully');

    // Increment form submission counter
    formSubmissions.labels(formKey, tenant).inc();

    return res.status(201).json({
      message: "Submission created",
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
    console.error("[FormSubmission] Error:", err);
    return res.status(500).json({ error: "Server error during submission" });
  }
}



export async function getUserForms(req: any, res: Response) {
  const span = trace.getActiveSpan();
  span?.setAttribute('operation', 'form.getUserForms');
  span?.setAttribute('tenant', req.tenant);
  span?.setAttribute('form.key', req.params.formKey);

  const sequelize = req.sequelize;
  const tenant = req.tenant as string;
  const { formKey } = req.params;
  const userId = req.user?.id;

  try {
    span?.addEvent('Getting user forms');

    const forms = await FormService.getUserForms(sequelize, tenant, formKey, userId);

    span?.setAttribute('forms.count', forms.length);
    span?.addEvent('User forms retrieved successfully');

    return res.status(200).json({
      message: forms.length === 0 ? 'No se encontraron formularios de este tipo para este usuario' : 'Formularios del usuario obtenidos exitosamente',
      tenant,
      formKey,
      userId,
      data: forms,
      count: forms.length
    });
  } catch (err: any) {
    span?.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
    span?.recordException(err);

    if (err.status) return res.status(err.status).json({ error: err.message });
    console.error('[GetUserForms] Error:', err);
    return res.status(500).json({ error: 'Server error getting forms' });
  }
}

export async function getFormById(req: any, res: Response) {
  const span = trace.getActiveSpan();
  span?.setAttribute('operation', 'form.getById');
  span?.setAttribute('tenant', req.tenant);
  span?.setAttribute('form.key', req.params.formKey);
  span?.setAttribute('form.id', req.params.formId);

  const sequelize = req.sequelize;
  const tenant = req.tenant as string;
  const { formKey, formId } = req.params;

  try {
    span?.addEvent('Getting form by ID');

    const form = await FormService.getFormById(sequelize, tenant, formKey, parseInt(formId));

    if (!form) {
      span?.addEvent('Form not found');
      return res.status(404).json({ error: 'Form not found' });
    }

    span?.addEvent('Form retrieved successfully');

    return res.status(200).json({
      message: 'Form retrieved',
      tenant,
      formKey,
      data: form
    });
  } catch (err: any) {
    span?.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
    span?.recordException(err);

    if (err.status) return res.status(err.status).json({ error: err.message });
    console.error('[GetFormById] Error:', err);
    return res.status(500).json({ error: 'Server error getting form' });
  }
}

export async function updateForm(req: any, res: Response) {
  const span = trace.getActiveSpan();
  span?.setAttribute('operation', 'form.update');
  span?.setAttribute('tenant', req.tenant);
  span?.setAttribute('form.key', req.params.formKey);
  span?.setAttribute('form.id', req.params.formId);

  const sequelize = req.sequelize;
  const tenant = req.tenant as string;
  const { formKey, formId } = req.params;
  const payload = req.body || {};

  try {
    span?.addEvent('Updating form');

    const updated = await FormService.updateForm(sequelize, tenant, formKey, parseInt(formId), payload);

    span?.addEvent('Form updated successfully');

    return res.status(200).json({
      message: 'Form updated',
      tenant,
      formKey,
      data: updated
    });
  } catch (err: any) {
    span?.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
    span?.recordException(err);

    if (err.status) return res.status(err.status).json({ error: err.message });
    if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: err.message, details: err.errors });
    }
    console.error('[UpdateForm] Error:', err);
    return res.status(500).json({ error: 'Server error updating form' });
  }
}

export async function deleteForm(req: any, res: Response) {
  const span = trace.getActiveSpan();
  span?.setAttribute('operation', 'form.delete');
  span?.setAttribute('tenant', req.tenant);
  span?.setAttribute('form.key', req.params.formKey);
  span?.setAttribute('form.id', req.params.formId);

  const sequelize = req.sequelize;
  const tenant = req.tenant as string;
  const { formKey, formId } = req.params;

  try {
    span?.addEvent('Deleting form');

    const deleted = await FormService.deleteForm(sequelize, tenant, formKey, parseInt(formId));

    if (!deleted) {
      span?.addEvent('Form not found');
      return res.status(404).json({ error: 'Form not found' });
    }

    span?.addEvent('Form deleted successfully');

    return res.status(200).json({
      message: 'Form deleted',
      tenant,
      formKey,
      formId
    });
  } catch (err: any) {
    span?.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
    span?.recordException(err);

    if (err.status) return res.status(err.status).json({ error: err.message });
    console.error('[DeleteForm] Error:', err);
    return res.status(500).json({ error: 'Server error deleting form' });
  }
}

export async function getAllUserForms(req: any, res: Response) {
  const span = trace.getActiveSpan();
  span?.setAttribute('operation', 'form.getAllUserForms');
  span?.setAttribute('tenant', req.tenant);

  const sequelize = req.sequelize;
  const tenant = req.tenant as string;
  const userId = req.user?.id;

  try {
    span?.addEvent('Getting all user forms');

    const forms = await FormService.getAllUserForms(sequelize, tenant, userId);

    span?.setAttribute('forms.count', forms.length);
    span?.addEvent('All user forms retrieved successfully');

    return res.status(200).json({
      message: forms.length === 0 ? 'No se encontraron formularios para este usuario' : 'Todos los formularios del usuario obtenidos exitosamente',
      tenant,
      userId,
      data: forms,
      count: forms.length
    });
  } catch (err: any) {
    span?.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
    span?.recordException(err);

    if (err.status) return res.status(err.status).json({ error: err.message });
    console.error('[GetAllUserForms] Error:', err);
    return res.status(500).json({ error: 'Server error getting forms' });
  }
}
