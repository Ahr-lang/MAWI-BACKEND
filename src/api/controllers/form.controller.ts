import { Request, Response } from 'express';
import FormService from '../../services/form.service';

export async function createSubmission(req: any, res: Response) {
  const sequelize = req.sequelize;
  const tenant = req.tenant as string;
  const { formKey } = req.params;
  const payload = req.body || {};

  try {
    const created = await FormService.createSubmission(sequelize, tenant, formKey, payload);
    return res.status(201).json({
      message: 'Submission created',
      tenant,
      formKey,
      data: created,
    });
  } catch (err: any) {
    if (err.status) return res.status(err.status).json({ error: err.message });
    if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({ error: err.message, details: err.errors });
    }
    console.error('[FormSubmission] Error:', err);
    return res.status(500).json({ error: 'Server error during submission' });
  }
}
