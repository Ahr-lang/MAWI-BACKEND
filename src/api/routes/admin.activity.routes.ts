import { Router } from 'express';
import { getUserActivityByEmail } from '../controllers/admin.activity.controller';
import { protectAuth } from '../middlewares/protect';
import { ensureBackendUser } from '../middlewares/common/backendAuth';

const router = Router();
const adminAuth = [...protectAuth, ensureBackendUser];

// GET /:tenant/admin/users/email/:email
router.get('/:tenant/admin/users/email/:email', ...adminAuth, getUserActivityByEmail);

export default router;
