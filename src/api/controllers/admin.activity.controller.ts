import { Request, Response } from 'express';
import { trace, SpanStatusCode } from '@opentelemetry/api';
import UserService from '../../services/user.service';
import FormService from '../../services/form.service';

// GET /:tenant/admin/users/email/:email
export async function getUserActivityByEmail(req: any, res: Response) {
  const span = trace.getActiveSpan();
  span?.setAttribute('operation', 'admin.getUserActivityByEmail');
  span?.setAttribute('tenant', req.tenant);
  span?.setAttribute('admin.user', req.user?.username);

  const sequelize = req.sequelize;
  const tenant = req.tenant as string;
  const email = (req.params.email || '').toLowerCase();

  try {
    span?.addEvent('Obteniendo usuario por email');

    // Buscar usuario por email en el tenant objetivo
    const user = await UserService.findUserByEmail(sequelize, email);
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado en el tenant especificado' });
    }

    span?.setAttribute('target.user.id', user.id);

    // Obtener todos los formularios que el usuario ha creado en este tenant
    const forms = await FormService.getAllFormsForUser(sequelize, tenant, user.id);

    return res.status(200).json({
      message: forms.length === 0 ? 'No se encontraron formularios para este usuario' : 'Actividad del usuario obtenida exitosamente',
      tenant,
      user,
      data: forms,
      count: forms.length
    });
  } catch (err: any) {
    span?.setStatus({ code: SpanStatusCode.ERROR, message: err.message });
    span?.recordException(err);
    console.error('[AdminGetUserActivity] Error:', err);
    return res.status(500).json({ error: 'Server error getting user activity' });
  }
}
