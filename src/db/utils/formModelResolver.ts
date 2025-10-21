export function resolveModelName(tenant: string, formKey: string): string {
  const t = String(tenant || "").trim().toLowerCase();
  const k = String(formKey || "").trim().toLowerCase().replace(/\s+/g, "_");

  if (!t) throw Object.assign(new Error("Missing tenant"), { status: 400 });

  if (t === "agromo") {
    // aceptar: "formulario", "formulario1", "1"
    if (k === "formulario" || k === "formulario1" || k === "1") {
      return "AGROMO_FORM_1";
    }
    throw Object.assign(new Error(`Unsupported Agromo formKey '${formKey}'. Use 'formulario' | 'formulario1' | '1'.`), { status: 400 });
  }

  // biomo / robo siguen numerados (1..7)
  const m = k.match(/^\d+$/);
  const n = m ? parseInt(m[0], 10) : NaN;
  if ((t === "biomo" || t === "robo") && Number.isInteger(n) && n >= 1 && n <= 7) {
    return `${t.toUpperCase()}_FORM_${n}`;
  }

  throw Object.assign(new Error(`Unsupported tenant '${tenant}'.`), { status: 400 });
}
