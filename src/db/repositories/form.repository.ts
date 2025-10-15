class FormRepository {

  // Normalize form key (formulario1 -> 1, 1 -> 1, etc.)
  private normalize(formKey: string): string {
    const k = (formKey || '').toLowerCase();
    const n = k.startsWith('formulario') ? k.replace('formulario','') : k;
    const num = Number(n);
    if (!Number.isInteger(num) || num < 1 || num > 7) {
     return k;
    }
    return n;
  }

  // Insert data into specific form table
  async insert(sequelize: any, tenant: string, formKey: string, data: any, userId?: number) {
    // Ensure userId is included in data for user-owned forms
    if (userId && !data.id_usuario) {
      data.id_usuario = userId;
    }

    // Generic approach: try to find the appropriate model based on tenant and formKey
    let modelName: string;

    if (tenant === 'agromo') {
      // Agromo uses 'formulario' as the main form
      if (formKey === 'formulario' || formKey === '1') {
        modelName = 'AGROMO_FORMULARIO';
      } else {
        throw Object.assign(new Error(`Unsupported formKey '${formKey}' for tenant '${tenant}'`), { status: 400 });
      }
    } else if (tenant === 'biomo' || tenant === 'robo') {
      // Biomo/Robo use numbered forms (1-7)
      const num = this.normalize(formKey);
      modelName = `${tenant.toUpperCase()}_FORM_${num}`;
    } else {
      throw Object.assign(new Error(`Unsupported tenant '${tenant}'`), { status: 400 });
    }

    const Model = sequelize.models[modelName];
    if (!Model) {
      throw Object.assign(new Error(`Model '${modelName}' not found for tenant '${tenant}'`), { status: 500 });
    }

    const created = await Model.create(data);
    return { ...created.toJSON(), __tenant: tenant, __form: formKey };
  }

  // Get forms by user
  async getByUser(sequelize: any, tenant: string, formKey: string, userId: number) {
    let modelName: string;
    let whereCondition: any;
    let includeOptions: any[] = [];

    if (tenant === 'agromo') {
      // Agromo has complex relationships and uses id_usuario
      modelName = 'AGROMO_FORMULARIO';
      whereCondition = { id_usuario: userId };
      includeOptions = [
        { model: sequelize.models['AGROMO_AGRICULTOR'], as: 'agricultor' },
        { model: sequelize.models['AGROMO_CULTIVO'], as: 'cultivo' },
        { model: sequelize.models['AGROMO_CONDICIONES_CLIMATICAS'], as: 'condiciones' },
        { model: sequelize.models['AGROMO_DETALLES_QUIMICOS'], as: 'quimicos' },
        { model: sequelize.models['AGROMO_FOTOGRAFIA'], as: 'fotos' }
      ];
    } else if (tenant === 'biomo' || tenant === 'robo') {
      // Biomo/Robo use numbered forms with id_usuario
      const num = this.normalize(formKey);
      modelName = `${tenant.toUpperCase()}_FORM_${num}`;
      whereCondition = { id_usuario: userId };
    } else {
      throw Object.assign(new Error(`Unsupported tenant '${tenant}'`), { status: 400 });
    }

    const Model = sequelize.models[modelName];
    if (!Model) {
      throw Object.assign(new Error(`Model '${modelName}' not found for tenant '${tenant}'`), { status: 500 });
    }

    const forms = await Model.findAll({
      where: whereCondition,
      include: includeOptions
    });

    return forms.map((f: any) => ({ ...f.toJSON(), __tenant: tenant, __form: formKey }));
  }

  // Get specific form by ID
  async getById(sequelize: any, tenant: string, formKey: string, formId: number) {
    let modelName: string;
    let includeOptions: any[] = [];

    if (tenant === 'agromo') {
      modelName = 'AGROMO_FORMULARIO';
      includeOptions = [
        { model: sequelize.models['AGROMO_AGRICULTOR'], as: 'agricultor' },
        { model: sequelize.models['AGROMO_CULTIVO'], as: 'cultivo' },
        { model: sequelize.models['AGROMO_CONDICIONES_CLIMATICAS'], as: 'condiciones' },
        { model: sequelize.models['AGROMO_DETALLES_QUIMICOS'], as: 'quimicos' },
        { model: sequelize.models['AGROMO_FOTOGRAFIA'], as: 'fotos' }
      ];
    } else if (tenant === 'biomo' || tenant === 'robo') {
      const num = this.normalize(formKey);
      modelName = `${tenant.toUpperCase()}_FORM_${num}`;
    } else {
      throw Object.assign(new Error(`Unsupported tenant '${tenant}'`), { status: 400 });
    }

    const Model = sequelize.models[modelName];
    if (!Model) {
      throw Object.assign(new Error(`Model '${modelName}' not found for tenant '${tenant}'`), { status: 500 });
    }

    const form = await Model.findByPk(formId, { include: includeOptions });
    return form ? { ...form.toJSON(), __tenant: tenant, __form: formKey } : null;
  }

  // Update form
  async update(sequelize: any, tenant: string, formKey: string, formId: number, data: any) {
    let modelName: string;
    let whereClause: any;

    if (tenant === 'agromo') {
      modelName = 'AGROMO_FORMULARIO';
      whereClause = { id_formulario: formId };
    } else if (tenant === 'biomo' || tenant === 'robo') {
      const num = this.normalize(formKey);
      modelName = `${tenant.toUpperCase()}_FORM_${num}`;
      whereClause = { id: formId };
    } else {
      throw Object.assign(new Error(`Unsupported tenant '${tenant}'`), { status: 400 });
    }

    const Model = sequelize.models[modelName];
    if (!Model) {
      throw Object.assign(new Error(`Model '${modelName}' not found for tenant '${tenant}'`), { status: 500 });
    }

    const [affectedRows] = await Model.update(data, { where: whereClause });
    if (affectedRows === 0) {
      throw Object.assign(new Error('Form not found or no changes made'), { status: 404 });
    }

    return await this.getById(sequelize, tenant, formKey, formId);
  }

  // Delete form
  async delete(sequelize: any, tenant: string, formKey: string, formId: number) {
    let modelName: string;
    let whereClause: any;

    if (tenant === 'agromo') {
      modelName = 'AGROMO_FORMULARIO';
      whereClause = { id_formulario: formId };
    } else if (tenant === 'biomo' || tenant === 'robo') {
      const num = this.normalize(formKey);
      modelName = `${tenant.toUpperCase()}_FORM_${num}`;
      whereClause = { id: formId };
    } else {
      throw Object.assign(new Error(`Unsupported tenant '${tenant}'`), { status: 400 });
    }

    const Model = sequelize.models[modelName];
    if (!Model) {
      throw Object.assign(new Error(`Model '${modelName}' not found for tenant '${tenant}'`), { status: 500 });
    }

    const deleted = await Model.destroy({ where: whereClause });
    return deleted > 0;
  }

  // List all forms for a user across all form types
  async getAllUserForms(sequelize: any, tenant: string, userId: number) {
    const results = [];

    if (tenant === 'agromo') {
      // For agromo, get all formulario records for this user
      const forms = await this.getByUser(sequelize, tenant, 'formulario', userId);
      results.push(...forms);
    } else {
      // For biomo/robo, get from all 7 form types
      for (let i = 1; i <= 7; i++) {
        try {
          const forms = await this.getByUser(sequelize, tenant, i.toString(), userId);
          results.push(...forms);
        } catch (error) {
          // Skip if form type doesn't exist or has errors
          continue;
        }
      }
    }

    return results;
  }

  // Get all forms for a specific user (admin function - can specify any userId)
  async getAllFormsForUser(sequelize: any, tenant: string, targetUserId: number) {
    return await this.getAllUserForms(sequelize, tenant, targetUserId);
  }
}

export default new FormRepository();
