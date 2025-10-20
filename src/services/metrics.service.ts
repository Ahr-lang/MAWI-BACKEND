import { Request, Response } from 'express';
import { formsPerTenant } from '../telemetry/metrics';
import { Sequelize } from 'sequelize';
import { getSequelize } from '../db/index';

const PROMETHEUS_URL = process.env.PROMETHEUS_URL!; // make it required

function assertPromURL() {
  if (!PROMETHEUS_URL) throw new Error('PROMETHEUS_URL is not set');
}

/**
 * Query Prometheus for online users per tenant
 */
export async function getOnlineUsersByTenantData() {
  assertPromURL();
  const query = encodeURIComponent('sum by (tenant) (online_users)');
  const url = `${PROMETHEUS_URL}/api/v1/query?query=${query}`;

  const resp = await fetch(url);
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Prometheus HTTP ${resp.status}: ${text}`);
  }
  const data: any = await resp.json();
  if (data.status !== 'success') {
    throw new Error(`Prometheus returned status=${data.status}`);
  }
  // resultType should be "vector"
  const results = data.data?.result ?? [];
  return results.map((r: any) => ({
    tenant: r.metric?.tenant ?? 'unknown',
    onlineUsers: Number(r.value?.[1] ?? 0),
  }));
}

/**
 * Get total online users across all tenants
 */
export async function getTotalOnlineUsersData() {
  assertPromURL();
  const query = encodeURIComponent('sum(online_users)');
  const url = `${PROMETHEUS_URL}/api/v1/query?query=${query}`;

  const resp = await fetch(url);
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Prometheus HTTP ${resp.status}: ${text}`);
  }
  const data: any = await resp.json();
  if (data.status !== 'success') {
    throw new Error(`Prometheus returned status=${data.status}`);
  }
  return {
    totalOnlineUsers: Number(data.data?.result?.[0]?.value?.[1] ?? 0),
  };
}

/**
 * Get forms count per tenant and form type
 */
export async function getFormsMetricsData() {
  assertPromURL();
  const query = encodeURIComponent('forms_per_tenant_total');
  const url = `${PROMETHEUS_URL}/api/v1/query?query=${query}`;

  const resp = await fetch(url);
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Prometheus HTTP ${resp.status}: ${text}`);
  }
  const data: any = await resp.json();
  if (data.status !== 'success') {
    throw new Error(`Prometheus returned status=${data.status}`);
  }

  const results = data.data?.result ?? [];
  return results.map((r: any) => ({
    tenant: r.metric?.tenant ?? 'unknown',
    form_type: r.metric?.form_type ?? 'unknown',
    count: Number(r.value?.[1] ?? 0),
  }));
}

/**
 * Query Prometheus for error counts by tenant
 */
export async function getErrorsByTenantData() {
  assertPromURL();
  // Query for HTTP errors (5xx status codes) by tenant
  const query = encodeURIComponent('sum by (tenant, status) (rate(http_requests_total{status=~"5.."}[5m]))');
  const url = `${PROMETHEUS_URL}/api/v1/query?query=${query}`;

  const resp = await fetch(url);
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Prometheus HTTP ${resp.status}: ${text}`);
  }
  const data: any = await resp.json();
  if (data.status !== 'success') {
    throw new Error(`Prometheus returned status=${data.status}`);
  }

  const results = data.data?.result ?? [];
  return results.map((r: any) => ({
    tenant: r.metric?.tenant ?? 'unknown',
    status: r.metric?.status ?? 'unknown',
    errorRate: Number(r.value?.[1] ?? 0),
  }));
}

/**
 * Query Prometheus for total errors across all tenants
 */
export async function getTotalErrorsData() {
  assertPromURL();
  // Query for total HTTP errors (5xx) across all tenants
  const query = encodeURIComponent('sum(rate(http_requests_total{status=~"5.."}[5m]))');
  const url = `${PROMETHEUS_URL}/api/v1/query?query=${query}`;

  const resp = await fetch(url);
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Prometheus HTTP ${resp.status}: ${text}`);
  }
  const data: any = await resp.json();
  if (data.status !== 'success') {
    throw new Error(`Prometheus returned status=${data.status}`);
  }
  return {
    totalErrorRate: Number(data.data?.result?.[0]?.value?.[1] ?? 0),
  };
}

/**
 * Query Prometheus for application errors by tenant (if they have custom error metrics)
 */
export async function getApplicationErrorsByTenantData() {
  assertPromURL();
  // Query for application errors (custom metric if exists)
  const query = encodeURIComponent('sum by (tenant) (rate(application_errors_total[5m]))');
  const url = `${PROMETHEUS_URL}/api/v1/query?query=${query}`;

  const resp = await fetch(url);
  if (!resp.ok) {
    const text = await resp.text();
    throw new Error(`Prometheus HTTP ${resp.status}: ${text}`);
  }
  const data: any = await resp.json();
  if (data.status !== 'success') {
    throw new Error(`Prometheus returned status=${data.status}`);
  }

  const results = data.data?.result ?? [];
  return results.map((r: any) => ({
    tenant: r.metric?.tenant ?? 'unknown',
    applicationErrors: Number(r.value?.[1] ?? 0),
  }));
}

/**
 * Query Prometheus for status page data (requests and errors per hour for last 24 hours)
 */
export async function getStatusPageData() {
  assertPromURL();

  // Get current time and time 24 hours ago
  const end = Math.floor(Date.now() / 1000);
  const start = end - (24 * 60 * 60); // 24 hours ago
  const step = 3600; // 1 hour steps

  // Query for total requests per hour
  const requestsQuery = encodeURIComponent('sum(rate(http_requests_total[1h]))');
  const requestsUrl = `${PROMETHEUS_URL}/api/v1/query_range?query=${requestsQuery}&start=${start}&end=${end}&step=${step}`;

  // Query for error requests per hour (5xx status codes)
  const errorsQuery = encodeURIComponent('sum(rate(http_requests_total{status=~"5.."}[1h]))');
  const errorsUrl = `${PROMETHEUS_URL}/api/v1/query_range?query=${errorsQuery}&start=${start}&end=${end}&step=${step}`;

  const [requestsResp, errorsResp] = await Promise.all([
    fetch(requestsUrl),
    fetch(errorsUrl)
  ]);

  if (!requestsResp.ok || !errorsResp.ok) {
    throw new Error(`Prometheus HTTP error: requests=${requestsResp.status}, errors=${errorsResp.status}`);
  }

  const [requestsData, errorsData] = await Promise.all([
    requestsResp.json(),
    errorsResp.json()
  ]);

  const requestsDataTyped = requestsData as any;
  const errorsDataTyped = errorsData as any;

  if (requestsDataTyped.status !== 'success' || errorsDataTyped.status !== 'success') {
    throw new Error(`Prometheus returned status=${requestsDataTyped.status}/${errorsDataTyped.status}`);
  }

  // Process the time series data
  const requestsSeries = requestsDataTyped.data?.result?.[0]?.values ?? [];
  const errorsSeries = errorsDataTyped.data?.result?.[0]?.values ?? [];

  // Create hourly status data
  const statusData = [];
  for (let i = 0; i < 24; i++) {
    const hourStart = start + (i * 3600);
    const hourEnd = hourStart + 3600;

    // Find data points for this hour
    const requestPoint = requestsSeries.find(([timestamp]: [number, string]) =>
      timestamp >= hourStart && timestamp < hourEnd
    );
    const errorPoint = errorsSeries.find(([timestamp]: [number, string]) =>
      timestamp >= hourStart && timestamp < hourEnd
    );

    const requests = requestPoint ? Number(requestPoint[1]) : 0;
    const errors = errorPoint ? Number(errorPoint[1]) : 0;

    // Calculate error rate
    const errorRate = requests > 0 ? (errors / requests) * 100 : 0;

    // Determine status
    let status: 'green' | 'yellow' | 'red';
    if (requests === 0) {
      status = 'red'; // No activity
    } else if (errorRate < 1) {
      status = 'green'; // < 1% errors
    } else if (errorRate <= 5) {
      status = 'yellow'; // 1-5% errors
    } else {
      status = 'red'; // > 5% errors
    }

    statusData.push({
      hour: i,
      timestamp: hourStart * 1000, // Convert to milliseconds
      requests: Math.round(requests),
      errors: Math.round(errors),
      errorRate: Math.round(errorRate * 100) / 100, // Round to 2 decimal places
      status
    });
  }

  return {
    period: '24h',
    data: statusData
  };
}

/**
 * Service for updating gauge metrics that need to be calculated from database
 */
export class MetricsUpdaterService {
  /**
   * Get the agromo model name for a given form number
   */
  static getAgromoModelForNumber(formNumber: number): string {
    const agromoModels: Record<number, string> = {
      1: 'AGROMO_FORMULARIO',
      2: 'AGROMO_CONDICIONES_CLIMATICAS', 
      3: 'AGROMO_DETALLES_QUIMICOS',
      4: 'AGROMO_FOTOGRAFIA',
      5: 'AGROMO_CHAT_IA'
    };
    return agromoModels[formNumber] || '';
  }

  /**
   * Update the forms per tenant metric by counting forms in the database
   */
  static async updateFormsPerTenantMetrics() {
    try {
      const tenants = ['agromo', 'biomo', 'robo'];

      for (const tenant of tenants) {
        const sequelize = getSequelize(tenant);
        
        // For all tenants, count forms by their numbered types (1-7)
        for (let i = 1; i <= 7; i++) {
          const modelName = tenant === 'agromo' 
            ? MetricsUpdaterService.getAgromoModelForNumber(i)
            : `${tenant.toUpperCase()}_FORM_${i}`;
          
          const count = await sequelize.models[modelName]?.count() || 0;
          formsPerTenant.set({ tenant, form_type: `form_${i}` }, count);
        }
      }

      console.log('✅ Forms per tenant metrics updated');
    } catch (error) {
      console.error('❌ Error updating forms per tenant metrics:', error);
    }
  }

  /**
   * Initialize periodic metrics updates
   */
  static startPeriodicUpdates(intervalMinutes: number = 5) {
    // Update immediately
    this.updateFormsPerTenantMetrics();

    // Then update periodically
    setInterval(() => {
      this.updateFormsPerTenantMetrics();
    }, intervalMinutes * 60 * 1000);

    console.log(`📊 Metrics updates scheduled every ${intervalMinutes} minutes`);
  }
}