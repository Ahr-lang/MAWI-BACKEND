class FormRepository {
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
  private modelName(tenant: string, num: number) {
    switch (tenant) {
      case 'agromo': return `AGROMO_FORM_${num}`;
      case 'biomo':  return `BIOMO_FORM_${num}`;
      case 'robo':   return `ROBO_FORM_${num}`;
      default: throw Object.assign(new Error('Invalid tenant'), { status: 400 });
    }
  }
  async insert(sequelize: any, tenant: string, formKey: string, data: any) {
    const num = this.normalize(formKey);
    const name = this.modelName(tenant, num);
    const Model = sequelize.models[name];
    if (!Model) {
      const e: any = new Error(`Model ${name} not found for tenant=${tenant}`);
      e.status = 500; throw e;
    }
    const created = await Model.create(data);
    const out = created.toJSON();
    (out as any).__tenant = tenant;
    (out as any).__form = num;
    return out;
  }
}
export default new FormRepository();
