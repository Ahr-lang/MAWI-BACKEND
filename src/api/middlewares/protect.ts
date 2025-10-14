// Combined middleware for common protections
import verifyApiKey from "./common/verifyApiKey";
import tenantRateLimit from "./common/rateLimit";
import { useTenant } from "./common/tenant";
import { validateRequest } from "./common/validation";
import { ensureAuthenticated } from "./common/auth";

// Array of common middlewares applied to all protected routes
export const protect = [verifyApiKey, tenantRateLimit, useTenant, validateRequest];

// Array of middlewares for authenticated routes (includes basic protection + auth), solo log in y register no deberian ocuparla ya que en esas rutas no se necesita auth porque no se tiene aun
export const protectAuth = [...protect, ensureAuthenticated];