import { Request, Response } from 'express';

const PROMETHEUS_URL = process.env.PROMETHEUS_URL || 'http://prometheus:9090';

/**
 * Query Prometheus for online users per tenant
 */
export async function getOnlineUsersByTenant(req: Request, res: Response) {
  try {
    const query = encodeURIComponent('sum by (tenant) (online_users)');
    const url = `${PROMETHEUS_URL}/api/v1/query?query=${query}`;

    const response = await fetch(url);
    const data: any = await response.json();

    if (data.status !== 'success') {
      return res.status(500).json({ error: 'Failed to query Prometheus' });
    }

    // Transform the response to a more usable format
    const onlineUsers = data.data.result.map((item: any) => ({
      tenant: item.metric.tenant,
      onlineUsers: parseFloat(item.value[1])
    }));

    return res.json({
      success: true,
      data: onlineUsers,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error querying Prometheus:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Get total online users across all tenants
 */
export async function getTotalOnlineUsers(req: Request, res: Response) {
  try {
    const query = encodeURIComponent('sum(online_users)');
    const url = `${PROMETHEUS_URL}/api/v1/query?query=${query}`;

    const response = await fetch(url);
    const data: any = await response.json();

    if (data.status !== 'success') {
      return res.status(500).json({ error: 'Failed to query Prometheus' });
    }

    const totalOnline = data.data.result.length > 0 ? parseFloat(data.data.result[0].value[1]) : 0;

    return res.json({
      success: true,
      data: { totalOnlineUsers: totalOnline },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error querying Prometheus:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}