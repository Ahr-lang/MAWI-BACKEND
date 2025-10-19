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

  const vec = data.data?.result ?? [];
  const total = vec.length ? Number(vec[0].value?.[1] ?? 0) : 0;
  return { totalOnlineUsers: total };
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