"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TENANT_API_KEYS = void 0;
// Lista de API keys por tenant (en producción, usar DB o env vars)
exports.TENANT_API_KEYS = {
    agromo: 'agromo-key-123',
    biomo: 'biomo-key-456',
    robo: 'robo-key-789',
    back: 'back-key-000',
};
// Middleware para verificar API key y setear tenant
function verifyApiKey(req, res, next) {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) {
        return res.status(401).json({ error: 'API key requerida' });
    }
    // Busca el tenant por API key
    const tenant = Object.keys(exports.TENANT_API_KEYS).find(t => exports.TENANT_API_KEYS[t] === apiKey);
    if (!tenant) {
        return res.status(403).json({ error: 'API key inválida' });
    }
    // Verifica que coincida con el tenant de la URL (opcional, pero refuerza)
    if (req.params.tenant && req.params.tenant !== tenant) {
        return res.status(403).json({ error: 'API key no coincide con tenant' });
    }
    req.tenant = tenant; // Setea tenant para middlewares posteriores
    next();
}
exports.default = verifyApiKey;
//# sourceMappingURL=verifyApiKey.js.map