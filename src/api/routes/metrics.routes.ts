// Metrics routes for accessing Prometheus data
import { Router } from "express";
import { protectAuth } from "../middlewares/protect";
import { ensureBackendUser } from "../middlewares/common/backendAuth";
import { getOnlineUsers, getTotalOnlineUsersController } from "../controllers/metrics.controller";

const router = Router();

// Admin-only middlewares (same as admin routes)
const adminAuth = [...protectAuth, ensureBackendUser];

// Get online users per tenant (admin only)
router.get("/metrics/online-users", ...adminAuth, getOnlineUsers);

// Get total online users across all tenants (admin only)
router.get("/metrics/online-users/total", ...adminAuth, getTotalOnlineUsersController);

export default router;