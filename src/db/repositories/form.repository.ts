class FormRepository {

  // Normalize form key (formulario1 -> 1, 1 -> 1, etc.)
  private normalize(formKey: string): number {
    const k = (formKey || '').toLowerCase();
    const n = k.startsWith('formulario') ? k.replace('formulario','') : k;
    const num = Number(n);
    if (!Number.isInteger(num) || num < 1 || num > 7) {
      const e: any = new Error('Invalid formKey (allowed: 1..7 or formulario1..7)');
      e.status = 400; throw e;
    }
    return num;
  }

  // Get model name for biomo/robo forms
  private getFormModelName(tenant: string, num: number): string {
    switch (tenant) {
      case 'biomo': return `BIOMO_FORM_${num}`;
      case 'robo':  return `ROBO_FORM_${num}`;
      default: throw Object.assign(new Error('Invalid tenant for numbered forms'), { status: 400 });
    }
  }

  // Insert data into specific form table
  async insert(sequelize: any, tenant: string, formKey: string, data: any, userId?: number) {
    // Ensure userId is included in data for user-owned forms
    if (userId && !data.id_usuario) {
      data.id_usuario = userId;
    }

    if (tenant === 'agromo') {
      // For agromo, we need to handle the complex form structure
      // For now, let's assume formKey specifies which sub-form or main form
      if (formKey === 'formulario' || formKey === '1') {
        const Model = sequelize.models['AGROMO_FORMULARIO'];
        if (!Model) throw Object.assign(new Error('AGROMO_FORMULARIO model not found'), { status: 500 });
        const created = await Model.create(data);
        return { ...created.toJSON(), __tenant: tenant, __form: 'formulario' };
      } else {
        throw Object.assign(new Error('Agromo forms need specific implementation'), { status: 400 });
      }
    } else {
      // For biomo/robo, use numbered forms
      const num = this.normalize(formKey);
      const modelName = this.getFormModelName(tenant, num);
      const Model = sequelize.models[modelName];
      if (!Model) {
        const e: any = new Error(`Model ${modelName} not found for tenant=${tenant}`);
        e.status = 500; throw e;
      }
      const created = await Model.create(data);
      return { ...created.toJSON(), __tenant: tenant, __form: num };
    }
  }

  // Get forms by user
  async getByUser(sequelize: any, tenant: string, formKey: string, userId: number) {
    if (tenant === 'agromo') {
      // For agromo, get from formulario table
      const Model = sequelize.models['AGROMO_FORMULARIO'];
      if (!Model) throw Object.assign(new Error('AGROMO_FORMULARIO model not found'), { status: 500 });

      const forms = await Model.findAll({
        where: { id_agricultor: userId }, // Assuming id_agricultor is the user reference
        include: [
          { model: sequelize.models['AGROMO_AGRICULTOR'], as: 'agricultor' },
          { model: sequelize.models['AGROMO_CULTIVO'], as: 'cultivo' },
          { model: sequelize.models['AGROMO_CONDICIONES_CLIMATICAS'], as: 'condiciones' },
          { model: sequelize.models['AGROMO_DETALLES_QUIMICOS'], as: 'quimicos' },
          { model: sequelize.models['AGROMO_FOTOGRAFIA'], as: 'fotos' }
        ]
      });
      return forms.map((f: any) => ({ ...f.toJSON(), __tenant: tenant, __form: 'formulario' }));
    } else {
      // For biomo/robo
      const num = this.normalize(formKey);
      const modelName = this.getFormModelName(tenant, num);
      const Model = sequelize.models[modelName];
      if (!Model) throw Object.assign(new Error(`Model ${modelName} not found`), { status: 500 });

      const forms = await Model.findAll({
        where: { id_usuario: userId }
      });
      return forms.map((f: any) => ({ ...f.toJSON(), __tenant: tenant, __form: num }));
    }
  }

  // Get specific form by ID
  async getById(sequelize: any, tenant: string, formKey: string, formId: number) {
    if (tenant === 'agromo') {
      const Model = sequelize.models['AGROMO_FORMULARIO'];
      if (!Model) throw Object.assign(new Error('AGROMO_FORMULARIO model not found'), { status: 500 });

      const form = await Model.findByPk(formId, {
        include: [
          { model: sequelize.models['AGROMO_AGRICULTOR'], as: 'agricultor' },
          { model: sequelize.models['AGROMO_CULTIVO'], as: 'cultivo' },
          { model: sequelize.models['AGROMO_CONDICIONES_CLIMATICAS'], as: 'condiciones' },
          { model: sequelize.models['AGROMO_DETALLES_QUIMICOS'], as: 'quimicos' },
          { model: sequelize.models['AGROMO_FOTOGRAFIA'], as: 'fotos' }
        ]
      });
      return form ? { ...form.toJSON(), __tenant: tenant, __form: 'formulario' } : null;
    } else {
      const num = this.normalize(formKey);
      const modelName = this.getFormModelName(tenant, num);
      const Model = sequelize.models[modelName];
      if (!Model) throw Object.assign(new Error(`Model ${modelName} not found`), { status: 500 });

      const form = await Model.findByPk(formId);
      return form ? { ...form.toJSON(), __tenant: tenant, __form: num } : null;
    }
  }

  // Update form
  async update(sequelize: any, tenant: string, formKey: string, formId: number, data: any) {
    if (tenant === 'agromo') {
      const Model = sequelize.models['AGROMO_FORMULARIO'];
      if (!Model) throw Object.assign(new Error('AGROMO_FORMULARIO model not found'), { status: 500 });

      const [affectedRows] = await Model.update(data, { where: { id_formulario: formId } });
      if (affectedRows === 0) throw Object.assign(new Error('Form not found'), { status: 404 });
      return this.getById(sequelize, tenant, formKey, formId);
    } else {
      const num = this.normalize(formKey);
      const modelName = this.getFormModelName(tenant, num);
      const Model = sequelize.models[modelName];
      if (!Model) throw Object.assign(new Error(`Model ${modelName} not found`), { status: 500 });

      const [affectedRows] = await Model.update(data, { where: { id: formId } });
      if (affectedRows === 0) throw Object.assign(new Error('Form not found'), { status: 404 });
      return this.getById(sequelize, tenant, formKey, formId);
    }
  }

  // Delete form
  async delete(sequelize: any, tenant: string, formKey: string, formId: number) {
    if (tenant === 'agromo') {
      const Model = sequelize.models['AGROMO_FORMULARIO'];
      if (!Model) throw Object.assign(new Error('AGROMO_FORMULARIO model not found'), { status: 500 });

      const deleted = await Model.destroy({ where: { id_formulario: formId } });
      return deleted > 0;
    } else {
      const num = this.normalize(formKey);
      const modelName = this.getFormModelName(tenant, num);
      const Model = sequelize.models[modelName];
      if (!Model) throw Object.assign(new Error(`Model ${modelName} not found`), { status: 500 });

      const deleted = await Model.destroy({ where: { id: formId } });
      return deleted > 0;
    }
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
}

export default new FormRepository();
