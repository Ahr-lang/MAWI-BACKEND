import { resolveModelName } from '../utils/formModelResolver';

class FormRepository {
  // Create
  async insert(
    sequelize: any,
    tenant: string,
    formKey: string,
    data: any,
    userId?: number
  ) {
    if (userId && !data.id_usuario) data.id_usuario = userId;

    const modelName = resolveModelName(tenant, formKey);
    const Model = sequelize.models[modelName];
    if (!Model) {
      throw Object.assign(new Error(`Model '${modelName}' not found for tenant '${tenant}'`), { status: 500 });
    }

    // Extract image data before inserting the main form
    const { imageUrl, imageMetadata, ...formData } = data;

    const created = await Model.create(formData);
    const json = created.toJSON();
    const id = json.id ?? json.id_formulario ?? json.id_condicion ?? json.id_detalle ?? json.id_foto ?? json.id_chat ?? null;

    // Handle image storage for biomo tenant
    if (tenant === 'biomo' && imageUrl) {
      try {
        const ImageModel = sequelize.models['image'];
        if (ImageModel) {
          await ImageModel.create({
            formularioId: id,
            formularioType: modelName,
            imageUri: imageUrl,
            id_usuario: userId
          });
          console.log(`[FormRepository] Image stored for ${modelName} id ${id}`);
        }
      } catch (imageError) {
        console.error('[FormRepository] Failed to store image:', imageError);
        // Don't fail the whole operation if image storage fails
      }
    }

    return { ...json, id, __tenant: tenant, __form: formKey, imageUrl, imageMetadata };
  }

  // Read: by user
  async getByUser(
    sequelize: any,
    tenant: string,
    formKey: string,
    userId: number
  ) {
    const modelName = resolveModelName(tenant, formKey);
    const Model = sequelize.models[modelName];
    if (!Model) {
      throw Object.assign(new Error(`Model '${modelName}' not found for tenant '${tenant}'`), { status: 500 });
    }

    const attrs = Model.rawAttributes ?? {};
    let whereCondition: any = {};
    let includeOptions: any[] = [];

    if (tenant === 'agromo') {
      // If it's the main form, we can include its relations
      if (modelName === 'AGROMO_FORMULARIO') {
        whereCondition = { id_usuario: userId };
        includeOptions = [
          { model: sequelize.models['AGROMO_AGRICULTOR'], as: 'agricultor' },
          { model: sequelize.models['AGROMO_CULTIVO'], as: 'cultivo' },
          { model: sequelize.models['AGROMO_CONDICIONES_CLIMATICAS'], as: 'condiciones' },
          { model: sequelize.models['AGROMO_DETALLES_QUIMICOS'], as: 'quimicos' },
          { model: sequelize.models['AGROMO_FOTOGRAFIA'], as: 'fotos' }
        ];
      } else {
        // Child tables (condiciones/quimicos/fotografia/chat) don't have id_usuario.
        // They do have id_formulario: filter by the user's formulario IDs.
        if ('id_formulario' in attrs) {
          const Formulario = sequelize.models['AGROMO_FORMULARIO'];
          const forms = await Formulario.findAll({
            where: { id_usuario: userId },
            attributes: ['id_formulario']
          });
          const ids = forms.map((f: any) => f.get('id_formulario'));
          whereCondition = ids.length ? { id_formulario: ids } : { id_formulario: -1 }; // no results if empty
        } else if ('id_usuario' in attrs) {
          whereCondition = { id_usuario: userId };
        }
      }
    } else if (tenant === 'biomo') {
      // biomo — all numbered forms have id_usuario
      if ('id_usuario' in attrs) whereCondition = { id_usuario: userId };
    }

    const rows = await Model.findAll({ 
      where: whereCondition, 
      include: [
        ...includeOptions,
        // Include images for biomo forms
        ...(tenant === 'biomo' ? [{
          model: sequelize.models['image'],
          as: 'images',
          where: { formularioType: modelName },
          required: false
        }] : [])
      ]
    });
    return rows.map((f: any) => ({ ...f.toJSON(), __tenant: tenant, __form: formKey }));
  }

  // Read: by id
  async getById(
    sequelize: any,
    tenant: string,
    formKey: string,
    formId: number
  ) {
    const modelName = resolveModelName(tenant, formKey);
    const Model = sequelize.models[modelName];
    if (!Model) {
      throw Object.assign(new Error(`Model '${modelName}' not found for tenant '${tenant}'`), { status: 500 });
    }

    const includeOptions =
      tenant === 'agromo' && modelName === 'AGROMO_FORMULARIO'
        ? [
            { model: sequelize.models['AGROMO_AGRICULTOR'], as: 'agricultor' },
            { model: sequelize.models['AGROMO_CULTIVO'], as: 'cultivo' },
            { model: sequelize.models['AGROMO_CONDICIONES_CLIMATICAS'], as: 'condiciones' },
            { model: sequelize.models['AGROMO_DETALLES_QUIMICOS'], as: 'quimicos' },
            { model: sequelize.models['AGROMO_FOTOGRAFIA'], as: 'fotos' }
          ]
        : tenant === 'biomo'
        ? [{
            model: sequelize.models['image'],
            as: 'images',
            where: { formularioType: modelName },
            required: false
          }]
        : [];

    const pk = Model.primaryKeyAttribute || 'id';
    const row = await Model.findOne({ where: { [pk]: formId }, include: includeOptions });
    return row ? { ...row.toJSON(), __tenant: tenant, __form: formKey } : null;
  }

  // Update
  async update(
    sequelize: any,
    tenant: string,
    formKey: string,
    formId: number,
    data: any
  ) {
    const modelName = resolveModelName(tenant, formKey);
    const Model = sequelize.models[modelName];
    if (!Model) {
      throw Object.assign(new Error(`Model '${modelName}' not found for tenant '${tenant}'`), { status: 500 });
    }

    const pk = Model.primaryKeyAttribute || (tenant === 'agromo' ? 'id_formulario' : 'id');
    const [affectedRows] = await Model.update(data, { where: { [pk]: formId } });
    if (affectedRows === 0) {
      throw Object.assign(new Error('Form not found or no changes made'), { status: 404 });
    }

    return await this.getById(sequelize, tenant, formKey, formId);
  }

  // Delete
  async delete(
    sequelize: any,
    tenant: string,
    formKey: string,
    formId: number
  ) {
    const modelName = resolveModelName(tenant, formKey);
    const Model = sequelize.models[modelName];
    if (!Model) {
      throw Object.assign(new Error(`Model '${modelName}' not found for tenant '${tenant}'`), { status: 500 });
    }

    const pk = Model.primaryKeyAttribute || (tenant === 'agromo' ? 'id_formulario' : 'id');
    const deleted = await Model.destroy({ where: { [pk]: formId } });
    return deleted > 0;
  }

  // List all forms for a user (across all types for the tenant)
  async getAllUserForms(sequelize: any, tenant: string, userId: number) {
    const out: any[] = [];
    if (tenant === 'agromo') {
      // Fetch all Agromo models for this user
      const keys = [
        'formulario',
        'condiciones_climaticas',
        'detalles_quimicos',
        'fotografia',
        'chat_ia'
      ];
      for (const k of keys) {
        try {
          const rows = await this.getByUser(sequelize, tenant, k, userId);
          out.push(...rows);
        } catch {
          // ignore missing models or tables
        }
      }
    } else if (tenant === 'biomo' || tenant === 'robo') {
      for (let i = 1; i <= 7; i++) {
        try {
          const rows = await this.getByUser(sequelize, tenant, String(i), userId);
          out.push(...rows);
        } catch {
          // ignore missing
        }
      }
    } else {
      throw Object.assign(new Error(`Unsupported tenant '${tenant}'`), { status: 400 });
    }
    return out;
  }

  // Admin helper (alias)
  async getAllFormsForUser(sequelize: any, tenant: string, targetUserId: number) {
    return this.getAllUserForms(sequelize, tenant, targetUserId);
  }
}

export default new FormRepository();
