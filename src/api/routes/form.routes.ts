// src/api/routes/form.routes.ts
import { Router } from 'express';
import { createSubmission } from '../controllers/form.controller';
import { useTenant } from "../middlewares/tenant";
import verifyApiKey from "../middlewares/verifyApiKey";
import tenantRateLimit from "../middlewares/rateLimit";
import { validateRequest } from "../middlewares/validation";
import { ensureAuthenticated } from '../controllers/user.controller';

const router = Router();

router.post("/:tenant/forms/:formKey/submission", verifyApiKey, tenantRateLimit, useTenant, validateRequest, ensureAuthenticated, createSubmission);


export default router;