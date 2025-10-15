// Lista de API keys por tenant (en producción, usar DB o env vars)
export const TENANT_API_KEYS: Record<string, string> = {
  agromo: 'agromo-key-123',
  biomo: 'biomo-key-456',
  robo: 'robo-key-789',
  back: 'back-key-000',
};

// Middleware para verificar API key y setear tenant
function verifyApiKey(req: any, res: any, next: any) {
  // Support both 'apikey' and legacy 'x-api-key' header names
  const apiKey = req.headers['apikey'] || req.headers['x-api-key'];
  if (!apiKey) {
    return res.status(401).json({ error: 'API key requerida' });
  }

  // Busca el tenant por API key
  const tenant = Object.keys(TENANT_API_KEYS).find(t => TENANT_API_KEYS[t] === apiKey);
  if (!tenant) {
    return res.status(403).json({ error: 'API key inválida' });
  }

  // Excepción para rutas de administración: usuarios del tenant "back" pueden usar su API key
  // para acceder a datos de otros tenants
  const isAdminRoute = req.path.includes('/admin/');
  const isBackTenantApiKey = tenant === 'back';

  if (isAdminRoute && isBackTenantApiKey) {
    // Para rutas de admin con API key del tenant "back", permitimos acceder a cualquier tenant
    // El tenant real se determina por la URL, no por la API key
    req.tenant = req.params.tenant;
    return next();
  }

  // Verifica que coincida con el tenant de la URL (para rutas normales)
  if (req.params.tenant && req.params.tenant !== tenant) {
    return res.status(403).json({ error: 'API key no coincide con tenant' });
  }

  req.tenant = tenant; // Setea tenant para middlewares posteriores
  next();
}

export default verifyApiKey;