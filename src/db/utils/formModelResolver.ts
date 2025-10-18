export function resolveModelName(tenant: string, formKey: string): string {
  const t = String(tenant || "").trim().toLowerCase();
  const k = String(formKey || "").trim().toLowerCase().replace(/\s+/g, "_");

  if (t === "agromo") {
    const agromoMap: Record<string, string> = {
      // Main form
      formulario: "AGROMO_FORMULARIO",
      "1": "AGROMO_FORMULARIO",

      // Condiciones Climáticas
      condiciones_climaticas: "AGROMO_CONDICIONES_CLIMATICAS",
      condiciones: "AGROMO_CONDICIONES_CLIMATICAS",
      clima: "AGROMO_CONDICIONES_CLIMATICAS",
      "2": "AGROMO_CONDICIONES_CLIMATICAS",

      // Detalles Químicos
      detalles_quimicos: "AGROMO_DETALLES_QUIMICOS",
      quimicos: "AGROMO_DETALLES_QUIMICOS",
      "3": "AGROMO_DETALLES_QUIMICOS",

      // Fotografía
      fotografia: "AGROMO_FOTOGRAFIA",
      foto: "AGROMO_FOTOGRAFIA",
      "4": "AGROMO_FOTOGRAFIA",

      // Chat IA
      chat_ia: "AGROMO_CHAT_IA",
      chat: "AGROMO_CHAT_IA",
      "5": "AGROMO_CHAT_IA",
    };

    const model = agromoMap[k];
    if (!model) {
      throw Object.assign(
        new Error(
          `Unsupported Agromo formKey '${formKey}'. Valid keys: formulario|1, condiciones_climaticas|2, detalles_quimicos|3, fotografia|4, chat_ia|5`
        ),
        { status: 400 }
      );
    }
    return model;
  }

  if (t === "biomo" || t === "robo") {
    const numMatch = k.match(/\d+/);
    const n = numMatch ? parseInt(numMatch[0]) : NaN;
    if (!Number.isInteger(n) || n < 1 || n > 7) {
      throw Object.assign(
        new Error(
          `Unsupported ${tenant} formKey '${formKey}'. Expected a number 1–7.`
        ),
        { status: 400 }
      );
    }
    return `${t.toUpperCase()}_FORM_${n}`;
  }

  throw Object.assign(new Error(`Unsupported tenant '${tenant}'.`), { status: 400 });
}
