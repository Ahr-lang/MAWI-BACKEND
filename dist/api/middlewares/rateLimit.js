"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
// Middleware de rate limiting por tenant e IP
const tenantRateLimit = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // Máximo 100 requests por ventana por tenant + IP
    keyGenerator: (req) => `${req.params.tenant || 'unknown'}:${req.ip}`,
    message: {
        error: 'Demasiadas requests para este tenant desde esta IP. Intenta más tarde.'
    },
    standardHeaders: true, // Incluye headers RateLimit
    legacyHeaders: false,
});
exports.default = tenantRateLimit;
//# sourceMappingURL=rateLimit.js.map