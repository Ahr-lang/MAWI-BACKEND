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

// Database Query Duration Histogram
export const dbQueryDuration = new Histogram({
  name: 'db_query_duration_seconds',
  help: 'Duration of database queries in seconds',
  labelNames: ['operation', 'table', 'tenant', 'query_type', 'user_id'],
});

// Database Connection Pool Gauge
export const dbConnectionPoolSize = new Gauge({
  name: 'db_connection_pool_size',
  help: 'Current size of database connection pool',
  labelNames: ['tenant', 'pool_name'],
});

export const dbConnectionPoolUsed = new Gauge({
  name: 'db_connection_pool_used',
  help: 'Number of used connections in database pool',
  labelNames: ['tenant', 'pool_name'],
});

// External Service Call Duration Histogram
export const externalServiceDuration = new Histogram({
  name: 'external_service_duration_seconds',
  help: 'Duration of external service calls in seconds',
  labelNames: ['service', 'method', 'status', 'operation', 'endpoint'],
});

// Memory Usage Gauge
export const memoryUsage = new Gauge({
  name: 'memory_usage_bytes',
  help: 'Current memory usage in bytes',
  labelNames: ['type', 'process'], // heap_used, heap_total, external, rss
});

// CPU Usage Gauge
export const cpuUsage = new Gauge({
  name: 'cpu_usage_percent',
  help: 'Current CPU usage percentage',
  labelNames: ['process'],
});

// Active Requests Gauge
export const activeRequests = new Gauge({
  name: 'active_requests',
  help: 'Number of currently active HTTP requests',
  labelNames: ['method', 'route', 'tenant', 'user_id'],
});

// Request Queue Length Gauge
export const requestQueueLength = new Gauge({
  name: 'request_queue_length',
  help: 'Number of requests waiting in queue',
  labelNames: ['queue_type', 'priority'],
});

// Database Transaction Duration Histogram
export const dbTransactionDuration = new Histogram({
  name: 'db_transaction_duration_seconds',
  help: 'Duration of database transactions in seconds',
  labelNames: ['tenant', 'operation', 'transaction_type', 'user_id'],
});

// Business Logic Operation Duration Histogram
export const businessLogicDuration = new Histogram({
  name: 'business_logic_duration_seconds',
  help: 'Duration of business logic operations in seconds',
  labelNames: ['operation', 'module', 'tenant', 'user_id'],
});

// Authentication Operation Duration Histogram
export const authOperationDuration = new Histogram({
  name: 'auth_operation_duration_seconds',
  help: 'Duration of authentication operations in seconds',
  labelNames: ['operation', 'method', 'success'],
});

// File Operation Duration Histogram
export const fileOperationDuration = new Histogram({
  name: 'file_operation_duration_seconds',
  help: 'Duration of file operations in seconds',
  labelNames: ['operation', 'file_type', 'size_range', 'user_id'],
});

// API Endpoint Performance Histogram
export const apiEndpointDuration = new Histogram({
  name: 'api_endpoint_duration_seconds',
  help: 'Duration of API endpoint operations in seconds',
  labelNames: ['endpoint', 'method', 'tenant', 'status_code', 'user_id'],
});

// Cache Operation Duration Histogram
export const cacheOperationDuration = new Histogram({
  name: 'cache_operation_duration_seconds',
  help: 'Duration of cache operations in seconds',
  labelNames: ['operation', 'cache_type', 'key_pattern'],
});

// Middleware Performance Histogram
export const middlewareDuration = new Histogram({
  name: 'middleware_duration_seconds',
  help: 'Duration of middleware operations in seconds',
  labelNames: ['middleware', 'route', 'tenant'],
});

// Error Counters by Operation
export const operationErrors = new Counter({
  name: 'operation_errors_total',
  help: 'Total number of errors by operation',
  labelNames: ['operation', 'error_type', 'tenant', 'user_id'],
});

// Process Health Gauge
export const processHealth = new Gauge({
  name: 'process_health_status',
  help: 'Health status of application processes (0=unhealthy, 1=healthy)',
  labelNames: ['process', 'component'],
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