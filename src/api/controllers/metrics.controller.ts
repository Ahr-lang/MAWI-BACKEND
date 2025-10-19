import { Request, Response } from 'express';
import { getOnlineUsersByTenantData, getTotalOnlineUsersData, getFormsMetricsData } from '../../services/metrics.service';

/**
 * Get online users per tenant
 */
export async function getOnlineUsers(req: Request, res: Response) {
  try {
    const data = await getOnlineUsersByTenantData();
    return res.json({
      success: true,
      data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting online users:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Get total online users across all tenants
 */
export async function getTotalOnlineUsersController(req: Request, res: Response) {
  try {
    const data = await getTotalOnlineUsersData();
    return res.json({
      success: true,
      data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting total online users:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Get forms count per tenant and form type
 */
export async function getFormsMetrics(req: Request, res: Response) {
  try {
    const data = await getFormsMetricsData();
    return res.json({
      success: true,
      data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting forms metrics:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}