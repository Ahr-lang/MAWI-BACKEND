// src/services/error-tracking.service.ts
import { Counter } from 'prom-client';
import { operationErrors } from '../telemetry/metrics';

interface TrackedError {
  id: string;
  timestamp: Date;
  tenant: string;
  operation: string;
  errorType: string;
  message: string;
  stack?: string;
  statusCode?: number;
  userId?: string;
  userAgent?: string;
  ip?: string;
  method?: string;
  url?: string;
  context?: Record<string, any>;
}

interface HourlyErrorStats {
  hour: number; // 0-23
  hourTimestamp: number; // Start of the hour in ms
  httpErrors: number;
  appErrors: number;
  totalRequests: number; // Estimated
  errors: TrackedError[]; // Recent errors for this hour
  lastUpdated: Date;
}

class ErrorTrackingService {
  private hourlyStats: Map<number, HourlyErrorStats> = new Map();
  private errors: TrackedError[] = []; // Keep recent errors for detailed view
  private readonly maxErrors = 1000; // Keep last 1k errors for detailed endpoint
  private readonly retentionHours = 24; // Keep errors for 24 hours

  /**
   * Initialize hourly stats (0-23 hours)
   */
  constructor() {
    // Initialize 24 hour slots
    for (let i = 0; i < 24; i++) {
      this.hourlyStats.set(i, {
        hour: i,
        hourTimestamp: 0,
        httpErrors: 0,
        appErrors: 0,
        totalRequests: 0,
        errors: [],
        lastUpdated: new Date(0)
      });
    }
  }

  /**
   * Get the hour slot (0-23) for a given timestamp
   */
  private getHourSlot(timestamp: Date): number {
    return timestamp.getHours();
  }

  /**
   * Get the start of the hour timestamp
   */
  private getHourStart(timestamp: Date): number {
    const hourStart = new Date(timestamp);
    hourStart.setMinutes(0, 0, 0);
    return hourStart.getTime();
  }

  /**
   * Track an error occurrence
   */
  trackError(error: Partial<TrackedError>) {
    const trackedError: TrackedError = {
      id: this.generateId(),
      timestamp: new Date(),
      tenant: error.tenant || 'unknown',
      operation: error.operation || 'unknown',
      errorType: error.errorType || 'application',
      message: error.message || 'Unknown error',
      stack: error.stack,
      statusCode: error.statusCode,
      userId: error.userId,
      userAgent: error.userAgent,
      ip: error.ip,
      method: error.method,
      url: error.url,
      context: error.context
    };

    // Add to recent errors list
    this.errors.push(trackedError);

    // Get the hour slot for this error
    const hourSlot = this.getHourSlot(trackedError.timestamp);
    const hourStart = this.getHourStart(trackedError.timestamp);
    
    const stats = this.hourlyStats.get(hourSlot)!;
    
    // If this is a new hour, reset the stats
    if (stats.hourTimestamp !== hourStart) {
      stats.hourTimestamp = hourStart;
      stats.httpErrors = 0;
      stats.appErrors = 0;
      stats.totalRequests = 0;
      stats.errors = [];
    }

    // Update stats for this hour
    if (trackedError.errorType === 'http') {
      stats.httpErrors++;
    } else {
      stats.appErrors++;
    }
    
    // Keep last 10 errors per hour
    stats.errors.push(trackedError);
    if (stats.errors.length > 10) {
      stats.errors.shift();
    }
    
    stats.totalRequests++; // Increment request count (for now, every error is a request)
    stats.lastUpdated = new Date();

    // Update Prometheus metrics
    operationErrors
      .labels(trackedError.operation, trackedError.errorType, trackedError.tenant, trackedError.userId || 'anonymous')
      .inc();

    // Clean up old errors from the detailed list
    this.cleanupOldErrors();

    // Limit memory usage for detailed errors
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors);
    }

    return trackedError.id;
  }

  /**
   * Get hourly stats for the last 24 hours
   */
  getHourlyStats(tenant?: string): HourlyErrorStats[] {
    const now = new Date();
    const currentHour = now.getHours();
    const stats: HourlyErrorStats[] = [];

    // Build array starting from current hour going back 24 hours
    for (let i = 0; i < 24; i++) {
      // Calculate which hour slot to look at
      // i=0 is current hour, i=1 is previous hour, etc.
      const hourSlot = (currentHour - i + 24) % 24;
      const hourStats = this.hourlyStats.get(hourSlot)!;

      // Filter by tenant if specified
      if (tenant) {
        const filteredErrors = hourStats.errors.filter(e => e.tenant === tenant);
        const filteredStats = {
          ...hourStats,
          errors: filteredErrors,
          httpErrors: filteredErrors.filter(e => e.errorType === 'http').length,
          appErrors: filteredErrors.filter(e => e.errorType !== 'http').length
        };
        stats.push(filteredStats);
      } else {
        // No filter, return all stats
        stats.push({ ...hourStats });
      }
    }

    return stats;
  }

  /**
   * Get errors filtered by criteria
   */
  getErrors(filters: {
    tenant?: string;
    operation?: string;
    errorType?: string;
    hours?: number;
    startTime?: Date;
    endTime?: Date;
    limit?: number;
  } = {}) {
    let filteredErrors = [...this.errors];

    // Apply time filter
    const now = new Date();
    let cutoffTime: Date;

    if (filters.hours) {
      cutoffTime = new Date(now.getTime() - (filters.hours * 60 * 60 * 1000));
    } else if (filters.startTime) {
      cutoffTime = filters.startTime;
    } else {
      // Default to last 24 hours
      cutoffTime = new Date(now.getTime() - (24 * 60 * 60 * 1000));
    }

    filteredErrors = filteredErrors.filter(error => error.timestamp >= cutoffTime);

    if (filters.endTime) {
      filteredErrors = filteredErrors.filter(error => error.timestamp <= filters.endTime!);
    }

    // Apply other filters
    if (filters.tenant) {
      filteredErrors = filteredErrors.filter(error => error.tenant === filters.tenant);
    }

    if (filters.operation) {
      filteredErrors = filteredErrors.filter(error => error.operation === filters.operation);
    }

    if (filters.errorType) {
      filteredErrors = filteredErrors.filter(error => error.errorType === filters.errorType);
    }

    // Sort by timestamp (newest first) and apply limit
    filteredErrors.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    if (filters.limit) {
      filteredErrors = filteredErrors.slice(0, filters.limit);
    }

    return filteredErrors;
  }

  /**
   * Get error statistics by tenant
   */
  getErrorStatsByTenant(hours: number = 24) {
    const errors = this.getErrors({ hours });

    const stats: Record<string, {
      total: number;
      byType: Record<string, number>;
      byOperation: Record<string, number>;
      recentErrors: TrackedError[];
    }> = {};

    errors.forEach(error => {
      if (!stats[error.tenant]) {
        stats[error.tenant] = {
          total: 0,
          byType: {},
          byOperation: {},
          recentErrors: []
        };
      }

      stats[error.tenant].total++;

      // Count by type
      stats[error.tenant].byType[error.errorType] = (stats[error.tenant].byType[error.errorType] || 0) + 1;

      // Count by operation
      stats[error.tenant].byOperation[error.operation] = (stats[error.tenant].byOperation[error.operation] || 0) + 1;

      // Keep recent errors (last 10 per tenant)
      if (stats[error.tenant].recentErrors.length < 10) {
        stats[error.tenant].recentErrors.push(error);
      }
    });

    return stats;
  }

  /**
   * Get HTTP error statistics (5xx errors)
   */
  getHttpErrors(hours: number = 24) {
    const errors = this.getErrors({ errorType: 'http', hours });

    const httpErrors: Array<{
      tenant: string;
      status: string;
      count: number;
      errorRate: number; // errors per hour
      recentErrors: TrackedError[];
    }> = [];

    const groupedByTenantAndStatus: Record<string, TrackedError[]> = {};

    errors.forEach(error => {
      const key = `${error.tenant}:${error.statusCode || 'unknown'}`;
      if (!groupedByTenantAndStatus[key]) {
        groupedByTenantAndStatus[key] = [];
      }
      groupedByTenantAndStatus[key].push(error);
    });

    Object.entries(groupedByTenantAndStatus).forEach(([key, tenantErrors]) => {
      const [tenant, status] = key.split(':');
      const count = tenantErrors.length;
      const errorRate = count / (hours || 1); // errors per hour

      httpErrors.push({
        tenant,
        status,
        count,
        errorRate,
        recentErrors: tenantErrors.slice(0, 5) // Last 5 errors
      });
    });

    return httpErrors;
  }

  /**
   * Get total error statistics
   */
  getTotalErrorStats(hours: number = 24) {
    const errors = this.getErrors({ hours });
    const totalErrors = errors.length;
    const errorRate = totalErrors / (hours || 1); // errors per hour

    return {
      totalErrors,
      totalErrorRate: errorRate,
      timeRange: `${hours} hours`,
      errorsByType: this.getErrorsByType(errors),
      errorsByTenant: this.getErrorsByTenant(errors)
    };
  }

  /**
   * Get application error statistics
   */
  getApplicationErrors(hours: number = 24) {
    const errors = this.getErrors({ errorType: 'application', hours });

    const appErrors: Array<{
      tenant: string;
      operation: string;
      count: number;
      errorRate: number;
      recentErrors: TrackedError[];
    }> = [];

    const groupedByTenantAndOperation: Record<string, TrackedError[]> = {};

    errors.forEach(error => {
      const key = `${error.tenant}:${error.operation}`;
      if (!groupedByTenantAndOperation[key]) {
        groupedByTenantAndOperation[key] = [];
      }
      groupedByTenantAndOperation[key].push(error);
    });

    Object.entries(groupedByTenantAndOperation).forEach(([key, tenantErrors]) => {
      const [tenant, operation] = key.split(':');
      const count = tenantErrors.length;
      const errorRate = count / (hours || 1);

      appErrors.push({
        tenant,
        operation,
        count,
        errorRate,
        recentErrors: tenantErrors.slice(0, 3)
      });
    });

    return appErrors;
  }

  private getErrorsByType(errors: TrackedError[]) {
    const byType: Record<string, number> = {};
    errors.forEach(error => {
      byType[error.errorType] = (byType[error.errorType] || 0) + 1;
    });
    return byType;
  }

  private getErrorsByTenant(errors: TrackedError[]) {
    const byTenant: Record<string, number> = {};
    errors.forEach(error => {
      byTenant[error.tenant] = (byTenant[error.tenant] || 0) + 1;
    });
    return byTenant;
  }

  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  private cleanupOldErrors() {
    const cutoffTime = new Date(Date.now() - (this.retentionHours * 60 * 60 * 1000));
    this.errors = this.errors.filter(error => error.timestamp >= cutoffTime);
  }

  /**
   * Get all current errors (for debugging)
   */
  getAllErrors() {
    return [...this.errors];
  }

  /**
   * Clear all errors (for testing)
   */
  clearErrors() {
    this.errors = [];
  }
}

// Export singleton instance
export const errorTracker = new ErrorTrackingService();
export default errorTracker;