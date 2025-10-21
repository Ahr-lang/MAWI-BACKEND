import { register, collectDefaultMetrics, Counter, Histogram, Gauge } from 'prom-client';

/* -------------------------------------------------------------------------- */
/*                              PROMETHEUS METRICS                           */
/* -------------------------------------------------------------------------- */

// HTTP Request Duration Histogram
export const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
});

// Form Submissions Counter
export const formSubmissions = new Counter({
  name: 'form_submissions_total',
  help: 'Total number of form submissions',
  labelNames: ['form_type', 'tenant'],
});

// User Registrations Counter
export const userRegistrations = new Counter({
  name: 'user_registrations_total',
  help: 'Total number of user registrations',
});

// Login Attempts Counter
export const loginAttempts = new Counter({
  name: 'login_attempts_total',
  help: 'Total number of login attempts',
  labelNames: ['success'],
});

// Online Users Gauge
export const onlineUsers = new Gauge({
  name: 'online_users',
  help: 'Number of currently authenticated/online users per tenant',
  labelNames: ['tenant'],
});

// User Sessions Counter
export const userSessions = new Counter({
  name: 'user_sessions_total',
  help: 'Total number of user sessions',
  labelNames: ['action', 'tenant'],
});

// Forms per Tenant Gauge
export const formsPerTenant = new Gauge({
  name: 'forms_per_tenant_total',
  help: 'Total number of forms stored per tenant',
  labelNames: ['tenant', 'form_type'],
});

// Initialize default metrics collection
export function initializeMetrics() {
  collectDefaultMetrics();

  // Initialize forms_per_tenant_total so it shows up right away
  ['agromo','biomo','robo'].forEach(t =>
    ['form_1','form_2','form_3','form_4','form_5','form_6','form_7'].forEach(f =>
      formsPerTenant.labels(t, f).set(0)
    )
  );
}

// Export register for metrics endpoint
export { register };