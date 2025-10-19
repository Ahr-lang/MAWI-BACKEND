import { Request, Response } from 'express';
import { getOnlineUsersByTenant, getTotalOnlineUsers } from '../../services/metrics.service';

/**
 * Get online users per tenant
 */
export async function getOnlineUsers(req: Request, res: Response) {
  return getOnlineUsersByTenant(req, res);
}

/**
 * Get total online users across all tenants
 */
export async function getTotalOnlineUsersController(req: Request, res: Response) {
  return getTotalOnlineUsers(req, res);
}