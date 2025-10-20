import { Request, Response } from 'express';
import { trace, SpanStatusCode } from '@opentelemetry/api';
import FormService from '../../services/form.service';
import { formSubmissions } from '../../telemetry/metrics';

export async function createSubmission(req: any, res: Response) {
  const span = trace.getActiveSpan();
  span?.setAttribute('app.operation', 'form.submission');
  span?.setAttribute('app.tenant', req.tenant);
  span?.setAttribute('app.form.key', req.params.formKey);

  const sequelize = req.sequelize;
  const tenant = req.tenant as string;
  const { formKey } = req.params;
  const payload = req.body || {};
  const userId = req.user?.id;

  // Add image URL if uploaded
  if ((req as any).imageUrl) {
    payload.imageUrl = (req as any).imageUrl;
    console.log("[FormController] Image URL added to payload:", payload.imageUrl);
    
    // Process image metadata if available
    if (req.file) {
      payload.imageMetadata = {
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        uploadedAt: new Date().toISOString()
      };
      console.log("[FormController] Image metadata added:", payload.imageMetadata);
    }
  } else {
    console.log("[FormController] No image URL found in request");
  }

  try {
    console.log("[FormController] Creating submission with payload:", JSON.stringify(payload, null, 2));
    span?.addEvent('Creating form submission');

    const created = await FormService.createSubmission(sequelize, tenant, formKey, payload, userId);

    // For biomo, images are stored separately in the image table
    // The warning is no longer needed since images are handled properly
    span?.setAttribute('app.submission.id', created.id);
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
  span?.setAttribute('app.operation', 'form.getUserForms');
  span?.setAttribute('app.tenant', req.tenant);
  span?.setAttribute('app.form.key', req.params.formKey);

  const sequelize = req.sequelize;
  const tenant = req.tenant as string;
  const { formKey } = req.params;
  const userId = req.user?.id;

  try {
    span?.addEvent('Getting user forms');

    const forms = await FormService.getUserForms(sequelize, tenant, formKey, userId);

    span?.setAttribute('app.forms.count', forms.length);
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
  span?.setAttribute('app.operation', 'form.getById');
  span?.setAttribute('app.tenant', req.tenant);
  span?.setAttribute('app.form.key', req.params.formKey);
  span?.setAttribute('app.form.id', req.params.formId);

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
  span?.setAttribute('app.operation', 'form.update');
  span?.setAttribute('app.tenant', req.tenant);
  span?.setAttribute('app.form.key', req.params.formKey);
  span?.setAttribute('app.form.id', req.params.formId);

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
  span?.setAttribute('app.operation', 'form.delete');
  span?.setAttribute('app.tenant', req.tenant);
  span?.setAttribute('app.form.key', req.params.formKey);
  span?.setAttribute('app.form.id', req.params.formId);

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
  span?.setAttribute('app.operation', 'form.getAllUserForms');
  span?.setAttribute('app.tenant', req.tenant);

  const sequelize = req.sequelize;
  const tenant = req.tenant as string;
  const userId = req.user?.id;

  try {
    span?.addEvent('Getting all user forms');

    const forms = await FormService.getAllUserForms(sequelize, tenant, userId);

    span?.setAttribute('app.forms.count', forms.length);
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
